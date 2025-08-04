import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
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

    const { commentId } = await params;

    // Get the current comment
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

    // Check if user already liked the comment
    const currentLikes = (comment.likes as string[]) || [];
    if (currentLikes.includes(user.id)) {
      return NextResponse.json(
        { success: false, error: "Comment already liked" },
        { status: 400 }
      );
    }

    // Add user to likes array
    const updatedLikes = [...currentLikes, user.id];

    // Update the comment
    const { data: updatedComment, error } = await supabase
      .from("feedback_comments")
      .update({
        likes: updatedLikes,
        likes_count: updatedLikes.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          profile_picture_url
        )
      `
      )
      .single();

    if (error) {
      console.error("Error liking comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to like comment" },
        { status: 500 }
      );
    }

    // Format the comment with proper user data
    const formattedComment = {
      ...updatedComment,
      user: updatedComment.users || {
        id: updatedComment.user_id,
        display_name: "Deleted User",
        profile_picture_url: null,
      },
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment,
    });
  } catch (error) {
    console.error(
      "Error in POST /api/feedbacks/[id]/comments/[commentId]/like:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
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

    const { commentId } = await params;

    // Get the current comment
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

    // Check if user liked the comment
    const currentLikes = (comment.likes as string[]) || [];
    if (!currentLikes.includes(user.id)) {
      return NextResponse.json(
        { success: false, error: "Comment not liked" },
        { status: 400 }
      );
    }

    // Remove user from likes array
    const updatedLikes = currentLikes.filter((id) => id !== user.id);

    // Update the comment
    const { data: updatedComment, error } = await supabase
      .from("feedback_comments")
      .update({
        likes: updatedLikes,
        likes_count: updatedLikes.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select(
        `
        *,
        users:user_id (
          id,
          display_name,
          profile_picture_url
        )
      `
      )
      .single();

    if (error) {
      console.error("Error unliking comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to unlike comment" },
        { status: 500 }
      );
    }

    // Format the comment with proper user data
    const formattedComment = {
      ...updatedComment,
      user: updatedComment.users || {
        id: updatedComment.user_id,
        display_name: "Deleted User",
        profile_picture_url: null,
      },
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment,
    });
  } catch (error) {
    console.error(
      "Error in DELETE /api/feedbacks/[id]/comments/[commentId]/like:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
