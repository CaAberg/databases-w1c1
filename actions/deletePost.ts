'use server'

import { redirect } from "next/navigation"
import { createClient } from "../utils/supabase/server-client"

 export const DeletePost = async (postId : number) => {
    const supabase = await createClient()
    await supabase 
    .from ("posts")
    .delete()
    .eq('id', postId)
    .throwOnError()

    redirect("/")
}

