"use client";

import React from "react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import LayoutMain from "@/components/ui/LayoutMain";
import { FeedbackForm, FeedbackList } from "@/components/feedback";
import { useFeedbacks } from "@/lib/hooks/useFeedbacks";

const FeedbackPage = () => {
  const { fetchFeedbacks } = useFeedbacks();

  const handleFeedbackCreated = () => {
    // Refresh the feedbacks list when a new feedback is created
    fetchFeedbacks();
  };

  return (
    <ProtectedRoute>
      <LayoutMain>
        <div className="py-18 px-36">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Feedback & Suggestions
            </h1>
            <p className="text-gray-600">
              Help us improve Scribal by sharing your thoughts, suggestions, and
              reporting issues.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Feedback Form */}
            <div className="lg:col-span-2 lg:order-1">
              <FeedbackForm onFeedbackCreated={handleFeedbackCreated} />
            </div>

            {/* Feedback List */}
            <div className="lg:col-span-3 lg:order-2">
              <FeedbackList />
            </div>
          </div>
        </div>
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default FeedbackPage;
