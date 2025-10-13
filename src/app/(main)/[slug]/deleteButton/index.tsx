'use client'

import { useMutation } from '@tanstack/react-query';
import { DeletePost } from '@/../actions/delete-post';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

 const DeleteButton = ({postId}:{postId: number}) => {
    const router = useRouter();
    
    const {mutate, error} = useMutation({
        mutationFn: DeletePost,
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Post deleted successfully!");
                router.push("/");
            } else {
                toast.error(`Failed to delete post: ${result.error}`);
            }
        },
        onError: (error) => {
            toast.error(`Failed to delete post: ${error.message}`);
        }
    })
    return <button className='bg-red-500 text-white p-2 rounded hover:bg-red-600 hover:cursor-pointer' onClick= {() => mutate(postId)}>Delete post</button>
}

export default DeleteButton;