"use client";

import React from "react";
import { useRouter } from "next/navigation";

const FeedbackDetailHeader = () => {
  const router = useRouter();

  return (
    <div className="mb-6">
      <button
        onClick={() => router.push("/feedback")}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back to Feedback</span>
      </button>
    </div>
  );
};

export default FeedbackDetailHeader; 