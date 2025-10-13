'use client'

import { useMutation } from '@tanstack/react-query';
import { DeletePost } from '@/../actions/delete-post';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

 const DeleteButton = ({postId}:{postId: number}) => {
    const router = useRouter();
    
    const {mutate, isPending} = useMutation({
        mutationFn: DeletePost,
        onMutate: () => {
            toast.loading("Deleting post...", { id: "delete-post" });
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Post deleted successfully!", { id: "delete-post" });
                // Use router.replace instead of push to avoid back button issues
                setTimeout(() => {
                    router.replace("/");
                }, 800);
            } else {
                toast.error(`Failed to delete post: ${result.error}`, { id: "delete-post" });
            }
        },
        onError: (error) => {
            toast.error(`Failed to delete post: ${error.message}`, { id: "delete-post" });
        }
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            mutate(postId);
        }
    };

    return (
        <button 
            className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? "Deleting..." : "Delete post"}
        </button>
    )
}

export default DeleteButton;