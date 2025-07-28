import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { UserInsert, dbRowToUser, userToDbUpdate } from "@/lib/db-schemas";

// GET /api/users - Get current user
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
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "User document not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message || "Failed to get user document" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "User document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: dbRowToUser(data),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get user document",
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user document
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, phoneNumber } = await request.json();

    if ((email && phoneNumber) || (!email && !phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A user must have either an email or a phone number, but not both.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newUserData: UserInsert = {
      id: user.id,
      email: email || null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUserData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to create user document",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "No data returned from user creation",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: dbRowToUser(data),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create user document",
      },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user document
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    const updateData = userToDbUpdate(updates);

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to update user document",
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
            : "Failed to update user document",
      },
      { status: 500 }
    );
  }
}
