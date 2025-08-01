"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Feedback } from "@/lib/db-schemas";
import { feedbacksAPI } from "@/lib/functions/api-functions";
import { useToast } from "@/components/ui/ToastProvider";

export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await feedbacksAPI.getAllFeedbacks();

      if (result.success) {
        setFeedbacks(result.feedbacks || []);
      } else {
        setError(result.error || "Failed to fetch feedbacks");
        showToast(result.error || "Failed to fetch feedbacks", "error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch feedbacks";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const upvoteFeedback = useCallback(
    async (feedbackId: string) => {
      // Find the current feedback to get the exact upvote count
      const currentFeedback = feedbacks.find((f) => f.id === feedbackId);
      if (!currentFeedback) return;

      // Optimistically update the UI immediately
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === feedbackId
            ? {
                ...feedback,
                upvoteCount: feedback.upvoteCount + 1,
                upvotes: [...feedback.upvotes, currentFeedback.userId], // Add current user to upvotes
              }
            : feedback
        )
      );

      // Fire and forget API call - don't wait for response
      feedbacksAPI.upvoteFeedback(feedbackId).catch((err) => {
        // Only revert if there's an actual error
        console.error("Upvote failed:", err);
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.id === feedbackId
              ? {
                  ...feedback,
                  upvoteCount: currentFeedback.upvoteCount,
                  upvotes: currentFeedback.upvotes,
                }
              : feedback
          )
        );
        showToast("Failed to upvote feedback", "error");
      });
    },
    [feedbacks, showToast]
  );

  const removeUpvote = useCallback(
    async (feedbackId: string) => {
      // Find the current feedback to get the exact upvote count
      const currentFeedback = feedbacks.find((f) => f.id === feedbackId);
      if (!currentFeedback) return;

      // Optimistically update the UI immediately
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === feedbackId
            ? {
                ...feedback,
                upvoteCount: Math.max(0, feedback.upvoteCount - 1),
                upvotes: feedback.upvotes.filter(
                  (id) => id !== currentFeedback.userId
                ), // Remove current user from upvotes
              }
            : feedback
        )
      );

      // Fire and forget API call - don't wait for response
      feedbacksAPI.removeUpvote(feedbackId).catch((err) => {
        // Only revert if there's an actual error
        console.error("Remove upvote failed:", err);
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.id === feedbackId
              ? {
                  ...feedback,
                  upvoteCount: currentFeedback.upvoteCount,
                  upvotes: currentFeedback.upvotes,
                }
              : feedback
          )
        );
        showToast("Failed to remove upvote", "error");
      });
    },
    [feedbacks, showToast]
  );

  useEffect(() => {
    fetchFeedbacks();

    // Set up realtime subscription
    const supabase = createClient();

    const channel = supabase
      .channel("feedbacks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feedbacks",
        },
        (payload) => {
          console.log("Feedbacks realtime change:", payload);

          // Refresh the feedbacks list when there are changes
          fetchFeedbacks();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFeedbacks]); // Include fetchFeedbacks in dependencies

  return {
    feedbacks,
    isLoading,
    error,
    fetchFeedbacks,
    upvoteFeedback,
    removeUpvote,
  };
};
