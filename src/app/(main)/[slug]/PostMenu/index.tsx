"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DeleteButton from "../deleteButton";

type PostMenuProps = {
  slug: string;
  postId: number;
};

const PostMenu = ({ slug, postId }: PostMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Post options"
      >
        <svg
          className="w-6 h-6 text-gray-400 hover:text-gray-200"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="py-2">
            <Link
              href={`/${slug}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
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
              Edit post
            </Link>
            <div className="border-t border-gray-700 my-1"></div>
            <div className="px-4 py-2">
              <DeleteButton postId={postId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMenu;
