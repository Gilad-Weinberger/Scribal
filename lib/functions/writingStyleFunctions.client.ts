"use client";

import { createWritingStyle, createSampleDocument } from "./writingStyleFunctions";

export interface CreateWritingStyleData {
  name: string;
  files: FileList | null;
}

export interface CreateWritingStyleResult {
  success: boolean;
  writingStyleId?: string;
  error?: string;
}

/**
 * Processes uploaded .txt files and creates a writing style
 */
export const processWritingStyleCreation = async (
  userId: string,
  data: CreateWritingStyleData
): Promise<CreateWritingStyleResult> => {
  try {
    if (!data.files || data.files.length === 0) {
      return {
        success: false,
        error: "Please upload at least one .txt file",
      };
    }

    // Validate file types
    for (let i = 0; i < data.files.length; i++) {
      const file = data.files[i];
      if (!file.name.toLowerCase().endsWith('.txt')) {
        return {
          success: false,
          error: `File "${file.name}" is not a .txt file. Please upload only .txt files.`,
        };
      }
    }

    // Read and combine all file contents
    let combinedContent = "";
    const fileNames: string[] = [];
    const fileSizes: number[] = [];

    for (let i = 0; i < data.files.length; i++) {
      const file = data.files[i];
      const content = await readFileAsText(file);
      combinedContent += content + "\n\n";
      fileNames.push(file.name);
      fileSizes.push(file.size);
    }

    // Trim the combined content
    combinedContent = combinedContent.trim();

    if (combinedContent.length === 0) {
      return {
        success: false,
        error: "The uploaded files contain no text content",
      };
    }

    // Create the writing style with AI analysis
    const writingStyleResult = await createWritingStyle(
      userId,
      data.name,
      combinedContent
    );

    if (!writingStyleResult.success || !writingStyleResult.writingStyle) {
      return {
        success: false,
        error: writingStyleResult.error || "Failed to create writing style",
      };
    }

    // Create sample document entries for each uploaded file
    for (let i = 0; i < data.files.length; i++) {
      const file = data.files[i];
      const content = await readFileAsText(file);
      
      await createSampleDocument(
        userId,
        writingStyleResult.writingStyle.id,
        file.name.replace('.txt', ''),
        content,
        file.name,
        file.size
      );
    }

    return {
      success: true,
      writingStyleId: writingStyleResult.writingStyle.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process writing style creation",
    };
  }
};

/**
 * Helper function to read file as text
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}; 