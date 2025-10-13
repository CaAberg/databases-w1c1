'use server'

import { createClient } from "../utils/supabase/server-client";

export const LogOut = async () => {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            return { success: false, error: error.message };
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to log out" };
    }
}