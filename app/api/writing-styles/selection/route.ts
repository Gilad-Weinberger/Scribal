import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

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
      .select("id, style_name, vocabulary_level, tone_analysis")
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

    // Transform the data to only include necessary fields for selection
    const writingStyles = data.map((style) => ({
      id: style.id,
      styleName: style.style_name,
      vocabularyLevel: style.vocabulary_level,
      toneAnalysis: style.tone_analysis,
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
