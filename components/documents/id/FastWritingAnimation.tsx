"use client";

import React, { useState, useEffect } from "react";

interface FastWritingAnimationProps {
  text: string;
  onComplete?: () => void;
  className?: string;
  speed?: number; // characters per second
}

const FastWritingAnimation: React.FC<FastWritingAnimationProps> = ({
  text,
  onComplete,
  className = "",
  speed = 50, // Default: 50 characters per second
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= text.length) {
      onComplete?.();
      return;
    }

    const delay = 1000 / speed; // Convert speed to delay in milliseconds
    const timeoutId = setTimeout(() => {
      setDisplayedText(text.substring(0, currentIndex + 1));
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className={className}>
      <div className="whitespace-pre-wrap">
        {displayedText}
        {currentIndex < text.length && (
          <span className="ml-0.5 w-0.5 h-5 bg-primary animate-pulse inline-block"></span>
        )}
      </div>
    </div>
  );
};

export default FastWritingAnimation;
