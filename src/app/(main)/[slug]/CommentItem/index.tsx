"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { editComment } from "@/../actions/edit-comment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CommentMenu from "../CommentMenu";

type CommentItemProps = {
  comment: {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    users: { username: string } | null;
  };
  currentUserId: string | undefined;
};

const CommentItem = ({ comment, currentUserId }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const router = useRouter();

  const isOwner = currentUserId === comment.user_id;
  
  /*
     Check if comment was edited (updated_at is different from created_at)
     Only show edited if both timestamps exist and differ by more than 1 second
  */
  const isEdited = comment.updated_at && comment.created_at &&
    new Date(comment.updated_at).getTime() > new Date(comment.created_at).getTime() + 1000;

  const { mutate, isPending } = useMutation({
    mutationFn: editComment,
    onMutate: () => {
      toast.loading("Updating comment...", { id: "edit-comment" });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment updated successfully!", { id: "edit-comment" });
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(`Failed to update comment: ${result.error}`, { id: "edit-comment" });
      }
    },
    onError: (error) => {
      toast.error(`Failed to update comment: ${error.message}`, { id: "edit-comment" });
    },
  });

  const handleSave = () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    mutate({ comment_id: comment.id, content: editContent });
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="p-4 border border-gray-700 rounded-2xl relative">
      {isOwner && !isEditing && (
        <div className="absolute top-2 right-2">
          <CommentMenu commentId={comment.id} onEdit={() => setIsEditing(true)} />
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-gray-900">{comment.users?.username}</span>
        <span className="text-gray-500 text-sm">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
        {isEdited && (
          <span className="text-gray-400 text-xs italic">(edited)</span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-600 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
            disabled={isPending}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || !editContent.trim()}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-900">{comment.content}</p>
      )}
    </div>
  );
};

export default CommentItem;
