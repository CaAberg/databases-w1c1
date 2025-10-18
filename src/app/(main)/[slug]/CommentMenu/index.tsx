"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "@/../actions/delete-comment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CommentMenuProps = {
  commentId: number;
  onEdit: () => void;
};

const CommentMenu = ({ commentId, onEdit }: CommentMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { mutate: deleteCommentMutation, isPending } = useMutation({
    mutationFn: deleteComment,
    onMutate: () => {
      toast.loading("Deleting comment...", { id: "delete-comment" });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Comment deleted successfully!", { id: "delete-comment" });
        router.refresh();
      } else {
        toast.error(`Failed to delete comment: ${result.error}`, { id: "delete-comment" });
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete comment: ${error.message}`, { id: "delete-comment" });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation(commentId);
      setIsOpen(false);
    }
  };

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Three dots button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Comment options"
        disabled={isPending}
      >
        <svg
          className="w-5 h-5 text-gray-400 hover:text-gray-200"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="py-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors text-left"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
