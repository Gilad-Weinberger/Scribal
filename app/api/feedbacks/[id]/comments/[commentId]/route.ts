import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { feedbackCommentToDbUpdate } from "@/lib/db-schemas";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
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

    const { commentId } = params;
    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: "Comment must be at least 1 character long" },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: "Comment must be less than 1000 characters" },
        { status: 400 }
      );
    }

    // Get the comment and verify ownership
    const { data: comment, error: fetchError } = await supabase
      .from("feedback_comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to edit this comment" },
        { status: 403 }
      );
    }

    // Update the comment
    const updateData = feedbackCommentToDbUpdate({
      content: content.trim(),
    });

    const { data: updatedComment, error } = await supabase
      .from("feedback_comments")
      .update(updateData)
      .eq("id", commentId)
      .select(`
        *,
        users:user_id (
          id,
          display_name,
          profile_picture_url
        )
      `)
      .single();

    if (error) {
      console.error("Error updating comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error in PUT /api/feedbacks/[id]/comments/[commentId]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
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

    const { commentId } = params;

    // Get the comment and verify ownership
    const { data: comment, error: fetchError } = await supabase
      .from("feedback_comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete the comment
    const { error } = await supabase
      .from("feedback_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/feedbacks/[id]/comments/[commentId]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 