"use client";

import React, { useState } from "react";
import ModalNoExistingWritingStyle from "./ModalNoExistingWritingStyle";

interface EssaysHeaderProps {
  onSearch?: (query: string) => void;
}

const EssaysHeader: React.FC<EssaysHeaderProps> = ({ onSearch }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewEssay = () => {
    setShowModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <>
      <div className="px-42 py-18 flex items-center gap-x-1">
        <button
          type="button"
          onClick={handleNewEssay}
          className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
        >
          <p>New Essay</p>
        </button>
        <input
          type="text"
          placeholder="Search essays..."
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
      {showModal && (
        <ModalNoExistingWritingStyle onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default EssaysHeader;
