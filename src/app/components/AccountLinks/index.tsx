import { createClient } from "../../../../utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => { 

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return ( 
    <div className="flex justify-center w-full">
        { user ?
            <>
            <Link href="/create" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm p-4 text-center m-4">Create post</Link>
            <LogOutButton />
            </>
            : 
            <Link href="/auth/login" className="p-4 bg-gradient-to-br from-green-700 to-green-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm text-center m-4">Log in</Link>
        }
    </div>
    )
}

export default AccountLinks;