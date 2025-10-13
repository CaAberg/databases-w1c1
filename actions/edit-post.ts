'use server';
import z from "zod";
import { postSchema } from "./schemas";
import { createClient } from "@/../utils/supabase/server-client";
import { slugify } from "../utils/supabase/slugify";
import { revalidatePath } from "next/cache";
import { uploadImage } from "../utils/supabase/upload-image";

export const EditPost = async ({postId, userdata}: {postId: number, userdata: z.infer<typeof postSchema>}) => {
    try {
        console.log("EditPost called with:", { postId, userdata });
        
        const parsedData = postSchema.parse(userdata);
        console.log("Parsed data:", parsedData);

        const supabase = await createClient();
        const {data: {user}} = await supabase.auth.getUser();
        
        if (!user) {
            console.log("No user found");
            return { success: false, error: "Not authenticated" };
        }

        // First get the existing post
        const {data: post, error: fetchError} = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();
        
        if (fetchError) {
            console.log("Error fetching post:", fetchError);
            return { success: false, error: "Post not found" };
        }
        
        if (user.id !== post?.user_id) {
            console.log("User not authorized:", user.id, "vs", post?.user_id);
            return { success: false, error: "Not authorized to edit this post" };
        }

        // Handle image upload
        let publicImageUrl = post.images; // Keep existing image by default
        
        if (userdata.images) {
            const imageFile = userdata.images.get('images');
            console.log("Image file:", imageFile);
            
            if (imageFile && imageFile instanceof File) {
                try {
                    publicImageUrl = await uploadImage(imageFile);
                    console.log("New image uploaded:", publicImageUrl);
                } catch (uploadError) {
                    console.log("Error uploading image:", uploadError);
                    return { success: false, error: "Failed to upload image" };
                }
            }
        }

        // Update the post
        const updateData = {
            title: parsedData.title,
            content: parsedData.content,
            images: publicImageUrl,
            slug: slugify(parsedData.title)
        };
        
        console.log("Updating post with:", updateData);

        const {data: updatedPost, error: updateError} = 
        await supabase.from('posts')
            .update(updateData)
            .eq('id', postId)
            .select('slug')
            .single();

        if (updateError) {
            console.log("Error updating post:", updateError);
            return { success: false, error: updateError.message };
        }

        console.log("Post updated successfully:", updatedPost);

        revalidatePath('/');
        revalidatePath('/[slug]', 'page');
        
        return { success: true, slug: updatedPost.slug };
    } catch (error) {
        console.error("EditPost error:", error);
        
        // Provide more specific error messages
        if (error instanceof z.ZodError) {
            return { success: false, error: "Invalid form data: " + error.issues[0].message };
        }
        
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        
        return { success: false, error: "An unexpected error occurred while updating the post" };
    }
}