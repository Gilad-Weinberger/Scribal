"use client";

import { LayoutMain } from "@/components/ui";
import WritingStyleDetail from "@/components/writing-styles/id/WritingStyleDetail";
import { getWritingStyle } from "@/lib/functions/writingStyleFunctions";
import React, { useEffect, useState } from "react";
import { WritingStyle } from "@/lib/db-schemas";
import { useParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const params = useParams();
  const [writingStyle, setWritingStyle] = useState<WritingStyle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWritingStyle = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid writing style ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await getWritingStyle(params.id);

        if (result.success && result.writingStyle) {
          setWritingStyle(result.writingStyle);
        } else {
          setError(result.error || "Failed to load writing style");
        }
      } catch (error) {
        console.error("Error fetching writing style:", error);
        setError("Failed to load writing style");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWritingStyle();
  }, [params.id]);

  if (isLoading) {
    return (
      <LayoutMain>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </LayoutMain>
    );
  }

  if (error || !writingStyle) {
    return (
      <LayoutMain>
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || "Writing style not found"}
          </h3>
          <p className="text-gray-500 text-center mb-6">
            The writing style you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link
            href="/writing-styles"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Back to Writing Styles
          </Link>
        </div>
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <WritingStyleDetail writingStyle={writingStyle} />
    </LayoutMain>
  );
};

export default Page;
