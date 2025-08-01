"use client";

import React from "react";

interface CommentFormProps {
  commentContent: string;
  setCommentContent: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submittingComment: boolean;
}

const CommentForm = ({
  commentContent,
  setCommentContent,
  onSubmit,
  submittingComment,
}: CommentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="mb-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          maxLength={1000}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {commentContent.length}/1000 characters
        </span>
        <button
          type="submit"
          disabled={submittingComment || !commentContent.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submittingComment ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
