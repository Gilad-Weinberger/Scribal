"use client";

import React from "react";
import Link from "next/link";
import { GeneratedDocument } from "@/lib/db-schemas";

interface DocumentCardProps {
  document: GeneratedDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "generating":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAuthenticityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Link href={`/documents/${document.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 p-5 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2 truncate">
              {document.title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  document.status
                )}`}
              >
                {document.status}
              </span>
              <span className="text-xs text-gray-500">
                {document.wordCount} words
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`text-sm font-semibold ${getAuthenticityColor(
                document.authenticityScore
              )}`}
            >
              {document.authenticityScore}%
            </span>
            <span className="text-gray-400 text-xs">authenticity</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {document.wordCount}
            </div>
            <div className="text-xs text-gray-500">Word Count</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {document.generationTimeMs
                ? `${Math.round(document.generationTimeMs / 1000)}s`
                : "N/A"}
            </div>
            <div className="text-xs text-gray-500">Generation Time</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="truncate">
            {new Date(document.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View details</span>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;
