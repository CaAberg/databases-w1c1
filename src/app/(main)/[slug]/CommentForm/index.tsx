"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createComment } from "@/../actions/create-comment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CommentFormProps = {
  postId: number;
  userId: string;
};

const CommentForm = ({ postId, userId }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onMutate: () => {
      toast.loading("Adding comment...", { id: "create-comment" });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment added successfully!", { id: "create-comment" });
        setContent("");
        router.refresh();
      } else {
        toast.error(`Failed to add comment: ${result.error}`, { id: "create-comment" });
      }
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`, { id: "create-comment" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    mutate({ post_id: postId, user_id: userId, content });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="p-4 border border-gray-700 rounded-2xl">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-600 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
          disabled={isPending}
        />
        <div className="flex justify-center mt-3">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-6 py-2 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
