import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      <p className="text-sm text-center text-gray-600">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="mt-2 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
