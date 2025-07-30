import React from "react";
import { GeneratedDocument } from "@/lib/db-schemas";
import { formatDate } from "@/lib/functions/date-formatter";
import {
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  LightningBoltIcon,
  DocumentDownloadIcon,
  TrashIcon,
} from "@/components/ui";

interface DocumentSidebarProps {
  document: GeneratedDocument;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({ document }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "generating":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAuthenticityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col  left-14 top-12 w-60 h-[calc(100vh-3rem)] bg-background-secondary">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-base font-bold text-gray-900 truncate">
          {document.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Created {formatDate(document.createdAt)}
        </p>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Key Metrics */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ChartBarIcon className="w-3 h-3 text-gray-600" />
            Key Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Word Count
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {document.wordCount}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Authenticity
                </span>
              </div>
              <span
                className={`text-sm font-bold ${getAuthenticityColor(
                  document.authenticityScore
                )}`}
              >
                {document.authenticityScore}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <ClockIcon className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Generation Time
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {document.generationTimeMs
                  ? `${Math.round(document.generationTimeMs / 1000)}s`
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <LightningBoltIcon className="w-3 h-3 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Status
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  document.status
                )}`}
              >
                {document.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="flex py-4 px-8 gap-8 border-t border-gray-200 flex-shrink-0">
        <div className="relative group w-full">
          <button className="w-full h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs cursor-pointer">
            <DocumentDownloadIcon className="w-4 h-4" />
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 whitespace-nowrap bg-background-secondary text-black border-2 border-border-light px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 text-xs z-10">
            Download
          </span>
        </div>
        <div className="relative group w-full">
          <button className="w-full h-10 flex items-center justify-center bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs hover:text-red-800 cursor-pointer">
            <TrashIcon className="w-4 h-4" />
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 whitespace-nowrap bg-background-secondary text-black border-2 border-border-light px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 text-xs z-10">
            Delete
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentSidebar;
