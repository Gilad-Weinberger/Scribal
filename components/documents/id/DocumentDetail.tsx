"use client";

import React from "react";
import { GeneratedDocument } from "@/lib/db-schemas";

interface DocumentTextProps {
  document: GeneratedDocument;
}

const DocumentText: React.FC<DocumentTextProps> = ({ document }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {document.title}
        </h1>
        <p className="text-gray-600">
          Created on {new Date(document.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Generated Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Generated Content
        </h2>
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {document.generatedContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentText;
