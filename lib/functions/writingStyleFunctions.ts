"use server";

import { WritingStyle, WritingStyleInsert, WritingStyleUpdate, SampleDocument, SampleDocumentInsert } from "../db-schemas";
import { createClient as createServerClient } from "../supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BasicResult {
  success: boolean;
  error?: string;
}

export interface WritingStyleResult extends BasicResult {
  writingStyle?: WritingStyle;
}

export interface SampleDocumentResult extends BasicResult {
  sampleDocument?: SampleDocument;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Analyzes text content using Gemini AI to extract writing style characteristics
 */
const analyzeWritingStyle = async (content: string): Promise<{
  vocabularyLevel: number;
  avgSentenceLength: number;
  complexityScore: number;
  toneAnalysis: any;
  writingPatterns: any;
  samplePhrases: string[];
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following text and provide a comprehensive writing style analysis. Return your response as a JSON object with the following structure:
    
    {
      "vocabularyLevel": number (1-10, where 1 is basic and 10 is advanced),
      "avgSentenceLength": number (average words per sentence),
      "complexityScore": number (1-10, based on sentence structure complexity),
      "toneAnalysis": {
        "formality": "formal" | "semi-formal" | "informal",
        "emotion": "neutral" | "positive" | "negative" | "mixed",
        "confidence": "high" | "medium" | "low",
        "engagement": "high" | "medium" | "low"
      },
      "writingPatterns": {
        "sentenceStructure": "simple" | "compound" | "complex" | "mixed",
        "paragraphLength": "short" | "medium" | "long",
        "transitionWords": string[],
        "repetitivePhrases": string[],
        "uniqueCharacteristics": string[]
      },
      "samplePhrases": string[] (3-5 representative phrases that capture the writing style)
    }
    
    Text to analyze:
    ${content}
    
    Focus on identifying the unique characteristics that make this writing style distinctive. Be specific and detailed in your analysis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      vocabularyLevel: analysis.vocabularyLevel || 5,
      avgSentenceLength: analysis.avgSentenceLength || 15,
      complexityScore: analysis.complexityScore || 5,
      toneAnalysis: analysis.toneAnalysis || {},
      writingPatterns: analysis.writingPatterns || {},
      samplePhrases: analysis.samplePhrases || []
    };
  } catch (error) {
    console.error("Error analyzing writing style:", error);
    // Return default values if analysis fails
    return {
      vocabularyLevel: 5,
      avgSentenceLength: 15,
      complexityScore: 5,
      toneAnalysis: {
        formality: "semi-formal",
        emotion: "neutral",
        confidence: "medium",
        engagement: "medium"
      },
      writingPatterns: {
        sentenceStructure: "mixed",
        paragraphLength: "medium",
        transitionWords: [],
        repetitivePhrases: [],
        uniqueCharacteristics: []
      },
      samplePhrases: []
    };
  }
};

/**
 * Creates a new writing style with AI analysis
 */
export const createWritingStyle = async (
  userId: string,
  styleName: string,
  sampleContent: string
): Promise<WritingStyleResult> => {
  const supabase = await createServerClient();
  
  try {
    // Analyze the writing style using Gemini AI
    const analysis = await analyzeWritingStyle(sampleContent);
    
    const now = new Date().toISOString();
    
    const newWritingStyle: WritingStyleInsert = {
      user_id: userId,
      style_name: styleName,
      vocabulary_level: analysis.vocabularyLevel,
      avg_sentence_length: analysis.avgSentenceLength,
      complexity_score: analysis.complexityScore,
      tone_analysis: analysis.toneAnalysis,
      writing_patterns: analysis.writingPatterns,
      sample_phrases: analysis.samplePhrases,
      authenticity_baseline: 85, // Default baseline
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("writing_styles")
      .insert([newWritingStyle])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create writing style",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "No data returned from writing style creation",
      };
    }

    // Convert database row to WritingStyle interface
    const writingStyle: WritingStyle = {
      id: data.id,
      userId: data.user_id,
      styleName: data.style_name,
      vocabularyLevel: data.vocabulary_level,
      avgSentenceLength: data.avg_sentence_length,
      complexityScore: data.complexity_score,
      toneAnalysis: data.tone_analysis,
      writingPatterns: data.writing_patterns,
      samplePhrases: data.sample_phrases,
      authenticityBaseline: data.authenticity_baseline,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return {
      success: true,
      writingStyle,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create writing style",
    };
  }
};

/**
 * Creates a sample document entry
 */
export const createSampleDocument = async (
  userId: string,
  writingStyleId: string,
  title: string,
  content: string,
  fileName: string,
  fileSize: number
): Promise<SampleDocumentResult> => {
  const supabase = await createServerClient();
  
  try {
    const wordCount = content.split(/\s+/).length;
    const now = new Date().toISOString();
    
    const newSampleDocument: SampleDocumentInsert = {
      user_id: userId,
      writing_style_id: writingStyleId,
      title,
      content,
      word_count: wordCount,
      file_name: fileName,
      file_size: fileSize,
      analysis_status: "completed",
      analysis_results: null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("sample_documents")
      .insert([newSampleDocument])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create sample document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "No data returned from sample document creation",
      };
    }

    // Convert database row to SampleDocument interface
    const sampleDocument: SampleDocument = {
      id: data.id,
      userId: data.user_id,
      writingStyleId: data.writing_style_id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      fileName: data.file_name,
      fileSize: data.file_size,
      analysisStatus: data.analysis_status as "pending" | "analyzing" | "completed" | "error",
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
          : "Failed to create sample document",
    };
  }
};

/**
 * Gets all writing styles for a user
 */
export const getUserWritingStyles = async (userId: string): Promise<{
  success: boolean;
  writingStyles?: WritingStyle[];
  error?: string;
}> => {
  const supabase = await createServerClient();
  
  try {
    const { data, error } = await supabase
      .from("writing_styles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to get writing styles",
      };
    }

    const writingStyles: WritingStyle[] = data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      styleName: row.style_name,
      vocabularyLevel: row.vocabulary_level,
      avgSentenceLength: row.avg_sentence_length,
      complexityScore: row.complexity_score,
      toneAnalysis: row.tone_analysis,
      writingPatterns: row.writing_patterns,
      samplePhrases: row.sample_phrases,
      authenticityBaseline: row.authenticity_baseline,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      success: true,
      writingStyles,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get writing styles",
    };
  }
};

/**
 * Gets a specific writing style by ID
 */
export const getWritingStyle = async (writingStyleId: string): Promise<WritingStyleResult> => {
  const supabase = await createServerClient();
  
  try {
    const { data, error } = await supabase
      .from("writing_styles")
      .select("*")
      .eq("id", writingStyleId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to get writing style",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Writing style not found",
      };
    }

    const writingStyle: WritingStyle = {
      id: data.id,
      userId: data.user_id,
      styleName: data.style_name,
      vocabularyLevel: data.vocabulary_level,
      avgSentenceLength: data.avg_sentence_length,
      complexityScore: data.complexity_score,
      toneAnalysis: data.tone_analysis,
      writingPatterns: data.writing_patterns,
      samplePhrases: data.sample_phrases,
      authenticityBaseline: data.authenticity_baseline,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return {
      success: true,
      writingStyle,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get writing style",
    };
  }
}; 