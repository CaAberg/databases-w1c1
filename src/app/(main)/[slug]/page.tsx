import { getSinglePost } from "@/../utils/supabase/queries";
import { createClient } from "../../../../utils/supabase/server-client";
import Comments from "./Comments";
import PostMenu from "./PostMenu";
import ImageCarousel from "@/app/components/ImageCarousel";


export const revalidate = 60;

const SinglePost = async ({ params }: {params: {slug: string}} ) => { 
    const { slug } = await params
    const {data} = await getSinglePost(slug);

    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()
    const isAuthor = user?.id === data?.user_id ? true : false
      
    return (
        <>
        
            {data && 
            <>
            <div className="flex flex-col items-center justify-center w-full p-4">
                <div className="w-full max-w-xl p-4 border border-gray-700 mt-4 rounded-2xl relative">
                    {isAuthor && (
                        <div className="absolute top-4 right-4">
                            <PostMenu slug={slug} postId={data.id} />
                        </div>
                    )}
                    <h2 className="text-3xl font-bold p-4 text-center">{data.title}</h2>
                    <p className="text-gray-500 p-2 text-center text-sm">
                        Posted by <span className="font-semibold text-gray-700">{data.users?.username}</span>
                    </p>
                    {data.images && data.images.length > 0 && (
                        <div className="px-4">
                            <ImageCarousel images={data.images} />
                        </div>
                    )}
                    {data.content && (
                        <div className="p-4 mt-4 text-center border-t border-gray-700">
                            {data.content}
                        </div>
                    )}
                </div>
                <Comments postId={data.id} userId={user?.id} />
            </div> 
            </>
            }
            
        </>
        )
        
    }

    export default SinglePost;