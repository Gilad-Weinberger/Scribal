"use client";

import { DocumentEdit, LayoutDocument } from "@/components/documents/id";
import { documentsAPI } from "@/lib/api-functions";
import React, { useEffect, useState } from "react";
import { GeneratedDocument } from "@/lib/db-schemas";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Page = () => {
  const params = useParams();
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid document ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await documentsAPI.getDocument(params.id);

        if (result.success && result.document) {
          setDocument(result.document);
        } else {
          setError(result.error || "Failed to load document");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  // Create a dummy document for loading/error states
  const dummyDocument: GeneratedDocument = {
    id: "",
    userId: "",
    writingStyleId: null,
    title: "Loading...",
    prompt: "",
    requirements: null,
    generatedContent: "",
    wordCount: 0,
    authenticityScore: 0,
    generationTimeMs: null,
    status: "generating",
    isFavorite: false,
    isEdited: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LayoutDocument document={dummyDocument}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </LayoutDocument>
      </ProtectedRoute>
    );
  }

  if (error || !document) {
    return (
      <ProtectedRoute>
        <LayoutDocument document={dummyDocument}>
          <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || "Document not found"}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              The document you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Link
              href="/documents"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Back to Documents
            </Link>
          </div>
        </LayoutDocument>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LayoutDocument document={document}>
        <DocumentEdit document={document} />
      </LayoutDocument>
    </ProtectedRoute>
  );
};

export default Page;
