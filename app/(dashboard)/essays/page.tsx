"use client";
import React, { useState } from "react";
import ModalNoExistingWritingStyle from "@/components/essays/ModalNoExistingWritingStyle";

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  const handleNewEssay = () => {
    setShowModal(true);
  };

  return (
    <div className="px-42 py-18 flex items-center gap-x-1">
      <button
        type="button"
        onClick={handleNewEssay}
        className="bg-[#3456b2] cursor-pointer text-sm text-white px-4 py-2 rounded-md"
      >
        <p>New Essay</p>
      </button>
      <input
        type="text"
        placeholder="Search essays..."
        className="ml-4 px-3 py-2 border border-[#dfdfdf] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3456b2] text-sm bg-[#f6f6f6] w-64"
      />
      <button
        type="button"
        className="flex items-center gap-x-1 ml-4 px-3 py-2 border border-[#dfdfdf] rounded-md bg-white hover:border-[#3456b2] cursor-pointer text-sm text-[#3456b2] transition-colors"
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
      {showModal && (
        <ModalNoExistingWritingStyle onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Page;
