"use client";

import React from "react";
import Image from "next/image";

interface CommentUser {
  id: string;
  display_name: string | null;
  profile_picture_url: string | null;
}

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    likes: string[];
    likesCount: number;
    user: CommentUser;
  };
  currentUserId?: string;
  hasLiked: boolean;
  onLike: (commentId: string, hasLiked: boolean) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  currentUserId,
  hasLiked,
  onLike,
  onDelete,
}: CommentItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOwner = currentUserId && comment.userId === currentUserId;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {comment.user?.profile_picture_url ? (
              <Image
                src={comment.user.profile_picture_url}
                alt={comment.user.display_name || "User"}
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {comment.user?.display_name?.[0] || "U"}
              </span>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {comment.user?.display_name || "Anonymous"}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-700 mb-3">{comment.content}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onLike(comment.id, hasLiked)}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            hasLiked
              ? "text-red-600 hover:text-red-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg
            className={`w-4 h-4 ${hasLiked ? "fill-current" : "fill-none"}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{comment.likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
