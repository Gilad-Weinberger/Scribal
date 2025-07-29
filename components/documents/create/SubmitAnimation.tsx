"use client";

import React, { useState, useEffect } from "react";

interface SubmitAnimationProps {
  className?: string;
}

const phases = [
  { text: "Thinking about your request...", duration: 1000 },
  { text: "Analyzing your writing style...", duration: 1500 },
  { text: "Generating content structure...", duration: 1200 },
  { text: "Writing your document...", duration: 1000 },
  { text: "Applying personal touches...", duration: 800 },
  { text: "Finalizing your document...", duration: 2000 },
];

const SubmitAnimation: React.FC<SubmitAnimationProps> = ({
  className = "",
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startNextPhase = () => {
      const phase = phases[currentPhase];

      timeoutId = setTimeout(() => {
        setCurrentPhase((prev) => {
          if (prev >= phases.length - 1) {
            return 0; // Loop back to beginning
          }
          return prev + 1;
        });
      }, phase.duration);
    };

    startNextPhase();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentPhase]);

  return (
    <button
      className={`bg-primary text-sm text-white w-70 border-2 border-border-default cursor-pointer px-3 py-1 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
      type="button"
      disabled
    >
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
        <div
          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <p className="text-sm text-white min-h-[20px] flex items-center">
        {phases[currentPhase].text}
      </p>
    </button>
  );
};

export default SubmitAnimation;
