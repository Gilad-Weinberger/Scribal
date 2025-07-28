"use server";

import { SampleDocument, GeneratedDocument } from "../db-schemas";
import { createClient as createServerClient } from "../supabase/server";
import { getWritingStyle } from "./writingStyleFunctions";

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

export interface UserGeneratedDocumentsResult extends BasicResult {
  generatedDocuments?: GeneratedDocument[];
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
        error instanceof Error
          ? error.message
          : "Failed to get sample document",
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
        error instanceof Error
          ? error.message
          : "Failed to get generated document",
    };
  }
};

/**
 * Retrieves all generated documents for a specific user
 */
export const getUserGeneratedDocuments = async (
  userId: string
): Promise<UserGeneratedDocumentsResult> => {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to get user generated documents",
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        generatedDocuments: [],
      };
    }

    const generatedDocuments: GeneratedDocument[] = data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      writingStyleId: row.writing_style_id,
      title: row.title,
      prompt: row.prompt,
      requirements: row.requirements,
      generatedContent: row.generated_content,
      wordCount: row.word_count,
      authenticityScore: row.authenticity_score,
      generationTimeMs: row.generation_time_ms,
      status: row.status as "generating" | "completed" | "error",
      isFavorite: row.is_favorite,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      success: true,
      generatedDocuments,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get user generated documents",
    };
  }
};

/**
 * Checks if a user has any writing styles
 */
export const userHasWritingStyles = async (
  userId: string
): Promise<{ hasStyles: boolean; count: number }> => {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("writing_styles")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    if (error) {
      console.error("Error checking user writing styles:", error);
      return { hasStyles: false, count: 0 };
    }

    return {
      hasStyles: (data?.length || 0) > 0,
      count: data?.length || 0,
    };
  } catch (error: unknown) {
    console.error("Unexpected error checking writing styles:", error);
    return { hasStyles: false, count: 0 };
  }
};

/**
 * Creates a new generated document
 */
export const createGeneratedDocument = async (
  userId: string,
  title: string,
  prompt: string,
  requirements: string | null,
  writingStyleId?: string | null
): Promise<GeneratedDocumentResult> => {
  const supabase = await createServerClient();

  try {
    // Validate inputs
    if (!userId || !title.trim() || !prompt.trim()) {
      return {
        success: false,
        error: "Missing required fields: userId, title, or prompt",
      };
    }

    // Use provided writing style ID or get user's default writing style if available
    let finalWritingStyleId: string | null = writingStyleId || null;

    if (!finalWritingStyleId) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("default_writing_style")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        // Continue without writing style if user data fetch fails
      } else if (userData?.default_writing_style) {
        finalWritingStyleId = userData.default_writing_style;
      }
    }

    // Generate more realistic content based on prompt and requirements
    const generatedContent = await generateDocumentContent(
      prompt,
      requirements,
      finalWritingStyleId
    );
    const wordCount = generatedContent.split(/\s+/).length;

    // Calculate authenticity score based on writing style if available
    let authenticityScore = 85; // Default score
    if (finalWritingStyleId) {
      const { data: styleData } = await supabase
        .from("writing_styles")
        .select("authenticity_baseline")
        .eq("id", finalWritingStyleId)
        .single();

      if (styleData?.authenticity_baseline) {
        authenticityScore = styleData.authenticity_baseline;
      }
    }

    const { data, error } = await supabase
      .from("generated_documents")
      .insert({
        user_id: userId,
        writing_style_id: finalWritingStyleId,
        title: title.trim(),
        prompt: prompt.trim(),
        requirements: requirements?.trim() || null,
        generated_content: generatedContent,
        word_count: wordCount,
        authenticity_score: authenticityScore,
        generation_time_ms: Math.floor(Math.random() * 5000) + 1000, // Simulate generation time
        status: "completed",
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating document:", error);
      return {
        success: false,
        error: error.message || "Failed to create generated document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Failed to create generated document - no data returned",
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
    console.error("Unexpected error in createGeneratedDocument:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create generated document",
    };
  }
};

/**
 * Generates document content based on prompt and requirements
 * This is a placeholder function - in production, this would call an AI service
 */
const generateDocumentContent = async (
  prompt: string,
  requirements: string | null,
  writingStyleId: string | null
): Promise<string> => {
  let styleInfo = "";
  
  if (writingStyleId) {
    try {
      const writingStyleResult = await getWritingStyle(writingStyleId);
      if (writingStyleResult.success && writingStyleResult.writingStyle) {
        const style = writingStyleResult.writingStyle;
        styleInfo = `

## Writing Style Applied:
- **Style Name**: ${style.styleName}
- **Vocabulary Level**: ${style.vocabularyLevel ? `${style.vocabularyLevel}/10` : 'Standard'}
- **Complexity Score**: ${style.complexityScore ? `${style.complexityScore}/10` : 'Standard'}
- **Tone**: ${style.toneAnalysis ? JSON.stringify(style.toneAnalysis) : 'Standard'}

This content has been personalized using your "${style.styleName}" writing style to maintain consistency with your unique voice and writing patterns.`;
      }
    } catch (error) {
      console.error("Error fetching writing style:", error);
    }
  }

  const baseContent = `Based on your prompt: "${prompt}"

${requirements ? `Requirements: ${requirements}` : ""}

Here is your generated document:

# ${prompt.split(" ").slice(0, 5).join(" ")}...

This document has been generated using your personal writing style. The content follows your unique vocabulary patterns, sentence structure, and tone preferences to ensure authenticity and consistency with your writing voice.

## Key Features:
- Personalized content generation
- Style-consistent writing
- Authenticity scoring
- Word count optimization${styleInfo}

The document maintains your writing DNA while addressing the specific requirements and prompt you provided.`;

  return baseContent;
};
