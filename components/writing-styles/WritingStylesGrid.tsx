"use client";

import React from "react";
import { WritingStyle } from "@/lib/db-schemas";
import {
  WritingStyleCard,
  EmptyWritingStyles,
} from "./WritingStylesGrid/index";

interface WritingStylesGridProps {
  writingStyles: WritingStyle[];
  searchQuery?: string;
}

const WritingStylesGrid: React.FC<WritingStylesGridProps> = ({
  writingStyles,
  searchQuery = "",
}) => {
  const filteredStyles = writingStyles.filter((style) =>
    style.styleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredStyles.length === 0) {
    return <EmptyWritingStyles searchQuery={searchQuery} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-42">
      {filteredStyles.map((style) => (
        <WritingStyleCard key={style.id} style={style} />
      ))}
    </div>
  );
};

export default WritingStylesGrid;
