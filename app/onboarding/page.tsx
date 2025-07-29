import React, { Suspense } from "react";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

const OnboardingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Welcome to Scribal
        </h1>
        <p className="text-center text-gray-600">
          Let&apos;s get your profile set up.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardingFlow />
        </Suspense>
      </div>
    </div>
  );
};

export default OnboardingPage;
