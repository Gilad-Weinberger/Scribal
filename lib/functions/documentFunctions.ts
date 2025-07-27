"use server";

import {
  SampleDocument,
  GeneratedDocument,
} from "../db-schemas";
import { createClient as createServerClient } from "../supabase/server";

export interface BasicResult {
  success: boolean;
  error?: string;
}

export interface SampleDocumentResult extends BasicResult {
  sampleDocument?: SampleDocument;
}

export interface GeneratedDocumentResult extends BasicResult {
  generatedDocument?: GeneratedDocument;
}

/**
 * Retrieves a sample document by ID
 */
export const getSampleDocument = async (
  documentId: string
): Promise<SampleDocumentResult> => {
  const supabase = await createServerClient();
  
  try {
    const { data, error } = await supabase
      .from("sample_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Sample document not found",
        };
      }
      return {
        success: false,
        error: error.message || "Failed to get sample document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Sample document not found",
      };
    }

    const sampleDocument: SampleDocument = {
      id: data.id,
      userId: data.user_id,
      writingStyleId: data.writing_style_id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      fileName: data.file_name,
      fileSize: data.file_size,
      analysisStatus: data.analysis_status as
        | "pending"
        | "analyzing"
        | "completed"
        | "error",
      analysisResults: data.analysis_results,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return {
      success: true,
      sampleDocument,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get sample document",
    };
  }
};

/**
 * Retrieves a generated document by ID
 */
export const getGeneratedDocument = async (
  documentId: string
): Promise<GeneratedDocumentResult> => {
  const supabase = await createServerClient();
  
  try {
    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Generated document not found",
        };
      }
      return {
        success: false,
        error: error.message || "Failed to get generated document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Generated document not found",
      };
    }

    const generatedDocument: GeneratedDocument = {
      id: data.id,
      userId: data.user_id,
      writingStyleId: data.writing_style_id,
      title: data.title,
      prompt: data.prompt,
      requirements: data.requirements,
      generatedContent: data.generated_content,
      wordCount: data.word_count,
      authenticityScore: data.authenticity_score,
      generationTimeMs: data.generation_time_ms,
      status: data.status as "generating" | "completed" | "error",
      isFavorite: data.is_favorite,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return {
      success: true,
      generatedDocument,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get generated document",
    };
  }
}; 