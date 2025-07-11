"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUpWithEmail } from "@/lib/functions/authFunctions";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-center text-gray-900">
        Create an Account
      </h1>
      <form action={signUpWithEmail} className="space-y-6">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <AuthButton>Sign Up</AuthButton>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
