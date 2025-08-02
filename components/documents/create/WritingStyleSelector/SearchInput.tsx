"use client";

import React from "react";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search writing styles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-10 pr-3 py-2 border-2 rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 bg-background-input text-sm transition-colors border-border-default focus:ring-text-medium disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchInput; 