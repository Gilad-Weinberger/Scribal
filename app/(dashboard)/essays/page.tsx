"use client";
import React from "react";
import { EssaysHeader } from "@/components/essays";
import { LayoutMain } from "@/components/ui";

const Page = () => {
  const handleSearch = (query: string) => {
    // Handle search functionality here
    console.log("Searching for:", query);
  };

  return (
    <LayoutMain>
      <EssaysHeader onSearch={handleSearch} />
    </LayoutMain>
  );
};

export default Page;
