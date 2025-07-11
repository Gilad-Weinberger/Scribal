"use client";

import React from "react";
import { User } from "@/lib/db-schemas";
import Image from "next/image";

interface StepReviewProps {
  data: Partial<User>;
}

const StepReview = ({ data }: StepReviewProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Review your information
      </h2>
      <div className="p-4 border border-gray-200 rounded-md">
        <div className="flex items-center space-x-4">
          {data.profilePictureUrl ? (
            <Image
              src={data.profilePictureUrl}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 text-gray-400 bg-gray-200 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <div>
            <p className="text-lg font-bold">
              {data.displayName || "No name provided"}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p>
            <strong>University:</strong> {data.university || "Not provided"}
          </p>
          <p>
            <strong>Major:</strong> {data.major || "Not provided"}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Looks good? Click &quot;Finish&quot; to complete your profile setup.
      </p>
    </div>
  );
};

export default StepReview;
