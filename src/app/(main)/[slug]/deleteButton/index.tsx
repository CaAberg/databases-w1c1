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
            className={`flex items-center gap-2 w-full text-left text-sm text-red-400 hover:bg-gray-700 transition-colors py-2 hover:cursor-pointer ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDelete}
            disabled={isPending}
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
            {isPending ? "Deleting..." : "Delete post"}
        </button>
    )
}

export default DeleteButton;