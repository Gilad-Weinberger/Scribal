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
      .select("id", { count: "exact" })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking user writing styles:", error);
      return NextResponse.json(
        {
          success: false,
          hasStyles: false,
          count: 0,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const hasStyles = (data?.length || 0) > 0;
    const count = data?.length || 0;

    return NextResponse.json({
      success: true,
      hasStyles,
      count,
      warning: hasStyles
        ? undefined
        : "You don't have any writing styles yet. Documents will be generated with default settings. Consider creating a writing style for personalized content.",
    });
  } catch (error: unknown) {
    console.error("Unexpected error checking writing styles:", error);
    return NextResponse.json(
      {
        success: false,
        hasStyles: false,
        count: 0,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check writing styles",
      },
      { status: 500 }
    );
  }
}
