import { createClient } from "../../../../utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => { 

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return ( 
    <div className="flex items-center">
        { user ?
            <>
            <Link href="/create" className="p-4 bg-red-500 mr-4 rounded">Create post</Link>
            <LogOutButton />
            </>
            : 
            <Link href="/auth/login" className="p-4 bg-emerald-700 rounded">Log in</Link>
        }
    </div>
    )
}

export default AccountLinks;