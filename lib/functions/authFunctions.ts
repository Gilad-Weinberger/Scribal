"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Signs in a user with their email and password.
 * @param formData The form data containing the user's email and password.
 * @returns A redirect to the dashboard on success, or back to the sign-in page with an error on failure.
 */
export async function signInWithEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return redirect(
        "/auth/signin?error=" +
          encodeURIComponent("Email and password are required")
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error.message);
      return redirect(
        "/auth/signin?error=" + encodeURIComponent(error.message)
      );
    }

    revalidatePath("/", "layout");
    return redirect("/dashboard");
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    return redirect(
      "/auth/signin?error=" + encodeURIComponent("An unexpected error occurred")
    );
  }
}

/**
 * Signs up a new user with their email and password.
 * @param formData The form data containing the user's email and password.
 * @returns A redirect to the dashboard on success, or back to the sign-up page with an error on failure.
 */
export async function signUpWithEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;

    if (!email || !password || !displayName) {
      return redirect(
        "/auth/signup?error=" + encodeURIComponent("All fields are required")
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error.message);
      return redirect(
        "/auth/signup?error=" + encodeURIComponent(error.message)
      );
    }

    revalidatePath("/", "layout");
    return redirect("/onboarding");
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return redirect(
      "/auth/signup?error=" + encodeURIComponent("An unexpected error occurred")
    );
  }
}

/**
 * Signs out the currently authenticated user.
 * @returns A redirect to the sign-in page.
 */
export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
      return redirect("/auth/signin?error=Could not sign out");
    }

    return redirect("/auth/signin");
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    return redirect("/auth/signin?error=An unexpected error occurred");
  }
}
