"use client";

import React, { useState } from "react";
import Link from "next/link";

interface WritingStylesHeaderProps {
  onSearch?: (query: string) => void;
}

const WritingStylesHeader: React.FC<WritingStylesHeaderProps> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="px-42 py-18 flex items-center gap-x-1">
      <Link
        className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        href="/writing-styles/create"
      >
        <p>New Writing Style</p>
      </Link>
      <input
        type="text"
        placeholder="Search writing styles..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="ml-4 px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focus text-sm bg-background-input w-64"
      />
      <button
        type="button"
        className="flex items-center gap-x-1 ml-4 px-3 py-2 border border-border-default rounded-md bg-white hover:border-primary cursor-pointer text-sm text-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h14M6 10h8M9 15h2"
          />
        </svg>
      </button>
    </div>
  );
};

export default WritingStylesHeader;
