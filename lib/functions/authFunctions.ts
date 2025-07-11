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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Sign in error:", error.message);
    return redirect("/auth/signin?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  return redirect("/dashboard");
}

/**
 * Signs up a new user with their email and password.
 * @param formData The form data containing the user's email and password.
 * @returns A redirect to the dashboard on success, or back to the sign-up page with an error on failure.
 */
export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

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
    return redirect("/auth/signup?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  return redirect("/onboarding");
}

/**
 * Signs out the currently authenticated user.
 * @returns A redirect to the sign-in page.
 */
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error.message);
    return redirect("/auth/signin?error=Could not sign out");
  }

  return redirect("/auth/signin");
}
