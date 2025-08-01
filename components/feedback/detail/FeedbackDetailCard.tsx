"use client";

import React from "react";
import { Feedback } from "@/lib/db-schemas";

interface FeedbackDetailCardProps {
  feedback: Feedback;
  hasUpvoted: boolean;
  upvoting: boolean;
  onUpvote: () => void;
}

const FeedbackDetailCard = ({
  feedback,
  hasUpvoted,
  upvoting,
  onUpvote,
}: FeedbackDetailCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="w-[35%]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {feedback.title}
            </h1>
            <p className="text-gray-600 mb-4">{feedback.description}</p>
          </div>
          <button
            onClick={onUpvote}
            disabled={upvoting}
            className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-colors ${
              hasUpvoted
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className={`w-5 h-5 mb-1 ${
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
            <span className="text-lg font-medium">
              {feedback.upvoteCount}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                feedback.category
              )}`}
            >
              {feedback.category.charAt(0).toUpperCase() +
                feedback.category.slice(1)}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                feedback.status
              )}`}
            >
              {feedback.status.replace("_", " ")}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(feedback.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailCard; 