'use server'

import { createClient } from "../utils/supabase/server-client"
import { revalidatePath } from "next/cache"

export const DeletePost = async (postId : number) => {
    try {
        const supabase = await createClient()

            const { data: existingPost, error: fetchError } = await supabase
            .from("posts")
            .select("id")
            .eq('id', postId)
            .single()

        if (fetchError || !existingPost) {
            return { success: false, error: "Post not found" }
        }

        const { error } = await supabase 
            .from("posts")
            .delete()
            .eq('id', postId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath("/")
        revalidatePath("/[slug]", "page")
        
        return { success: true }
    } catch (error) {
        console.error("Delete post error:", error)
        return { success: false, error: "Failed to delete post" }
    }
}

