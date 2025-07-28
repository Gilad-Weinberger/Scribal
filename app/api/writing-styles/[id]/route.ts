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

    // Delete associated sample documents first
    const { error: sampleError } = await supabase
      .from("sample_documents")
      .delete()
      .eq("writing_style_id", writingStyleId)
      .eq("user_id", user.id);

    if (sampleError) {
      console.error("Error deleting sample documents:", sampleError);
    }

    // Delete the writing style
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
