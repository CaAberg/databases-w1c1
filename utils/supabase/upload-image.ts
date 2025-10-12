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