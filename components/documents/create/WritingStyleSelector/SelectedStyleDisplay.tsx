"use client";

import React from "react";
import { WritingStyle } from "./types";
import {
  getVocabularyLevelText,
  getVocabularyLevelColor,
  getToneDescription,
} from "./utils";

interface SelectedStyleDisplayProps {
  selectedStyle: WritingStyle;
  onClearSelection: () => void;
  disabled?: boolean;
}

const SelectedStyleDisplay: React.FC<SelectedStyleDisplayProps> = ({
  selectedStyle,
  onClearSelection,
  disabled = false,
}) => {
  return (
    <div className="mb-3 p-3 bg-background-hover rounded-lg border border-border-default">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-row items-center gap-2">
          <p className="text-sm font-medium text-text-primary">
            {selectedStyle.styleName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getVocabularyLevelColor(
                selectedStyle.vocabularyLevel
              )}`}
            >
              {getVocabularyLevelText(selectedStyle.vocabularyLevel)}
            </span>
            <span className="text-xs text-text-secondary">
              {getToneDescription(selectedStyle.toneAnalysis)}
            </span>
          </div>
        </div>
        <button
          onClick={onClearSelection}
          disabled={disabled}
          className="text-red-600 cursor-pointer p-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          title="Clear selection"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelectedStyleDisplay;
