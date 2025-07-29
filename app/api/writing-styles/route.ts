import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  WritingStyle,
  WritingStyleInsert,
  SampleDocumentInsert,
} from "@/lib/db-schemas";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// GET /api/writing-styles - Get all user writing styles
export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("writing_styles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to get writing styles",
        },
        { status: 500 }
      );
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

    return NextResponse.json({
      success: true,
      writingStyles,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get writing styles",
      },
      { status: 500 }
    );
  }
}

// POST /api/writing-styles - Create new writing style
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const files = formData.getAll("files") as File[];

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a name for your writing style",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload at least one .txt file",
        },
        { status: 400 }
      );
    }

    // Validate file types
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".txt")) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" is not a .txt file. Please upload only .txt files.`,
          },
          { status: 400 }
        );
      }
    }

    // Read and combine all file contents
    let combinedContent = "";
    const fileNames: string[] = [];
    const fileSizes: number[] = [];

    for (const file of files) {
      const content = await file.text();
      combinedContent += content + "\n\n";
      fileNames.push(file.name);
      fileSizes.push(file.size);
    }

    // Trim the combined content
    combinedContent = combinedContent.trim();

    if (combinedContent.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The uploaded files contain no text content",
        },
        { status: 400 }
      );
    }

    // Analyze the writing style using Gemini AI
    const analysis = await analyzeWritingStyle(combinedContent);

    const now = new Date().toISOString();

    // Validate all numeric values to prevent overflow
    const validatedAnalysis = {
      vocabularyLevel: Math.max(1, Math.min(10, analysis.vocabularyLevel)),
      avgSentenceLength: Math.max(
        0,
        Math.min(999.99, analysis.avgSentenceLength)
      ),
      complexityScore: Math.max(0, Math.min(9.99, analysis.complexityScore)),
      authenticityBaseline: Math.max(0, Math.min(100, 85)), // Default baseline - now supports 0-100
    };

    const newWritingStyle: WritingStyleInsert = {
      user_id: user.id,
      style_name: name.trim(),
      vocabulary_level: validatedAnalysis.vocabularyLevel,
      avg_sentence_length: validatedAnalysis.avgSentenceLength,
      complexity_score: validatedAnalysis.complexityScore,
      tone_analysis: analysis.toneAnalysis,
      writing_patterns: analysis.writingPatterns,
      sample_phrases: analysis.samplePhrases,
      authenticity_baseline: validatedAnalysis.authenticityBaseline,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("writing_styles")
      .insert([newWritingStyle])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to create writing style",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "No data returned from writing style creation",
        },
        { status: 500 }
      );
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

    // Create sample document entries for each uploaded file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await file.text();

      const wordCount = Math.min(content.split(/\s+/).length, 2147483647);
      const validatedFileSize = Math.min(file.size, 2147483647);

      const newSampleDocument: SampleDocumentInsert = {
        user_id: user.id,
        writing_style_id: writingStyle.id,
        title: file.name.replace(".txt", ""),
        content,
        word_count: wordCount,
        file_name: file.name,
        file_size: validatedFileSize,
        analysis_status: "completed",
        analysis_results: null,
        created_at: now,
        updated_at: now,
      };

      await supabase.from("sample_documents").insert([newSampleDocument]);
    }

    return NextResponse.json({
      success: true,
      writingStyle,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create writing style",
      },
      { status: 500 }
    );
  }
}

/**
 * Analyzes text content using Gemini AI to extract writing style characteristics
 */
const analyzeWritingStyle = async (
  content: string
): Promise<{
  vocabularyLevel: number;
  avgSentenceLength: number;
  complexityScore: number;
  toneAnalysis: {
    formality: string;
    emotion: string;
    confidence: string;
    engagement: string;
  };
  writingPatterns: {
    sentenceStructure: string;
    paragraphLength: string;
    transitionWords: string[];
    repetitivePhrases: string[];
    uniqueCharacteristics: string[];
  };
  samplePhrases: string[];
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following text and provide a comprehensive writing style analysis. Return your response as a JSON object with the following structure:
    
    {
      "vocabularyLevel": number (1-10, where 1 is basic and 10 is advanced),
      "avgSentenceLength": number (average words per sentence, keep under 1000),
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

    // Validate and clamp numeric values to prevent overflow
    const validatedAnalysis = {
      vocabularyLevel: Math.max(1, Math.min(10, analysis.vocabularyLevel || 5)),
      avgSentenceLength: Math.max(
        0,
        Math.min(999.99, analysis.avgSentenceLength || 15)
      ),
      complexityScore: Math.max(
        0,
        Math.min(9.99, analysis.complexityScore || 5)
      ),
      toneAnalysis: analysis.toneAnalysis || {},
      writingPatterns: analysis.writingPatterns || {},
      samplePhrases: analysis.samplePhrases || [],
    };

    return validatedAnalysis;
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
        engagement: "medium",
      },
      writingPatterns: {
        sentenceStructure: "mixed",
        paragraphLength: "medium",
        transitionWords: [],
        repetitivePhrases: [],
        uniqueCharacteristics: [],
      },
      samplePhrases: [],
    };
  }
};
