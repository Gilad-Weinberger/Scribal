import { Suspense } from "react";
import { AuthCard, SignInForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <AuthCard>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
