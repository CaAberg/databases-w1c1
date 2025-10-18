'use server'
import {v4 as uuid} from 'uuid';
import { createClient } from './server-client';

export const uploadImage = async (images: File) => {

    const supabase = await createClient()

    const imagesName: string[] = images.name.split('.')
    const path:string = `${imagesName[0]}-${uuid()}.${imagesName[1]}`

    const {data, error} = await supabase.storage.from('images').upload(path, images)
    if (error) throw error

    const {data:{publicUrl}} = await supabase.storage
                            .from('images')
                            .getPublicUrl(data.path)
    return publicUrl
}

export const uploadMultipleImages = async (imageFiles: File[]): Promise<string[]> => {
    const supabase = await createClient();
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
        const imageName: string[] = file.name.split('.');
        const path: string = `${imageName[0]}-${uuid()}.${imageName[1]}`;

        const { data, error } = await supabase.storage.from('images').upload(path, file);
        if (error) throw error;

        const { data: { publicUrl } } = await supabase.storage
            .from('images')
            .getPublicUrl(data.path);
        
        uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
}