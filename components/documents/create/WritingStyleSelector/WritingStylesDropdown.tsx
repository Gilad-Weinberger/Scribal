"use client";

import React from "react";
import Link from "next/link";
import { WritingStyle } from "./types";
import WritingStyleOption from "./WritingStyleOption";

interface WritingStylesDropdownProps {
  filteredStyles: WritingStyle[];
  searchQuery: string;
  selectedWritingStyleId?: string;
  onWritingStyleSelect: (styleId: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const WritingStylesDropdown: React.FC<WritingStylesDropdownProps> = ({
  filteredStyles,
  searchQuery,
  selectedWritingStyleId,
  onWritingStyleSelect,
  dropdownRef,
}) => {
  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-background-input border-2 border-border-default rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
    >
      {/* Writing Style Options */}
      <div className="p-2">
        {filteredStyles.length === 0 ? (
          <div className="p-3 text-center">
            <p className="text-sm text-text-secondary">
              No writing styles found matching &quot;{searchQuery}
              &quot;
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStyles.map((style) => (
              <WritingStyleOption
                key={style.id}
                style={style}
                isSelected={selectedWritingStyleId === style.id}
                onSelect={onWritingStyleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create New Style Link */}
      <div className="p-3 border-t border-border-default">
        <Link
          href="/writing-styles/create"
          className="text-xs text-primary hover:text-primary-hover flex items-center gap-1"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create new writing style
        </Link>
      </div>
    </div>
  );
};

export default WritingStylesDropdown;
