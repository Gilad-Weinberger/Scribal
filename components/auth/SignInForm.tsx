"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "@/lib/functions/authFunctions";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
      <form action={signInWithEmail} className="space-y-6">
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <AuthButton>Sign In</AuthButton>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
