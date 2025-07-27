"use client";
import { LayoutMain, SkeletonLoading } from "@/components/ui";
import {
  WritingStylesHeader,
  WritingStylesGrid,
} from "@/components/writing-styles";
import { getUserWritingStyles } from "@/lib/functions/writingStyleFunctions";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { WritingStyle } from "@/lib/db-schemas";

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
        const result = await getUserWritingStyles(user.id);
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
  );
};

export default Page;
