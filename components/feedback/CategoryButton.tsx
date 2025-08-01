"use client";

import React from "react";

interface CategoryButtonProps {
  category: "feature" | "bug";
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected,
  onClick,
}) => {
  const getCategoryConfig = () => {
    switch (category) {
      case "feature":
        return {
          icon: (
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          ),
          selectedClass: "border-blue-500 bg-blue-50 text-blue-700",
          label: "Idea",
        };
      case "bug":
        return {
          icon: (
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          ),
          selectedClass: "border-red-500 bg-red-50 text-red-700",
          label: "Issue",
        };
    }
  };

  const config = getCategoryConfig();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center cursor-pointer space-x-2 p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? config.selectedClass
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        {config.icon}
      </svg>
      <span className="text-sm font-medium">{config.label}</span>
    </button>
  );
};

export default CategoryButton;
