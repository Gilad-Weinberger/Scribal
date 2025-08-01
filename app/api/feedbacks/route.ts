import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dbRowToFeedback, FeedbackInsert } from "@/lib/db-schemas";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("upvote_count", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedbacks:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch feedbacks" },
        { status: 500 }
      );
    }

    const formattedFeedbacks = feedbacks.map(dbRowToFeedback);

    return NextResponse.json({
      success: true,
      feedbacks: formattedFeedbacks,
    });
  } catch (error) {
    console.error("Error in GET /api/feedbacks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category = "general" } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Title must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (description.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Description must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    const validCategories = ["feature", "bug"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    const feedbackData: FeedbackInsert = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      status: "open",
      upvotes: [],
      upvote_count: 0,
    };

    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .insert(feedbackData)
      .select()
      .single();

    if (error) {
      console.error("Error creating feedback:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create feedback" },
        { status: 500 }
      );
    }

    const formattedFeedback = dbRowToFeedback(feedback);

    return NextResponse.json({
      success: true,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error in POST /api/feedbacks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
