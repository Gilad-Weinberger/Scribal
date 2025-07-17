"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/lib/db-schemas";
import ProgressBar from "./ui/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { updateUserDocument } from "@/lib/functions/userFunctions";

import StepWelcome from "./steps/StepWelcome";
import StepAcademicInfo from "./steps/StepAcademicInfo";
import StepProfilePicture from "./steps/StepProfilePicture";
import StepReview from "./steps/StepReview";

const OnboardingFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, completeOnboarding } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const allSteps = useMemo(
    () => [
      {
        id: "displayName",
        component: StepWelcome,
      },
      {
        id: "academicInfo",
        component: StepAcademicInfo,
      },
      {
        id: "profilePicture",
        component: StepProfilePicture,
      },
    ],
    []
  );

  const steps = useMemo(() => {
    const missing = searchParams.get("missing")?.split(",") || [];
    if (missing.length === 0) {
      return allSteps.concat({ id: "review", component: StepReview });
    }

    const filteredSteps = allSteps.filter((step) => missing.includes(step.id));
    return filteredSteps.length > 0
      ? [...filteredSteps, { id: "review", component: StepReview }]
      : allSteps.concat({ id: "review", component: StepReview });
  }, [searchParams, allSteps]);

  useEffect(() => {
    if (user) {
      setUserData({
        displayName: user.displayName || "",
        university: user.university || "",
        major: user.major || "",
        profilePictureUrl: user.profilePictureUrl || "",
      });
    }
  }, [user]);

  const nextStep = () =>
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex((prev) => Math.max(prev - 1, 0));

  const handleUpdate = (data: Partial<User>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  // Helper to check if all required fields are filled (not empty or whitespace)
  const isComplete = () => {
    const trimmed = {
      displayName: (userData.displayName || "").trim(),
      university: (userData.university || "").trim(),
      major: (userData.major || "").trim(),
      profilePictureUrl: (userData.profilePictureUrl || "").trim(),
    };
    return (
      trimmed.displayName &&
      trimmed.university &&
      trimmed.major &&
      trimmed.profilePictureUrl
    );
  };

  // Sanitize userData before update: trim and convert empty strings to null
  const getSanitizedUserData = () => {
    return {
      displayName: userData.displayName?.trim() || null,
      university: userData.university?.trim() || null,
      major: userData.major?.trim() || null,
      profilePictureUrl: userData.profilePictureUrl?.trim() || null,
    };
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("You must be logged in to update your profile.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const sanitized = getSanitizedUserData();
      const result = await updateUserDocument(user.id, sanitized);
      if (result.success) {
        completeOnboarding();
        router.push("/dashboard");
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStepIndex]?.component;

  return (
    <div>
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
      />
      <div className="mt-8">
        {CurrentStepComponent && (
          <CurrentStepComponent data={userData} onUpdate={handleUpdate} />
        )}
      </div>
      {error && (
        <p className="mt-4 text-sm text-center text-red-600">{error}</p>
      )}
      <div className="flex justify-between mt-8">
        <div>
          {currentStepIndex > 0 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          )}
        </div>
        <div>
          {currentStepIndex < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {currentStepIndex === steps.length - 1 && (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isComplete()}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading && (
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Finishing..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
