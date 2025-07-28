import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { GeneratedDocument, WritingStyle, User } from "@/lib/db-schemas";
import { buildGeminiPrompt } from "@/lib/gemini-prompt-builder";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// GET /api/documents - Get all user documents
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
      .from("generated_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to get user generated documents",
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        generatedDocuments: [],
      });
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

    return NextResponse.json({
      success: true,
      documents: generatedDocuments,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get user generated documents",
      },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, prompt, requirements, writingStyleId } =
      await request.json();

    // Validate inputs
    if (!title?.trim() || !prompt?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title and prompt",
        },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Document title must be at least 3 characters long",
        },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide a more detailed prompt (at least 10 characters)",
        },
        { status: 400 }
      );
    }

    // Validate requirements if provided
    if (requirements && requirements.trim().length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Requirements must be less than 1000 characters",
        },
        { status: 400 }
      );
    }

    // Use provided writing style ID or get user's default writing style if available
    let finalWritingStyleId: string | null = writingStyleId || null;

    if (!finalWritingStyleId) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("default_writing_style")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        // Continue without writing style if user data fetch fails
      } else if (userData?.default_writing_style) {
        finalWritingStyleId = userData.default_writing_style;
      }
    }

    // Get user data for personal information replacement
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    let userInfo: User | undefined = undefined;
    if (!userError && userData) {
      userInfo = {
        id: userData.id,
        email: userData.email,
        displayName: userData.display_name,
        role: userData.role,
        university: userData.university,
        major: userData.major,
        profilePictureUrl: userData.profile_picture_url,
        defaultWritingStyle: userData.default_writing_style,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      };
    }

    // Get writing style details if available
    let writingStyle: WritingStyle | null = null;
    if (finalWritingStyleId) {
      const { data: styleData } = await supabase
        .from("writing_styles")
        .select("*")
        .eq("id", finalWritingStyleId)
        .single();

      if (styleData) {
        writingStyle = {
          id: styleData.id,
          userId: styleData.user_id,
          styleName: styleData.style_name,
          vocabularyLevel: styleData.vocabulary_level,
          avgSentenceLength: styleData.avg_sentence_length,
          complexityScore: styleData.complexity_score,
          toneAnalysis: styleData.tone_analysis,
          writingPatterns: styleData.writing_patterns,
          samplePhrases: styleData.sample_phrases,
          authenticityBaseline: styleData.authenticity_baseline,
          createdAt: styleData.created_at,
          updatedAt: styleData.updated_at,
        };
      }
    }

    // Build Gemini prompt
    const geminiPrompt = buildGeminiPrompt({
      userPrompt: prompt.trim(),
      writingStyle: writingStyle || undefined,
      requirements: requirements?.trim(),
      user: userInfo,
    });

    // Generate content using Gemini AI
    let generatedContent = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(geminiPrompt);
      const response = await result.response;
      generatedContent = response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Fallback content if Gemini fails
      generatedContent = `I apologize, but I'm unable to generate personalized content at the moment. Please try again later.

Your request was: ${prompt.trim()}
${requirements ? `Requirements: ${requirements.trim()}` : ""}`;
    }

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
        user_id: user.id,
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
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to create generated document",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create generated document - no data returned",
        },
        { status: 500 }
      );
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

    return NextResponse.json({
      success: true,
      document: generatedDocument,
    });
  } catch (error: unknown) {
    console.error("Unexpected error in createGeneratedDocument:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create generated document",
      },
      { status: 500 }
    );
  }
}
