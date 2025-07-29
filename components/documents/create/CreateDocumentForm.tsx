"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SubmitAnimation from "./SubmitAnimation";
import WritingStyleSelector from "./WritingStyleSelector";

interface CreateDocumentFormProps {
  onSubmit?: (data: {
    title: string;
    prompt: string;
    requirements?: string;
    writingStyleId?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
  warning?: string;
  userId?: string;
}

const CreateDocumentForm: React.FC<CreateDocumentFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  warning,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [requirements, setRequirements] = useState("");
  const [selectedWritingStyleId, setSelectedWritingStyleId] = useState<
    string | undefined
  >();
  const [titleError, setTitleError] = useState("");
  const [promptError, setPromptError] = useState("");
  const [requirementsError, setRequirementsError] = useState("");

  // Clear errors when form is reset
  useEffect(() => {
    if (!isLoading) {
      setTitleError("");
      setPromptError("");
      setRequirementsError("");
    }
  }, [isLoading]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate title
    if (!title.trim()) {
      setTitleError("Document title is required");
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters long");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Validate prompt
    if (!prompt.trim()) {
      setPromptError("Prompt is required");
      isValid = false;
    } else if (prompt.trim().length < 10) {
      setPromptError(
        "Please provide a more detailed prompt (at least 10 characters)"
      );
      isValid = false;
    } else {
      setPromptError("");
    }

    // Validate requirements (optional)
    if (requirements && requirements.trim().length > 1000) {
      setRequirementsError("Requirements must be less than 1000 characters");
      isValid = false;
    } else {
      setRequirementsError("");
    }

    return isValid;
  };

  const handleCreateDocument = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit?.({
      title: title.trim(),
      prompt: prompt.trim(),
      requirements: requirements.trim() || undefined,
      writingStyleId: selectedWritingStyleId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCreateDocument();
    }
  };

  return (
    <div className="flex justify-center w-full py-10">
      <div className="w-160 border-2 border-border-default rounded-lg">
        <div className="p-4 border-b-2 border-border-default">
          <p className="text-lg font-medium">Create a new document</p>
          <p className="mt-1 text-sm text-text-secondary">
            Generate personalized content using your writing style. Provide a
            prompt and any specific requirements.
          </p>
        </div>

        <div className="p-4 flex justify-between border-b-2 border-border-default">
          <p className="text-sm font-medium">Document Title</p>
          <div className="w-[60%]">
            <input
              type="text"
              placeholder="Enter document title"
              className={`w-full px-3 py-2 border-2 rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 bg-background-input text-sm transition-colors ${
                titleError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border-default focus:ring-text-medium"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
            {titleError && (
              <p className="text-xs text-red-600 mt-1">{titleError}</p>
            )}
          </div>
        </div>

        <div className="p-4 border-b-2 border-border-default">
          <p className="text-sm font-medium">Prompt</p>
          <p className="text-xs text-text-secondary mt-1">
            Describe what you want to generate. Be specific about the content,
            tone, and structure.
          </p>
          <textarea
            placeholder="Enter your prompt here..."
            className={`w-full h-32 cursor-pointer mt-3 px-3 py-2 border-2 rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 bg-background-input text-sm resize-none transition-colors ${
              promptError
                ? "border-red-500 focus:ring-red-500"
                : "border-border-default focus:ring-text-medium"
            }`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          {promptError && (
            <p className="text-xs text-red-600 mt-1">{promptError}</p>
          )}
        </div>

        <div className="p-4 border-b-2 border-border-default">
          <p className="text-sm font-medium">Requirements (Optional)</p>
          <p className="text-xs text-text-secondary mt-1">
            Any additional requirements like word count, format, or specific
            guidelines.
          </p>
          <textarea
            placeholder="Enter any additional requirements..."
            className={`w-full h-20 cursor-pointer mt-3 px-3 py-2 border-2 rounded-lg hover:bg-background-hover focus:outline-none focus:ring-1 bg-background-input text-sm resize-none transition-colors ${
              requirementsError
                ? "border-red-500 focus:ring-red-500"
                : "border-border-default focus:ring-text-medium"
            }`}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            disabled={isLoading}
          />
          {requirementsError && (
            <p className="text-xs text-red-600 mt-1">{requirementsError}</p>
          )}
          <p className="text-xs text-text-secondary mt-1">
            {requirements.length}/1000 characters
          </p>
        </div>

        {userId && (
          <WritingStyleSelector
            userId={userId}
            selectedWritingStyleId={selectedWritingStyleId}
            onWritingStyleChange={setSelectedWritingStyleId}
            disabled={isLoading}
          />
        )}

        {error && (
          <div className="p-4 border-b-2 border-border-default">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">Error</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {warning && (
          <div className="p-4 border-b-2 border-border-default">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700 font-medium">Note</p>
              <p className="text-xs text-yellow-600 mt-1">{warning}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-x-2 py-4 px-4">
          <Link
            className="border-2 border-border-default text-sm px-3 py-1 rounded-md cursor-pointer hover:bg-background-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            href="/documents"
            tabIndex={isLoading ? -1 : 0}
          >
            Cancel
          </Link>
          {isLoading ? (
            <SubmitAnimation className="justify-center" />
          ) : (
            <button
              className="bg-primary text-sm text-white border-2 border-border-default cursor-pointer px-3 py-1 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              type="button"
              onClick={handleCreateDocument}
              disabled={isLoading || !title.trim() || !prompt.trim()}
            >
              Create new document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentForm;
