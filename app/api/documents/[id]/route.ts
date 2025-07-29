import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { GeneratedDocument, SampleDocument } from "@/lib/db-schemas";

// GET /api/documents/[id] - Get specific document
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

    const { id: documentId } = await params;

    // Try to get generated document first
    const { data: generatedData, error: generatedError } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (generatedData) {
      const generatedDocument: GeneratedDocument = {
        id: generatedData.id,
        userId: generatedData.user_id,
        writingStyleId: generatedData.writing_style_id,
        title: generatedData.title,
        prompt: generatedData.prompt,
        requirements: generatedData.requirements,
        generatedContent: generatedData.generated_content,
        wordCount: generatedData.word_count,
        authenticityScore: generatedData.authenticity_score,
        generationTimeMs: generatedData.generation_time_ms,
        status: generatedData.status as "generating" | "completed" | "error",
        isFavorite: generatedData.is_favorite,
        isEdited: generatedData.is_edited,
        createdAt: generatedData.created_at,
        updatedAt: generatedData.updated_at,
      };

      return NextResponse.json({
        success: true,
        document: generatedDocument,
        type: "generated",
      });
    }

    if (generatedError && generatedError.code !== "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          error: generatedError.message || "Failed to get generated document",
        },
        { status: 500 }
      );
    }

    // Try to get sample document
    const { data: sampleData, error: sampleError } = await supabase
      .from("sample_documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (sampleData) {
      const sampleDocument: SampleDocument = {
        id: sampleData.id,
        userId: sampleData.user_id,
        writingStyleId: sampleData.writing_style_id,
        title: sampleData.title,
        content: sampleData.content,
        wordCount: sampleData.word_count,
        fileName: sampleData.file_name,
        fileSize: sampleData.file_size,
        analysisStatus: sampleData.analysis_status as
          | "pending"
          | "analyzing"
          | "completed"
          | "error",
        analysisResults: sampleData.analysis_results,
        createdAt: sampleData.created_at,
        updatedAt: sampleData.updated_at,
      };

      return NextResponse.json({
        success: true,
        document: sampleDocument,
        type: "sample",
      });
    }

    if (sampleError && sampleError.code !== "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          error: sampleError.message || "Failed to get sample document",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Document not found",
      },
      { status: 404 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get document",
      },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document (e.g., toggle favorite, save changes)
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

    const { id: documentId } = await params;
    const body = await request.json();

    // Handle different update types
    if (body.type === "save_changes") {
      // Save document changes (title and content)
      const { title, content } = body;
      const wordCount = content
        .split(/\s+/)
        .filter((word: string) => word.length > 0).length;

      // Get the original document to compare changes
      const { data: originalDocument, error: fetchError } = await supabase
        .from("generated_documents")
        .select("title, generated_content")
        .eq("id", documentId)
        .eq("user_id", user.id)
        .eq("is_edited", false)
        .single();

      if (fetchError) {
        return NextResponse.json(
          {
            success: false,
            error: fetchError.message || "Failed to fetch original document",
          },
          { status: 500 }
        );
      }

      // Check if content or title has actually changed
      let hasChanged = false;
      if (originalDocument) {
        const hasContentChanged =
          originalDocument.generated_content !== content;
        const hasTitleChanged = originalDocument.title !== title;
        hasChanged = hasContentChanged || hasTitleChanged;
      } else {
        hasChanged = true;
      }

      const { error } = await supabase
        .from("generated_documents")
        .update({
          title: title,
          generated_content: content,
          word_count: wordCount,
          is_edited: hasChanged,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .eq("user_id", user.id);

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: error.message || "Failed to save document changes",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Document saved successfully",
      });
    } else {
      // Handle favorite toggle (existing functionality)
      const { isFavorite } = body;

      const { error } = await supabase
        .from("generated_documents")
        .update({ is_favorite: isFavorite })
        .eq("id", documentId)
        .eq("user_id", user.id);

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: error.message || "Failed to update document",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update document",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
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

    const { id: documentId } = await params;

    // Try to delete generated document first
    const { error: generatedError } = await supabase
      .from("generated_documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (!generatedError) {
      return NextResponse.json({
        success: true,
      });
    }

    // Try to delete sample document
    const { error: sampleError } = await supabase
      .from("sample_documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (sampleError) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found or could not be deleted",
        },
        { status: 404 }
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
          error instanceof Error ? error.message : "Failed to delete document",
      },
      { status: 500 }
    );
  }
}
