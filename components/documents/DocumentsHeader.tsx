"use client";

import React, { useState } from "react";

interface DocumentsHeaderProps {
  onSearch?: (query: string) => void;
  onCreateDocument?: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ onSearch, onCreateDocument }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleCreateDocumentClick = () => {
    if (onCreateDocument) {
      onCreateDocument();
    } else {
      // Fallback to direct navigation if no handler provided
      window.location.href = "/documents/create";
    }
  };

  return (
    <div className="px-42 py-18 pb-8 flex items-center gap-x-1">
      <button
        className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        onClick={handleCreateDocumentClick}
      >
        <p>New Document</p>
      </button>
      <input
        type="text"
        placeholder="Search documents..."
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

export default DocumentsHeader;
