"use client";

import React from "react";
import { LayoutNavbar } from "@/components/ui";
import { CreateWritingStyleForm } from "@/components/writing-styles";

const Page = () => {
  const handleSubmit = (data: { name: string; files: FileList | null }) => {
    // Handle form submission here
    console.log("Form submitted:", data);
  };

  return (
    <LayoutNavbar>
      <CreateWritingStyleForm onSubmit={handleSubmit} />
    </LayoutNavbar>
  );
};

export default Page;
