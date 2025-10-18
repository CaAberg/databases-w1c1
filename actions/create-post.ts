'use server'

import { z } from 'zod';
import { postSchema } from './schemas'
import { createClient } from '../utils/supabase/server-client';
import { slugify } from '../utils/supabase/slugify';
import { revalidatePath } from 'next/cache';
import { uploadMultipleImages } from '../utils/supabase/upload-image';


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
        
        
        const imageFiles: File[] = [];
        if (userdata.images) {
            const formData = userdata.images;
            const allImages = formData.getAll('images');
            for (const file of allImages) {
                if (file instanceof File) {
                    imageFiles.push(file);
                }
            }
        }

        
        let imageUrls: string[] | null = null;
        if (imageFiles.length > 0) {
            imageUrls = await uploadMultipleImages(imageFiles);
        }
        
        const {error} = await supabase.from('posts')
            .insert([{
                user_id: userId,
                slug: slug,
                title: parsedData.title,
                content: parsedData.content,
                images: imageUrls,
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
