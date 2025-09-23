'use client'
import { useQuery } from '@tanstack/react-query';
import { getHomePosts, HomePostType } from '@/../utils/supabase/queries';
import Link from 'next/link';
import { createClient } from '../../../../../utils/supabase/browser-client';

const Homeposts = ({ posts }: {posts : HomePostType }) => { 
    const {data} = useQuery({
        queryKey: ['homePosts'],
        queryFn: async () => {
            const supabase = await createClient();
            const{data, error} = await getHomePosts(supabase);
            if (error) {
                throw error;
            }
            return data;
        },
        initialData: posts,
        refetchOnMount: false,
        staleTime: 10000,
        refetchInterval: 60000,
    })

    return (
        <>
        {data && data.map
        (({id, slug, title, users}) => 
          
          <Link href={`/${slug}`} key={id} className="w-full max-w-2xl p-4 m-4 border-b border-gray-300 shadow-md">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600">by {users.username}</p>
            </Link>
        )
      }
      </>
     )
}

export default Homeposts;