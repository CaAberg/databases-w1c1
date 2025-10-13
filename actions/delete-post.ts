'use server'

import { redirect } from "next/navigation"
import { createClient } from "../utils/supabase/server-client"
import { revalidatePath } from "next/cache"

 export const DeletePost = async (postId : number) => {
    try {
        const supabase = await createClient()
        const { error } = await supabase 
        .from ("posts")
        .delete()
        .eq('id', postId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete post" }
    }
}

