'use server'

import { z } from 'zod';
import { postSchema } from './schemas'
import { createClient } from '../utils/supabase/server-client';
import { slugify } from '../utils/supabase/slugify';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '../utils/supabase/upload-image';


export const CreatePost = async (userdata: z.infer<typeof postSchema>) => {
    try {
        console.log("image param:", userdata.images);
        const parsedData = postSchema.parse(userdata);
        const slug = slugify(parsedData.title);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { 
            return { success: false, error: "Not authorized! Please log in." };
        }

        const userId = user.id;
        
        const imageFile = userdata.images?.get('images');
        
        if (!(imageFile instanceof File) && imageFile !== null) {
            return { success: false, error: "Invalid image file" };
        }

        const publicImageUrl = imageFile ? await uploadImage(imageFile) : null;
        
        const {data, error} = await supabase.from('posts')
            .insert([{
                user_id: userId,
                slug: slug,
                ...parsedData,
                images: publicImageUrl,
            }])
            .select('slug')
            .single();

        if (error) {
            console.log("Error inserting post:", error);
            return { success: false, error: "Failed to create post" };
        }

        revalidatePath("/");
        return { success: true, slug: data.slug };
    } catch (error) {
        console.error("Create post error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
