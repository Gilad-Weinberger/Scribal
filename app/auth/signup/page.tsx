import { Suspense } from "react";
import { AuthCard, SignUpForm } from "@/components/auth";

export default function SignUpPage() {
  return (
    <AuthCard>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
