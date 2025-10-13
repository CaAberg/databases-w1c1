'use server'

import { z } from 'zod';
import { postSchema } from './schemas'
import { createClient } from '../utils/supabase/server-client';
import { slugify } from '../utils/supabase/slugify';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '../utils/supabase/upload-image';


export const CreatePost = async (userdata: z.infer<typeof postSchema>) => {
    try {
        const parsedData = postSchema.parse(userdata);
        const slug = slugify(parsedData.title);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) { 
            return { success: false, error: "Not authorized" };
        }

        const userId = user.id;
        
        const imageFile = userdata.images?.get('images');
        
        if (imageFile && !(imageFile instanceof File)) {
            return { success: false, error: "Invalid image file" };
        }

        const publicImageUrl = (imageFile instanceof File) ? await uploadImage(imageFile) : null;
        
        const {error} = await supabase.from('posts')
            .insert([{
                user_id: userId,
                slug: slug,
                ...parsedData,
                images: publicImageUrl,
            }]);
            
        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/");
        return { success: true, slug };
    } catch (error) {
        console.error("Create post error:", error);
        return { success: false, error: "Failed to create post" };
    }
}
