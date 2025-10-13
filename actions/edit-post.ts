'use server';
import z from "zod";
import { postSchema } from "./schemas";
import { createClient } from "@/../utils/supabase/server-client";
import { slugify } from "../utils/supabase/slugify";
import { revalidatePath } from "next/cache";
import { uploadImage } from "../utils/supabase/upload-image";

export const EditPost = async ({postId, userdata}: {postId: number, userdata: z.infer<typeof postSchema>}) => {
    try {
        const parsedData = postSchema.parse(userdata)

        const imageFile = userdata.images?.get('images');

        let publicImageUrl;

        if ((typeof imageFile !== 'string') && imageFile !== undefined) {
            if (!(imageFile instanceof File) && imageFile !== null) {
                return { success: false, error: "Invalid image file" };
            }
            publicImageUrl = await uploadImage(imageFile!);
        }
        else {
            publicImageUrl = imageFile;
        }

        const supabase = await createClient();
        const {data: {user}} = await supabase.auth.getUser();
         
        const {data: post, error: fetchError} = await supabase.from('posts').select('*').eq('id', postId).single();
        
        if (fetchError) {
            return { success: false, error: "Post not found" };
        }
        
        if (!user || user.id !== post?.user_id) {
            return { success: false, error: "Not authorized to edit this post" };
        }

        const {data: updatedPost, error: updateError} = 
        await supabase.from('posts')
            .update({...parsedData, images: publicImageUrl, slug: slugify(parsedData.title)})
            .eq('id', postId)
            .select('slug')
            .single();

        if (updateError) {
            return { success: false, error: "Failed to update post" };
        }

        revalidatePath('/');
        return { success: true, slug: updatedPost.slug };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}