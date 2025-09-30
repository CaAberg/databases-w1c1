'use server'

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server-client";
import { signUpSchema } from "./schemas";
import z from "zod";

export const signUp = async (userdata: z.infer<typeof signUpSchema>) => {

    const supabase = await createClient()

    const { data: {user}, error } = await supabase.auth.signUp(userdata)
    

    if (user && user.email) {
        const {data, error} = await supabase.from('users').insert([{id: user.id, username: userdata.username, email: user.email}])
        console.log (error)
    }
    if (error) throw error
    redirect ("/")
}