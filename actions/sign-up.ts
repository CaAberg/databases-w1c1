'use server'

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server-client";

export const signUp = async (formData: FormData) => {
    const userdata = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string
    }

    const supabase = await createClient()

    const { data: {user}, error } = await supabase.auth.signUp(userdata)
    console.log ("Error:", error, "user:", user)
    if (user && user.email) {
        const {data, error} = await supabase.from('users').insert([{id: user.id, username: userdata.username, email: user.email}])
        console.log (error)
    }
    if (error) throw error
    redirect ("/")
}


    
    