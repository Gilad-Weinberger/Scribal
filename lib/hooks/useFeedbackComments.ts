"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FeedbackComment } from "@/lib/db-schemas";
import { feedbackCommentsAPI } from "@/lib/functions/api-functions";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/context/AuthContext";

interface CommentWithUser extends FeedbackComment {
  user: {
    id: string;
    display_name: string | null;
    profile_picture_url: string | null;
  };
}

export const useFeedbackComments = (feedbackId: string) => {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await feedbackCommentsAPI.getComments(feedbackId);

      if (result.success) {
        setComments(result.comments || []);
      } else {
        setError(result.error || "Failed to fetch comments");
        showToast(result.error || "Failed to fetch comments", "error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch comments";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [feedbackId, showToast]);

  const addComment = useCallback(
    async (content: string) => {
      try {
        const result = await feedbackCommentsAPI.createComment(
          feedbackId,
          content
        );

        if (result.success) {
          setComments((prev) => [...prev, result.comment]);
          return { success: true };
        } else {
          showToast(result.error || "Failed to add comment", "error");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add comment";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [feedbackId, showToast]
  );

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      try {
        const result = await feedbackCommentsAPI.updateComment(
          feedbackId,
          commentId,
          content
        );

        if (result.success) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId ? result.comment : comment
            )
          );
          return { success: true };
        } else {
          showToast(result.error || "Failed to update comment", "error");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update comment";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [feedbackId, showToast]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await feedbackCommentsAPI.deleteComment(
          feedbackId,
          commentId
        );

        if (result.success) {
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId)
          );
          return { success: true };
        } else {
          showToast(result.error || "Failed to delete comment", "error");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete comment";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [feedbackId, showToast]
  );

  const likeComment = useCallback(
    async (commentId: string) => {
      // Optimistically update the UI immediately
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: [...comment.likes, user?.id || "temp-user-id"],
                likesCount: comment.likesCount + 1,
              }
            : comment
        )
      );

      try {
        const result = await feedbackCommentsAPI.likeComment(
          feedbackId,
          commentId
        );

        if (!result.success) {
          // Revert optimistic update on failure
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.likes.filter(
                      (id) => id !== (user?.id || "temp-user-id")
                    ),
                    likesCount: comment.likesCount - 1,
                  }
                : comment
            )
          );
          showToast(result.error || "Failed to like comment", "error");
          return { success: false, error: result.error };
        }

        return { success: true };
      } catch (err) {
        // Revert optimistic update on error
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.likes.filter(
                    (id) => id !== (user?.id || "temp-user-id")
                  ),
                  likesCount: comment.likesCount - 1,
                }
              : comment
          )
        );
        const errorMessage =
          err instanceof Error ? err.message : "Failed to like comment";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [feedbackId, showToast, user?.id]
  );

  const unlikeComment = useCallback(
    async (commentId: string) => {
      // Optimistically update the UI immediately
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: comment.likes.filter(
                  (id) => id !== (user?.id || "temp-user-id")
                ),
                likesCount: Math.max(0, comment.likesCount - 1),
              }
            : comment
        )
      );

      try {
        const result = await feedbackCommentsAPI.unlikeComment(
          feedbackId,
          commentId
        );

        if (!result.success) {
          // Revert optimistic update on failure
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: [...comment.likes, user?.id || "temp-user-id"],
                    likesCount: comment.likesCount + 1,
                  }
                : comment
            )
          );
          showToast(result.error || "Failed to unlike comment", "error");
          return { success: false, error: result.error };
        }

        return { success: true };
      } catch (err) {
        // Revert optimistic update on error
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: [...comment.likes, user?.id || "temp-user-id"],
                  likesCount: comment.likesCount + 1,
                }
              : comment
          )
        );
        const errorMessage =
          err instanceof Error ? err.message : "Failed to unlike comment";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [feedbackId, showToast, user?.id]
  );

  useEffect(() => {
    if (feedbackId) {
      fetchComments();

      // Set up realtime subscription for comments
      const supabase = createClient();

      const channel = supabase
        .channel(`feedback_comments_${feedbackId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "feedback_comments",
            filter: `feedback_id=eq.${feedbackId}`,
          },
          (payload) => {
            console.log("Feedback comments realtime change:", payload);

            // Refresh the comments list when there are changes
            fetchComments();
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [feedbackId, fetchComments]);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
  };
};
