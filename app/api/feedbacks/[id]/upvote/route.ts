import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dbRowToFeedback } from "@/lib/db-schemas";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current feedback
    const { data: feedback, error: fetchError } = await supabase
      .from("feedbacks")
      .select("upvotes")
      .eq("id", params.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    const currentUpvotes = (feedback.upvotes as string[]) || [];
    
    // Check if user already upvoted
    if (currentUpvotes.includes(user.id)) {
      return NextResponse.json(
        { success: false, error: "Already upvoted" },
        { status: 400 }
      );
    }

    // Add user to upvotes
    const newUpvotes = [...currentUpvotes, user.id];

    const { data: updatedFeedback, error } = await supabase
      .from("feedbacks")
      .update({ upvotes: newUpvotes })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error upvoting feedback:", error);
      return NextResponse.json(
        { success: false, error: "Failed to upvote feedback" },
        { status: 500 }
      );
    }

    const formattedFeedback = dbRowToFeedback(updatedFeedback);

    return NextResponse.json({
      success: true,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error in POST /api/feedbacks/[id]/upvote:", error);
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current feedback
    const { data: feedback, error: fetchError } = await supabase
      .from("feedbacks")
      .select("upvotes")
      .eq("id", params.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    const currentUpvotes = (feedback.upvotes as string[]) || [];
    
    // Check if user has upvoted
    if (!currentUpvotes.includes(user.id)) {
      return NextResponse.json(
        { success: false, error: "Not upvoted" },
        { status: 400 }
      );
    }

    // Remove user from upvotes
    const newUpvotes = currentUpvotes.filter(id => id !== user.id);

    const { data: updatedFeedback, error } = await supabase
      .from("feedbacks")
      .update({ upvotes: newUpvotes })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error removing upvote:", error);
      return NextResponse.json(
        { success: false, error: "Failed to remove upvote" },
        { status: 500 }
      );
    }

    const formattedFeedback = dbRowToFeedback(updatedFeedback);

    return NextResponse.json({
      success: true,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error in DELETE /api/feedbacks/[id]/upvote:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 