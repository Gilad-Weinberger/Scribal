"use client";

import React from "react";

interface SkeletonLoadingProps {
  type: "documents" | "writing-styles";
  itemCount?: number;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type,
  itemCount = 6,
}) => {
  const DocumentCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const WritingStyleCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="h-5 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="h-5 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>

      {/* Sample Phrase */}
      <div className="mb-4">
        <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-50 rounded p-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-42">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index}>
          {type === "documents" ? (
            <DocumentCardSkeleton />
          ) : (
            <WritingStyleCardSkeleton />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoading;
