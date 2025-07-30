"use client";

import { GeneratedDocument } from "@/lib/db-schemas";
import React, { useState, useEffect } from "react";
import { FastWritingAnimation } from ".";
import { useToast } from "@/components/ui";
import { documentsAPI } from "@/lib/api-functions";
import { useRouter } from "next/navigation";

interface DocumentEditProps {
  document: GeneratedDocument;
}

const DocumentEdit = ({ document }: DocumentEditProps) => {
  const [content, setContent] = useState(document.generatedContent || "");
  const [title, setTitle] = useState(document.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWritingAnimation, setShowWritingAnimation] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Check if document was created within the last 45 seconds
  useEffect(() => {
    const createdAt = new Date(document.createdAt);
    const now = new Date();
    const timeDifference = now.getTime() - createdAt.getTime();
    const isNewDocument = timeDifference <= 45000; // 45 seconds in milliseconds

    setShowWritingAnimation(
      isNewDocument && document.generatedContent.length > 0
    );
  }, [document.createdAt, document.generatedContent]);

  // Update content when document changes
  useEffect(() => {
    setContent(document.generatedContent || "");
    setTitle(document.title || "");
  }, [document]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = async () => {
    if (title.trim() === document.title || !title.trim()) {
      setTitle(document.title || "");
      return;
    }

    setIsSavingTitle(true);

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "save_changes",
          title: title.trim(),
          content: content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Document title updated successfully!", "success");
        // Update the document object to reflect the new title
        document.title = title.trim();
      } else {
        showToast(
          "Failed to update document title. Please try again.",
          "error"
        );
        setTitle(document.title || "");
      }
    } catch (error) {
      console.error("Error updating document title:", error);
      showToast("An error occurred while updating. Please try again.", "error");
      setTitle(document.title || "");
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowWritingAnimation(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "save_changes",
          title: title,
          content: content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Document saved successfully!", "success");
      } else {
        showToast("Failed to save document. Please try again.", "error");
      }
    } catch {
      showToast("An error occurred while saving. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await documentsAPI.deleteDocument(document.id);

      if (result.success) {
        showToast("Document deleted successfully!", "success");
        router.push("/documents");
      } else {
        showToast("Failed to delete document. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      showToast("An error occurred while deleting. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTitle();
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === "Escape") {
                  setTitle(document.title || "");
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Untitled Document"
              className="text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 cursor-pointer"
              disabled={isSavingTitle}
              title="Click to edit document title"
            />
            {isSavingTitle && (
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 animate-spin mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Saving...
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>
              Word count:{" "}
              {
                content.split(/\s+/).filter((word: string) => word.length > 0)
                  .length
              }
            </span>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Text Editor */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full px-8 py-6">
              <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
                {showWritingAnimation ? (
                  <div className="w-full h-full p-6 overflow-auto">
                    <FastWritingAnimation
                      text={content}
                      onComplete={handleAnimationComplete}
                      speed={75} // Fast typing speed
                      className="text-gray-900 font-normal leading-relaxed text-base"
                    />
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing your document..."
                    className="w-full h-full p-6 text-gray-900 bg-white border-none outline-none resize-none font-normal leading-relaxed text-base"
                    style={{
                      fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      lineHeight: "1.6",
                      fontSize: "16px",
                      whiteSpace: "pre-wrap",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-b border-gray-200 px-8 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showWritingAnimation && (
                  <span className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    AI is writing your document...
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSaveChanges}
                  disabled={isSaving || showWritingAnimation}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="bg-red-100 text-red-700 cursor-pointer text-sm px-4 py-2 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteDocument}
                  disabled={isDeleting || showWritingAnimation}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEdit;
