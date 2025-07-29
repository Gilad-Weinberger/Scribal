"use client";

import React from "react";
import Link from "next/link";
import { WritingStyle } from "@/lib/db-schemas";
import { getAuthenticityLevel } from "@/lib/functions/authenticity-calculator";

interface WritingStyleCardProps {
  style: WritingStyle;
}

const WritingStyleCard: React.FC<WritingStyleCardProps> = ({ style }) => {
  const authenticityLevel = getAuthenticityLevel(style.authenticityBaseline);

  const getComplexityDescription = (score: number): string => {
    if (score >= 8) return "Advanced";
    if (score >= 6) return "Intermediate";
    if (score >= 4) return "Basic";
    return "Simple";
  };

  const getVocabularyDescription = (level: number): string => {
    if (level >= 8) return "Sophisticated";
    if (level >= 6) return "Varied";
    if (level >= 4) return "Standard";
    return "Basic";
  };

  return (
    <Link href={`/writing-styles/${style.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 p-5 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2 truncate">
              {style.styleName}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold">
                {getComplexityDescription(style.complexityScore || 0)}
              </span>
              <span className="text-gray-400 text-xs">complexity</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold">
                {getVocabularyDescription(style.vocabularyLevel || 0)}
              </span>
              <span className="text-gray-400 text-xs">vocabulary</span>
            </div>
          </div>
        </div>

        {/* Key Metrics with Real-World Formulas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {style.avgSentenceLength || 0}
            </div>
            <div className="text-xs text-gray-500">Avg. Length</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className={`text-lg font-bold ${authenticityLevel.color}`}>
              {style.authenticityBaseline || 0}%
            </div>
            <div className="text-xs text-gray-500">Authenticity</div>
          </div>
        </div>

        {/* Sample Phrase */}
        {style.samplePhrases && style.samplePhrases.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Sample phrase:</p>
            <p className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded">
              &ldquo;{style.samplePhrases[0]}&rdquo;
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="truncate">
            {new Date(style.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View details</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WritingStyleCard;
