"use client";

import React, { useState } from "react";
import FeedbackCard from "./FeedbackCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFeedbacks } from "@/lib/hooks/useFeedbacks";

const FeedbackList: React.FC = () => {
  const [sortBy, setSortBy] = useState<"upvotes" | "date">("upvotes");
  const { feedbacks, isLoading, error, upvoteFeedback, removeUpvote } =
    useFeedbacks();

  const handleUpvoteChange = async (
    feedbackId: string,
    hasUpvoted: boolean
  ) => {
    if (hasUpvoted) {
      await removeUpvote(feedbackId);
    } else {
      await upvoteFeedback(feedbackId);
    }
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortBy === "upvotes") {
      return b.upvoteCount - a.upvoteCount;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading feedbacks
          </h3>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Feedbacks
          </h2>
          <p className="text-gray-600 text-sm">
            {feedbacks.length} feedback item{feedbacks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setSortBy("upvotes")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                sortBy === "upvotes"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Hottest</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy("date")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                sortBy === "date"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Recent</span>
            </button>
          </div>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No feedback yet
          </h3>
          <p className="text-gray-500 text-sm">
            Be the first to share your thoughts and suggestions!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onUpvoteChange={handleUpvoteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
