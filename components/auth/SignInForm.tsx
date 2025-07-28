"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api-client";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await authAPI.signIn(email, password);
      if (result.success) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = `/auth/signin?error=${encodeURIComponent(result.error || "Sign in failed")}`;
      }
    } catch (error) {
      window.location.href = `/auth/signin?error=${encodeURIComponent("An unexpected error occurred")}`;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
      <form action={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <AuthInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </p>
        )}
        <div>
          <AuthButton>Sign In</AuthButton>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
