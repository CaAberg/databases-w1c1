'use server'

import { createClient } from "../utils/supabase/server-client";
import { signUpSchema } from "./schemas";
import z from "zod";

export const signUp = async (userdata: z.infer<typeof signUpSchema>) => {
    try {
        const supabase = await createClient()

        const { data: {user}, error } = await supabase.auth.signUp(userdata)
        
        if (error) {
            return { success: false, error: error.message };
        }

        if (user && user.email) {
            const {data, error: dbError} = await supabase.from('users').insert([{
                id: user.id,  
                username: userdata.username, 
                email: user.email
            }])
            
            if (dbError) {
                console.log("Database insert error:", dbError)
                return { success: false, error: "Failed to create user profile" };
            }
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}