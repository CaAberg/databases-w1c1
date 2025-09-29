'use server'

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server-client";

export const LogOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect ("/");
}