"use client";

import { GeneratedDocument } from "@/lib/db-schemas";
import React, { useState, useEffect } from "react";

interface DocumentEditProps {
  document: GeneratedDocument;
}

const DocumentEdit = ({ document }: DocumentEditProps) => {
  const [content, setContent] = useState(document.generatedContent || "");
  const [title, setTitle] = useState(document.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage("");

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
        setSaveMessage("Document saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Failed to save document. Please try again.");
        setTimeout(() => setSaveMessage(""), 5000);
      }
    } catch {
      setSaveMessage("An error occurred while saving. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
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
              placeholder="Untitled Document"
              className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400"
            />
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
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-b border-gray-200 px-8 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {saveMessage && (
                  <span
                    className={`text-sm ${
                      saveMessage.includes("successfully")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {saveMessage}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
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
