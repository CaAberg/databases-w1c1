import { getHomePosts } from "@/../utils/supabase/queries";
import { createClient } from "@/../utils/supabase/server-client";
import Link from "next/link";

export const revalidate = 600 ;

export default async function Home() {

  const supabase = await createClient();
  const {data, error} = await getHomePosts(supabase);
  if (error) {
    throw error;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center p-4">
      
        {data && data.map
        (({id, slug, title, users}) => 
          
          <Link href={`/${slug}`} key={id} className="w-full max-w-2xl p-4 m-4 border-b border-gray-300 shadow-md">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600">by {users.username}</p>
            </Link>
        )
      }
      </div>
    
  );
}