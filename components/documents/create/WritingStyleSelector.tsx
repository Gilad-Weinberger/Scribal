"use client";

import React, { useState, useEffect } from "react";
import { writingStylesAPI } from "@/lib/functions/api-functions";
import Link from "next/link";
import {
  WritingStyle,
  WritingStyleSelectorProps,
} from "./WritingStyleSelector/types";
import {
  getVocabularyLevelText,
  getToneDescription,
} from "./WritingStyleSelector/utils";
import SearchInput from "./WritingStyleSelector/SearchInput";
import WritingStylesDropdown from "./WritingStyleSelector/WritingStylesDropdown";
import SelectedStyleDisplay from "./WritingStyleSelector/SelectedStyleDisplay";

const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({
  userId,
  selectedWritingStyleId,
  onWritingStyleChange,
  disabled = false,
}) => {
  const [writingStyles, setWritingStyles] = useState<WritingStyle[]>([]);
  const [filteredStyles, setFilteredStyles] = useState<WritingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWritingStyles = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await writingStylesAPI.getWritingStylesForSelection();

        if (result.success && result.writingStyles) {
          setWritingStyles(result.writingStyles);
          setFilteredStyles(result.writingStyles);
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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setSearchQuery("");
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStyles([]);
      setIsExpanded(false);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = writingStyles.filter((style) => {
        const styleName = style.styleName.toLowerCase();
        const vocabularyLevel = getVocabularyLevelText(
          style.vocabularyLevel
        ).toLowerCase();
        const toneDescription = getToneDescription(
          style.toneAnalysis
        ).toLowerCase();

        return (
          styleName.includes(query) ||
          vocabularyLevel.includes(query) ||
          toneDescription.includes(query)
        );
      });
      setFilteredStyles(filtered);
      setIsExpanded(true);
    }
  }, [searchQuery, writingStyles]);

  const handleWritingStyleSelect = (writingStyleId: string) => {
    if (selectedWritingStyleId === writingStyleId) {
      onWritingStyleChange(undefined);
    } else {
      onWritingStyleChange(writingStyleId);
    }
    setIsExpanded(false);
    setSearchQuery("");
  };

  const handleClearSelection = () => {
    onWritingStyleChange(undefined);
    setIsExpanded(false);
    setSearchQuery("");
  };

  const getSelectedStyle = () => {
    return writingStyles.find((style) => style.id === selectedWritingStyleId);
  };

  const selectedStyle = getSelectedStyle();

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
        <div className="mt-3 relative">
          {/* Selected Style Display */}
          {selectedStyle && (
            <SelectedStyleDisplay
              selectedStyle={selectedStyle}
              onClearSelection={handleClearSelection}
              disabled={disabled}
            />
          )}

          {/* Search Interface */}
          <div className="relative">
            <SearchInput
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              disabled={disabled}
            />

            {/* Dropdown Content */}
            {isExpanded && (
              <WritingStylesDropdown
                filteredStyles={filteredStyles}
                searchQuery={searchQuery}
                selectedWritingStyleId={selectedWritingStyleId}
                onWritingStyleSelect={handleWritingStyleSelect}
                dropdownRef={dropdownRef}
              />
            )}
          </div>

          {/* Help Text */}
          {selectedStyle && (
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
