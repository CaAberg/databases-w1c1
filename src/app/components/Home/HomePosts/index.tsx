'use client'
import { useQuery } from '@tanstack/react-query';
import { getHomePosts, HomePostType } from '@/../utils/supabase/queries';
import { createClient } from '../../../../../utils/supabase/server-client';

const Homeposts = ({ posts }: {posts : HomePostType }) => { 
    const {data} = useQuery({
        queryKey: ['homePosts'],
        queryFn: async () => {
            const supabase = await createClient();
            const{data, error} = await getHomePosts(supabase);
            if (error) {
                throw error;
            }
            return (data);
        },
        initialData: posts,
        refetchOnMount: false,
        refetchInterval: 10000,
    })
}

export default Homeposts;