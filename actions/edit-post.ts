'use server';
import z from "zod";
import { postSchema } from "./schemas";
import { createClient } from "@/../utils/supabase/server-client";
import { slugify } from "../utils/supabase/slugify";
import { revalidatePath } from "next/cache";
import { uploadMultipleImages } from "../utils/supabase/upload-image";

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

        
        let keptImages: string[] = [];
        
        
        if (userdata.images) {
            const existingImageUrls = userdata.images.getAll('existingImages');
            keptImages = existingImageUrls.filter(url => typeof url === 'string') as string[];
        }

        let newImageUrls: string[] = [];
        
        if (userdata.images) {
            const allImages = userdata.images.getAll('images');
            const imageFiles: File[] = [];
            
            for (const file of allImages) {
                if (file instanceof File && file.size > 0) {
                    imageFiles.push(file);
                }
            }
            
            if (imageFiles.length > 0) {
                try {
                    newImageUrls = await uploadMultipleImages(imageFiles);
                    console.log("New images uploaded:", newImageUrls);
                } catch (uploadError) {
                    console.log("Error uploading images:", uploadError);
                    return { success: false, error: "Failed to upload images" };
                }
            }
        }
        
        const finalImages = [...keptImages, ...newImageUrls];

        const updateData = {
            title: parsedData.title,
            content: parsedData.content,
            images: finalImages,
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
        
        if (error instanceof z.ZodError) {
            return { success: false, error: "Invalid form data: " + error.issues[0].message };
        }
        
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        
        return { success: false, error: "An unexpected error occurred while updating the post" };
    }
}