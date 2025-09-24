import { getSinglePost } from "@/../utils/supabase/queries";

const SinglePost = async ({ params }: {params: {slug: string}} ) => { 
    const { slug } = await params;
    const {data} = await getSinglePost(slug);
      
    return (
        <>
            {data && 
            <div className="flex flex-col items-center justify-center w-full p-4">
                <div className="w-full max-w-xl p-4 border border-gray-700 mt-4 rounded-2xl">
                    <h2 className="text-3xl font-bold p-4">{data.title}</h2>
                    <p className="text-gray-600 p-4">by {data.users?.username}</p>
                </div>

                <div className="w-full max-w-xl p-4 border border-gray-700 mt-4 rounded-2xl text-center">
                    {data.content && <div>{data.content}</div>}
                </div>
            </div>
            }
        </>
        )
    }

    export default SinglePost;