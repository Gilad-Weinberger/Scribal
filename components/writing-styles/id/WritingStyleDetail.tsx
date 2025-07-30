"use client";

import React, { useState } from "react";
import { WritingStyle } from "@/lib/db-schemas";
import { writingStylesAPI } from "@/lib/api-functions";
import { formatDate } from "@/lib/functions/date-formatter";
import { useToast } from "@/components/ui";
import { useRouter } from "next/navigation";

interface WritingStyleDetailProps {
  writingStyle: WritingStyle;
}

interface ToneAnalysis {
  formality?: string;
  emotion?: string;
  confidence?: string;
  engagement?: string;
}

interface WritingPatterns {
  sentenceStructure?: string;
  paragraphLength?: string;
  transitionWords?: string[];
  repetitivePhrases?: string[];
  uniqueCharacteristics?: string[];
}

const WritingStyleDetail: React.FC<WritingStyleDetailProps> = ({
  writingStyle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedName, setEditedName] = useState(writingStyle.styleName);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const toneAnalysis = writingStyle.toneAnalysis as ToneAnalysis;
  const writingPatterns = writingStyle.writingPatterns as WritingPatterns;

  const getToneColor = (formality?: string) => {
    switch (formality) {
      case "formal":
        return "bg-blue-100 text-blue-700";
      case "semi-formal":
        return "bg-purple-100 text-purple-700";
      case "informal":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplexityColor = (score: number) => {
    if (score >= 7) return "text-red-600";
    if (score >= 4) return "text-yellow-600";
    return "text-green-600";
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleDeleteWritingStyle = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this writing style? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await writingStylesAPI.deleteWritingStyle(writingStyle.id);

      if (result.success) {
        showToast("Writing style deleted successfully!", "success");
        router.push("/writing-styles");
      } else {
        showToast("Failed to delete writing style. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error deleting writing style:", error);
      showToast("An error occurred while deleting. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveStyleName = async () => {
    if (editedName.trim() === writingStyle.styleName || !editedName.trim()) {
      setEditedName(writingStyle.styleName);
      return;
    }

    setIsSaving(true);

    try {
      const result = await writingStylesAPI.updateWritingStyle(
        writingStyle.id,
        {
          styleName: editedName.trim(),
        }
      );

      if (result.success) {
        showToast("Writing style name updated successfully!", "success");
        // Refresh the page to get the updated data
        router.refresh();
      } else {
        showToast(
          "Failed to update writing style name. Please try again.",
          "error"
        );
        setEditedName(writingStyle.styleName);
      }
    } catch (error) {
      console.error("Error updating writing style name:", error);
      showToast("An error occurred while updating. Please try again.", "error");
      setEditedName(writingStyle.styleName);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveStyleName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveStyleName();
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === "Escape") {
                  setEditedName(writingStyle.styleName);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="text-3xl font-bold text-gray-900 mb-2 bg-transparent border-b-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none px-1 py-1 w-full transition-colors cursor-pointer"
              placeholder="Enter writing style name"
              disabled={isSaving}
              title="Click to edit style name"
            />
            <p className="text-gray-600">
              Created on {formatDate(writingStyle.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDeleteWritingStyle}
              disabled={isDeleting}
              className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Style"
            >
              {isDeleting ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {writingStyle.vocabularyLevel || 0}
                </div>
                <div className="text-sm text-gray-600">Vocabulary Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {writingStyle.avgSentenceLength || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Avg. Sentence Length
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${getComplexityColor(
                    writingStyle.complexityScore || 0
                  )}`}
                >
                  {writingStyle.complexityScore || 0}
                </div>
                <div className="text-sm text-gray-600">Complexity Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {writingStyle.authenticityBaseline || 0}%
                </div>
                <div className="text-sm text-gray-600">Authenticity</div>
              </div>
            </div>
          </div>

          {/* Tone Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tone Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Formality:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(
                      toneAnalysis?.formality
                    )}`}
                  >
                    {toneAnalysis?.formality || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Emotion:
                  </span>
                  <span className="text-sm text-gray-900 capitalize">
                    {toneAnalysis?.emotion || "Unknown"}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Confidence:
                  </span>
                  <span
                    className={`text-sm font-medium capitalize ${getConfidenceColor(
                      toneAnalysis?.confidence
                    )}`}
                  >
                    {toneAnalysis?.confidence || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Engagement:
                  </span>
                  <span className="text-sm text-gray-900 capitalize">
                    {toneAnalysis?.engagement || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Patterns */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Writing Patterns
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Sentence Structure:
                  </span>
                  <p className="text-sm text-gray-900 capitalize">
                    {writingPatterns?.sentenceStructure || "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Paragraph Length:
                  </span>
                  <p className="text-sm text-gray-900 capitalize">
                    {writingPatterns?.paragraphLength || "Unknown"}
                  </p>
                </div>
              </div>

              {writingPatterns?.uniqueCharacteristics &&
                writingPatterns.uniqueCharacteristics.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Unique Characteristics:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {writingPatterns.uniqueCharacteristics.map(
                        (characteristic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                          >
                            {characteristic}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {writingPatterns?.transitionWords &&
                writingPatterns.transitionWords.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Common Transition Words:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {writingPatterns.transitionWords.map((word, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sample Phrases */}
          {writingStyle.samplePhrases &&
            writingStyle.samplePhrases.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sample Phrases
                </h3>
                <div className="space-y-3">
                  {writingStyle.samplePhrases.map((phrase, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border-l-4 border-primary"
                    >
                      <p className="text-sm text-gray-700 italic">
                        &ldquo;{phrase}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WritingStyleDetail;
