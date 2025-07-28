"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api-functions";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;

    try {
      const result = await authAPI.signUp(email, password, displayName);
      if (result.success) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = `/auth/signup?error=${encodeURIComponent(
          result.error || "Sign up failed"
        )}`;
      }
    } catch (error) {
      window.location.href = `/auth/signup?error=${encodeURIComponent(
        "An unexpected error occurred"
      )}`;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-900">
        Create an Account
      </h1>
      <form action={handleSubmit} className="space-y-6">
        <AuthInput
          label="Display Name"
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
        />
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
          autoComplete="new-password"
          required
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </p>
        )}
        <div>
          <AuthButton>Sign Up</AuthButton>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
