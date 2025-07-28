"use client";

import React from "react";
import Link from "next/link";
import { WritingStyle } from "@/lib/db-schemas";

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {writingStyle.styleName}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(writingStyle.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/writing-styles"
            className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Writing Styles
          </Link>
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

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors font-medium">
                Use This Style
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Edit Style
              </button>
              <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium">
                Delete Style
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingStyleDetail;
