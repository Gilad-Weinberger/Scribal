import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dbRowToFeedbackComment, FeedbackCommentInsert } from "@/lib/db-schemas";

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

    const feedbackId = params.id;

    // Verify the feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedbacks")
      .select("id")
      .eq("id", feedbackId)
      .single();

    if (feedbackError || !feedback) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Get comments with user information
    const { data: comments, error } = await supabase
      .from("feedback_comments")
      .select(`
        *,
        users:user_id (
          id,
          display_name,
          profile_picture_url
        )
      `)
      .eq("feedback_id", feedbackId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    const formattedComments = comments.map((comment) => ({
      ...dbRowToFeedbackComment(comment),
      user: comment.users || {
        id: comment.user_id,
        display_name: "Deleted User",
        profile_picture_url: null,
      },
    }));

    return NextResponse.json({
      success: true,
      comments: formattedComments,
    });
  } catch (error) {
    console.error("Error in GET /api/feedbacks/[id]/comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const feedbackId = params.id;
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

    // Verify the feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedbacks")
      .select("id")
      .eq("id", feedbackId)
      .single();

    if (feedbackError || !feedback) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    const commentData: FeedbackCommentInsert = {
      feedback_id: feedbackId,
      user_id: user.id,
      content: content.trim(),
      likes: [],
      likes_count: 0,
    };

    const { data: comment, error } = await supabase
      .from("feedback_comments")
      .insert(commentData)
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
      console.error("Error creating comment:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create comment" },
        { status: 500 }
      );
    }

    const formattedComment = {
      ...dbRowToFeedbackComment(comment),
      user: comment.users || {
        id: comment.user_id,
        display_name: "Deleted User",
        profile_picture_url: null,
      },
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment,
    });
  } catch (error) {
    console.error("Error in POST /api/feedbacks/[id]/comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 