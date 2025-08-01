"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import LayoutMain from "@/components/ui/LayoutMain";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { feedbacksAPI } from "@/lib/functions/api-functions";
import { Feedback } from "@/lib/db-schemas";
import { useFeedbackComments } from "@/lib/hooks/useFeedbackComments";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  FeedbackDetailHeader,
  FeedbackDetailCard,
  CommentsSection,
} from "@/components/feedback";

const FeedbackDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const feedbackId = params.id as string;
  const {
    comments,
    isLoading: commentsLoading,
    addComment,
    deleteComment,
    likeComment,
    unlikeComment,
  } = useFeedbackComments(feedbackId);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const feedbackResponse = await feedbacksAPI.getFeedback(feedbackId);

      if (feedbackResponse.success) {
        setFeedback(feedbackResponse.feedback);
      } else {
        showToast("Failed to load feedback", "error");
        router.push("/feedback");
        return;
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      showToast("Failed to load feedback", "error");
      router.push("/feedback");
    } finally {
      setLoading(false);
    }
  }, [feedbackId, showToast, router]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleUpvote = async () => {
    if (!user) {
      showToast("Please sign in to upvote", "error");
      return;
    }

    if (!feedback) return;

    setUpvoting(true);
    try {
      const hasUpvoted = feedback.upvotes.includes(user.id);
      const response = hasUpvoted
        ? await feedbacksAPI.removeUpvote(feedback.id)
        : await feedbacksAPI.upvoteFeedback(feedback.id);

      if (response.success) {
        setFeedback(response.feedback);
      } else {
        showToast(response.error || "Failed to update upvote", "error");
      }
    } catch (error) {
      console.error("Error updating upvote:", error);
      showToast("Failed to update upvote", "error");
    } finally {
      setUpvoting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please sign in to comment", "error");
      return;
    }

    if (!commentContent.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    setSubmittingComment(true);
    try {
      const result = await addComment(commentContent.trim());
      if (result.success) {
        setCommentContent("");
        showToast("Comment added successfully", "success");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      showToast("Failed to add comment", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string, hasLiked: boolean) => {
    if (!user) {
      showToast("Please sign in to like comments", "error");
      return;
    }

    try {
      const result = hasLiked
        ? await unlikeComment(commentId)
        : await likeComment(commentId);

      if (!result.success) {
        showToast(result.error || "Failed to update like", "error");
      }
    } catch (error) {
      console.error("Error updating comment like:", error);
      showToast("Failed to update like", "error");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        showToast("Comment deleted successfully", "success");
      } else {
        showToast(result.error || "Failed to delete comment", "error");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", "error");
    }
  };

  if (loading || commentsLoading) {
    return (
      <ProtectedRoute>
        <LayoutMain>
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        </LayoutMain>
      </ProtectedRoute>
    );
  }

  if (!feedback) {
    return (
      <ProtectedRoute>
        <LayoutMain>
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Feedback not found
              </h1>
              <button
                onClick={() => router.push("/feedback")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Feedback
              </button>
            </div>
          </div>
        </LayoutMain>
      </ProtectedRoute>
    );
  }

  const hasUpvoted = user ? feedback.upvotes.includes(user.id) : false;

  return (
    <ProtectedRoute>
      <LayoutMain>
        <div className="py-18 px-36">
          <FeedbackDetailHeader title={feedback.title} />

          {/* Main Content Layout */}
          <div className="flex gap-8">
            <FeedbackDetailCard
              feedback={feedback}
              hasUpvoted={hasUpvoted}
              upvoting={upvoting}
              onUpvote={handleUpvote}
            />

            <CommentsSection
              comments={comments}
              commentContent={commentContent}
              setCommentContent={setCommentContent}
              onSubmitComment={handleSubmitComment}
              submittingComment={submittingComment}
              currentUserId={user?.id}
              onLikeComment={handleLikeComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </div>
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default FeedbackDetailPage;
