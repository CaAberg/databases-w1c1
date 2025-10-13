'use server'
import { createClient } from '../utils/supabase/server-client';
import { logInSchema } from './schemas';
import z from 'zod';


export const LogIn = async (userdata:z.infer<typeof logInSchema>) => {
    try {
        const parsedData = logInSchema.parse(userdata)

        const supabase = await createClient()
        const {data: {user} , error } = await supabase.auth.signInWithPassword(parsedData)

        if (error) {
            return { success: false, error: error.message };
        }
        
        if (user) {
            return { success: true };
        }
        
        return { success: false, error: "Login failed" };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}