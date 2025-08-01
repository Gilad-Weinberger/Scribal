"use client";

import React, { useState } from "react";
import { Feedback } from "@/lib/db-schemas";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import Link from "next/link";

interface FeedbackCardProps {
  feedback: Feedback & { commentsCount?: number };
  onUpvoteChange: (feedbackId: string, hasUpvoted: boolean) => Promise<void>;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onUpvoteChange,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isUpvoting, setIsUpvoting] = useState(false);

  const hasUpvoted = user ? feedback.upvotes.includes(user.id) : false;

  const handleUpvote = async () => {
    if (!user) {
      showToast("Please sign in to upvote", "error");
      return;
    }

    setIsUpvoting(true);

    try {
      await onUpvoteChange(feedback.id, hasUpvoted);
    } catch (error) {
      console.error("Error updating upvote:", error);
      showToast("Failed to update upvote", "error");
    } finally {
      setIsUpvoting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "feature":
        return "bg-blue-100 text-blue-800";
      case "bug":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 pr-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feedback.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {feedback.description}
          </p>
        </div>
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-lg transition-colors ${
            hasUpvoted
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg
            className={`w-4 h-4 mb-0.5 ${
              hasUpvoted ? "text-blue-600" : "text-gray-500"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
            />
          </svg>
          <span className="text-md font-medium">{feedback.upvoteCount}</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
              feedback.category
            )}`}
          >
            {feedback.category.charAt(0).toUpperCase() +
              feedback.category.slice(1)}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              feedback.status
            )}`}
          >
            {feedback.status.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={`/feedback/${feedback.id}`}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{feedback.commentsCount || 0} comments</span>
          </Link>
          <span className="text-sm text-gray-500">
            {formatDate(feedback.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
