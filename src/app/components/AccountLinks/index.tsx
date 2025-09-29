import { createClient } from "../../../../utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => { 

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    supabase.auth.signOut();

    
    return ( 
    <div className="flex gap-4">
        {   
            user ?
            <>
            <Link href="/create" className="p-4 bg-black mr-4 rounded">Create post</Link>
            <LogOutButton />
            </>
            : 
        <Link href="auth/login" className="p-4 bg-emerald-700 rounded">Login</Link>
        }
    </div>
    );
}

export default AccountLinks;