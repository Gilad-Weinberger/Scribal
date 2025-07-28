"use client";

import {
  createGeneratedDocument,
  userHasWritingStyles,
} from "./documentFunctions";

export interface CreateDocumentData {
  title: string;
  prompt: string;
  requirements?: string;
  writingStyleId?: string;
}

export interface CreateDocumentResult {
  success: boolean;
  documentId?: string;
  error?: string;
  warning?: string;
}

/**
 * Checks if user has writing styles and provides feedback
 */
export const checkUserWritingStyles = async (
  userId: string
): Promise<{ hasStyles: boolean; warning?: string }> => {
  try {
    const result = await userHasWritingStyles(userId);

    if (!result.hasStyles) {
      return {
        hasStyles: false,
        warning:
          "You don't have any writing styles yet. Documents will be generated with default settings. Consider creating a writing style for personalized content.",
      };
    }

    return { hasStyles: true };
  } catch (error) {
    console.error("Error checking writing styles:", error);
    return { hasStyles: false };
  }
};

/**
 * Processes document creation with AI generation
 */
export const processDocumentCreation = async (
  userId: string,
  data: CreateDocumentData
): Promise<CreateDocumentResult> => {
  try {
    // Enhanced validation
    if (!userId) {
      return {
        success: false,
        error: "User authentication required",
      };
    }

    if (!data.title.trim()) {
      return {
        success: false,
        error: "Please provide a title for your document",
      };
    }

    if (data.title.trim().length < 3) {
      return {
        success: false,
        error: "Document title must be at least 3 characters long",
      };
    }

    if (!data.prompt.trim()) {
      return {
        success: false,
        error: "Please provide a prompt for your document",
      };
    }

    if (data.prompt.trim().length < 10) {
      return {
        success: false,
        error: "Please provide a more detailed prompt (at least 10 characters)",
      };
    }

    // Validate requirements if provided
    if (data.requirements && data.requirements.trim().length > 1000) {
      return {
        success: false,
        error: "Requirements must be less than 1000 characters",
      };
    }

    // Create the generated document
    const documentResult = await createGeneratedDocument(
      userId,
      data.title.trim(),
      data.prompt.trim(),
      data.requirements?.trim() || null,
      data.writingStyleId || null
    );

    if (!documentResult.success || !documentResult.generatedDocument) {
      return {
        success: false,
        error: documentResult.error || "Failed to create document",
      };
    }

    return {
      success: true,
      documentId: documentResult.generatedDocument.id,
    };
  } catch (error: unknown) {
    console.error("Error in processDocumentCreation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process document creation",
    };
  }
};
