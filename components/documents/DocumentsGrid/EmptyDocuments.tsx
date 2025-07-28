"use client";

import React from "react";
import Link from "next/link";

interface EmptyDocumentsProps {
  searchQuery?: string;
}

const EmptyDocuments: React.FC<EmptyDocumentsProps> = ({
  searchQuery = "",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {searchQuery ? "No documents found" : "No documents yet"}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {searchQuery
            ? "Try adjusting your search terms or create a new document that matches your needs."
            : "Create your first document to start generating personalized content that matches your unique voice and requirements."}
        </p>

        {/* Action Button */}
        {!searchQuery && (
          <Link
            href="/documents/create"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Document
          </Link>
        )}

        {/* Search Suggestion */}
        {searchQuery && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Search tip:</strong> Try using broader terms or check your
              spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyDocuments;
