import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dbRowToFeedback, feedbackToDbUpdate } from "@/lib/db-schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching feedback:", error);
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    const formattedFeedback = dbRowToFeedback(feedback);

    return NextResponse.json({
      success: true,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error in GET /api/feedbacks/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, description, category, status } = body;

    // Check if feedback exists and user owns it
    const { data: existingFeedback, error: fetchError } = await supabase
      .from("feedbacks")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    if (existingFeedback.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this feedback" },
        { status: 403 }
      );
    }

    // Validation
    if (title && title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Title must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (description && description.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Description must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    const validCategories = ["feature", "bug"];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    const validStatuses = ["open", "in_progress", "completed", "closed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData = feedbackToDbUpdate({
      ...(title && { title: title.trim() }),
      ...(description && { description: description.trim() }),
      ...(category && { category }),
      ...(status && { status }),
    });

    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating feedback:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update feedback" },
        { status: 500 }
      );
    }

    const formattedFeedback = dbRowToFeedback(feedback);

    return NextResponse.json({
      success: true,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error in PUT /api/feedbacks/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if feedback exists and user owns it
    const { data: existingFeedback, error: fetchError } = await supabase
      .from("feedbacks")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    if (existingFeedback.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this feedback" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("feedbacks")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting feedback:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/feedbacks/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
