"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { writingStylesAPI } from "@/lib/functions/api-functions";

interface ToneAnalysis {
  formality?: string;
  emotion?: string;
}

interface WritingStyle {
  id: string;
  styleName: string;
  vocabularyLevel: number | null;
  toneAnalysis: ToneAnalysis;
}

interface WritingStyleSelectorProps {
  userId: string;
  selectedWritingStyleId?: string;
  onWritingStyleChange: (writingStyleId: string | undefined) => void;
  disabled?: boolean;
}

const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({
  userId,
  selectedWritingStyleId,
  onWritingStyleChange,
  disabled = false,
}) => {
  const [writingStyles, setWritingStyles] = useState<WritingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchWritingStyles = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await writingStylesAPI.getWritingStylesForSelection();

        if (result.success && result.writingStyles) {
          setWritingStyles(result.writingStyles);
        } else {
          setError(result.error || "Failed to fetch writing styles");
        }
      } catch (err) {
        console.error("Error fetching writing styles:", err);
        setError("Failed to load writing styles");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchWritingStyles();
    }
  }, [userId]);

  const handleWritingStyleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    onWritingStyleChange(value === "" ? undefined : value);
  };

  const getToneDescription = (toneAnalysis: ToneAnalysis): string => {
    if (!toneAnalysis || typeof toneAnalysis !== "object") {
      return "Standard";
    }

    const formality = toneAnalysis.formality || "standard";
    const emotion = toneAnalysis.emotion || "neutral";

    return `${formality.charAt(0).toUpperCase() + formality.slice(1)} - ${
      emotion.charAt(0).toUpperCase() + emotion.slice(1)
    }`;
  };

  const getVocabularyLevelText = (level: number | null): string => {
    if (level === null) return "Standard";
    if (level <= 3) return "Basic";
    if (level <= 6) return "Intermediate";
    if (level <= 8) return "Advanced";
    return "Expert";
  };

  return (
    <div className="p-4 border-b-2 border-border-default">
      <p className="text-sm font-medium">Writing Style</p>
      <p className="text-xs text-text-secondary mt-1">
        Choose a writing style to personalize your document generation.
      </p>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-xs text-text-secondary">
            Loading writing styles...
          </span>
        </div>
      ) : error ? (
        <div className="mt-3">
          <p className="text-xs text-red-600">{error}</p>
          <p className="text-xs text-text-secondary mt-1">
            Documents will be generated with default settings.
          </p>
        </div>
      ) : writingStyles.length === 0 ? (
        <div className="mt-3">
          <p className="text-xs text-text-secondary">
            No writing styles found. Create a writing style to personalize your
            documents.
          </p>
          <Link
            href="/writing-styles/create"
            className="text-xs text-primary hover:text-primary-hover mt-1 inline-block"
          >
            Create Writing Style →
          </Link>
        </div>
      ) : (
        <div className="mt-3">
          <select
            value={selectedWritingStyleId || ""}
            onChange={handleWritingStyleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border-2 rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 bg-background-input text-sm transition-colors border-border-default focus:ring-text-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Use default writing style</option>
            {writingStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.styleName} -{" "}
                {getVocabularyLevelText(style.vocabularyLevel)} (
                {getToneDescription(style.toneAnalysis)})
              </option>
            ))}
          </select>

          {selectedWritingStyleId && (
            <div className="mt-2 p-2 bg-background-hover rounded-lg">
              <p className="text-xs text-text-secondary">
                Selected style will be used to personalize your document&apos;s
                vocabulary, tone, and writing patterns.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingStyleSelector;
