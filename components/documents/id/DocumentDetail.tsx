"use client";

import React from "react";
import Link from "next/link";
import { GeneratedDocument } from "@/lib/db-schemas";

interface DocumentDetailProps {
  document: GeneratedDocument;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ document }) => {
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {document.title}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(document.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/documents"
            className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Documents
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {document.wordCount}
                </div>
                <div className="text-sm text-gray-600">Word Count</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${getAuthenticityColor(
                    document.authenticityScore
                  )}`}
                >
                  {document.authenticityScore}%
                </div>
                <div className="text-sm text-gray-600">Authenticity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {document.generationTimeMs
                    ? `${Math.round(document.generationTimeMs / 1000)}s`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Generation Time</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${getStatusColor(
                    document.status
                  )}`}
                >
                  {document.status}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generated Content
            </h2>
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {document.generatedContent}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Original Prompt
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700">{document.prompt}</p>
            </div>
          </div>

          {/* Requirements */}
          {document.requirements && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-gray-700">{document.requirements}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Document Info
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    document.status
                  )}`}
                >
                  {document.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Authenticity Score:
                </span>
                <span
                  className={`ml-2 text-sm font-medium ${getAuthenticityColor(
                    document.authenticityScore
                  )}`}
                >
                  {document.authenticityScore}%
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Word Count:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {document.wordCount} words
                </span>
              </div>
              {document.generationTimeMs && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Generation Time:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {Math.round(document.generationTimeMs / 1000)} seconds
                  </span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Created:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors font-medium">
                Edit Document
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Download
              </button>
              <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium">
                Delete Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
