"use client";

import React, { useState } from "react";
import { feedbacksAPI } from "@/lib/functions/api-functions";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import CategoryButton from "./CategoryButton";

interface FeedbackFormProps {
  onFeedbackCreated: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onFeedbackCreated }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "feature" as "feature" | "bug",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);

    try {
      const result = await feedbacksAPI.createFeedback(formData);

      if (result.success) {
        setFormData({
          title: "",
          description: "",
          category: "feature",
        });
        onFeedbackCreated();
        showToast("Feedback submitted successfully!", "success");
      } else {
        showToast(result.error || "Failed to submit feedback", "error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showToast("Failed to submit feedback", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Submit Feedback
        </h2>
        <p className="text-gray-600 text-sm">
          Share your thoughts, suggestions, or report issues to help us improve
          Scribal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            minLength={3}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief title for your feedback"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CategoryButton
              category="feature"
              isSelected={formData.category === "feature"}
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "feature" }))
              }
            />
            <CategoryButton
              category="bug"
              isSelected={formData.category === "bug"}
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "bug" }))
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Please provide detailed description of your feedback..."
          />
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.title.trim() ||
            !formData.description.trim()
          }
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
