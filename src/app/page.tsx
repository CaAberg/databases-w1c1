import { getHomePosts } from "../../utils/supabase/queries";
import Homeposts from "./components/Home/HomePosts";
import { createClient } from "../../utils/supabase/browser-client";

export default async function Home() {

  const supabase = await createClient();
  
  const {data, error} = await getHomePosts(supabase);
    
    if (error) { 
      console.error("Error fetching posts:", error);
      return <div className="w-full flex justify-center items-center p-4">Error loading posts</div>;
    } 

  return (
    <div className="w-full flex flex-col justify-center items-center p-4">
      <Homeposts posts={data!}/>
    </div>
  );
}