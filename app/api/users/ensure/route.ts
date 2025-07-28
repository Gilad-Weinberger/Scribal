import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { UserInsert, dbRowToUser } from "@/lib/db-schemas";

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

    // Check if user document exists
    const { data: existingUser, error: getUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (existingUser) {
      // User exists, return the user data
      return NextResponse.json({
        success: true,
        user: dbRowToUser(existingUser),
      });
    }

    if (getUserError && getUserError.code !== "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          error: getUserError.message || "Failed to check user document",
        },
        { status: 500 }
      );
    }

    // User doesn't exist, create new user document
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
            : "Failed to ensure user document",
      },
      { status: 500 }
    );
  }
}
