"use client";
import { LayoutMain, SkeletonLoading } from "@/components/ui";
import {
  WritingStylesHeader,
  WritingStylesGrid,
} from "@/components/writing-styles";
import { writingStylesAPI } from "@/lib/functions/api-functions";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { WritingStyle } from "@/lib/db-schemas";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

const Page = () => {
  const { user } = useAuth();
  const [writingStyles, setWritingStyles] = useState<WritingStyle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWritingStyles = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const result = await writingStylesAPI.getAllWritingStyles();
        if (result.success && result.writingStyles) {
          setWritingStyles(result.writingStyles);
        }
      } catch (error) {
        console.error("Error fetching writing styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWritingStyles();
  }, [user?.id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ProtectedRoute>
      <LayoutMain>
        <WritingStylesHeader onSearch={handleSearch} />
        {isLoading ? (
          <SkeletonLoading type="writing-styles" />
        ) : (
          <WritingStylesGrid
            writingStyles={writingStyles}
            searchQuery={searchQuery}
          />
        )}
      </LayoutMain>
    </ProtectedRoute>
  );
};

export default Page;
