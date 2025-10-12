'use server'

import { z } from 'zod';
import { postSchema } from './schemas'
import { createClient } from '../utils/supabase/server-client';
import { slugify } from '../utils/supabase/slugify';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '../utils/supabase/upload-image';


export const CreatePost = async (userdata: z.infer<typeof postSchema>) => {

    console.log("image param:", userdata.images);
    const parsedData = postSchema.parse(userdata);
    const slug = slugify(parsedData.title);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { throw new Error("Not Authorized!"); }

    const userId = user.id;
    
    const imageFile = userdata.images?.get('images');
    
    if (!(imageFile instanceof File) && imageFile !== null) {
        throw new Error("Invalid image file");
    }

    const publicImageUrl = imageFile ? await uploadImage(imageFile) : null;
    
     const {data, error} = await supabase.from('posts')
        .insert([{
            user_id: userId,
            slug: slug,
            ...parsedData,
            images: publicImageUrl,
        }])
        .throwOnError();
        if (error) {
            console.log("Error inserting post:", error);
        }

    revalidatePath("/");
    redirect(`/${slug}`);
}
