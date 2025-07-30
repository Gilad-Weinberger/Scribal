import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { WritingStyle } from "@/lib/db-schemas";

// GET /api/writing-styles/[id] - Get specific writing style
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: writingStyleId } = await params;

    const { data, error } = await supabase
      .from("writing_styles")
      .select("*")
      .eq("id", writingStyleId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to get writing style",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Writing style not found",
        },
        { status: 404 }
      );
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
            : "Failed to get writing style",
      },
      { status: 500 }
    );
  }
}

// PUT /api/writing-styles/[id] - Update writing style
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: writingStyleId } = await params;
    const body = await request.json();
    const { styleName } = body;

    if (!styleName || !styleName.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Style name is required",
        },
        { status: 400 }
      );
    }

    // Update the writing style
    const { data, error } = await supabase
      .from("writing_styles")
      .update({
        style_name: styleName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", writingStyleId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to update writing style",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Writing style not found",
        },
        { status: 404 }
      );
    }

    const updatedWritingStyle: WritingStyle = {
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

    return NextResponse.json({
      success: true,
      writingStyle: updatedWritingStyle,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update writing style",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/writing-styles/[id] - Delete writing style
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: writingStyleId } = await params;

    // Delete the writing style
    // The database trigger will automatically:
    // 1. Set writing_style_id to NULL for all sample_documents that reference this writing style
    // 2. Set writing_style_id to NULL for all generated_documents that reference this writing style
    // 3. Set default_writing_style to NULL for users who have this as their default
    const { error } = await supabase
      .from("writing_styles")
      .delete()
      .eq("id", writingStyleId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to delete writing style",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Writing style deleted successfully. All associated documents now have no writing style assigned.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete writing style",
      },
      { status: 500 }
    );
  }
}
