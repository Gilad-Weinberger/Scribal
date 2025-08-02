"use client";

import React from "react";
import { WritingStyle } from "./types";
import {
  getVocabularyLevelText,
  getVocabularyLevelColor,
  getToneDescription,
} from "./utils";

interface WritingStyleOptionProps {
  style: WritingStyle;
  isSelected: boolean;
  onSelect: (styleId: string) => void;
}

const WritingStyleOption: React.FC<WritingStyleOptionProps> = ({
  style,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(style.id)}
      className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-background-hover ${
        isSelected
          ? "bg-primary/10 border border-primary/20"
          : "border border-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-row items-center gap-2">
          <p className="text-sm font-medium text-text-primary">
            {style.styleName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getVocabularyLevelColor(
                style.vocabularyLevel
              )}`}
            >
              {getVocabularyLevelText(style.vocabularyLevel)}
            </span>
            <span className="text-xs text-text-secondary">
              {getToneDescription(style.toneAnalysis)}
            </span>
          </div>
        </div>
        {isSelected && (
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default WritingStyleOption;
