"use client";
import { LayoutMain } from "@/components/ui";
import { WritingStylesHeader } from "@/components/writing-styles";
import React from "react";

const Page = () => {
  const handleSearch = (query: string) => {
    // Handle search functionality here
    console.log("Searching for:", query);
  };

  return (
    <LayoutMain>
      <WritingStylesHeader onSearch={handleSearch} />
    </LayoutMain>
  );
};

export default Page;
