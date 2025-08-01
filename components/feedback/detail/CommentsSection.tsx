"use client";

import React from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentUser {
  id: string;
  display_name: string | null;
  profile_picture_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  likes: string[];
  likesCount: number;
  user: CommentUser;
}

interface CommentsSectionProps {
  comments: Comment[];
  commentContent: string;
  setCommentContent: (content: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  submittingComment: boolean;
  currentUserId?: string;
  onLikeComment: (commentId: string, hasLiked: boolean) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentsSection = ({
  comments,
  commentContent,
  setCommentContent,
  onSubmitComment,
  submittingComment,
  currentUserId,
  onLikeComment,
  onDeleteComment,
}: CommentsSectionProps) => {
  return (
    <div className="w-[65%]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        <CommentForm
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          onSubmit={onSubmitComment}
          submittingComment={submittingComment}
        />

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => {
              const hasLiked = currentUserId
                ? comment.likes.includes(currentUserId)
                : false;

              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  hasLiked={hasLiked}
                  onLike={onLikeComment}
                  onDelete={onDeleteComment}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
