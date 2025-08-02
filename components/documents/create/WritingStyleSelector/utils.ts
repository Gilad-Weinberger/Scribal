import { ToneAnalysis } from "./types";

export const getToneDescription = (toneAnalysis: ToneAnalysis): string => {
  if (!toneAnalysis || typeof toneAnalysis !== "object") {
    return "Standard";
  }

  const formality = toneAnalysis.formality || "standard";
  const emotion = toneAnalysis.emotion || "neutral";

  return `${formality.charAt(0).toUpperCase() + formality.slice(1)} - ${
    emotion.charAt(0).toUpperCase() + emotion.slice(1)
  }`;
};

export const getVocabularyLevelText = (level: number | null): string => {
  if (level === null) return "Standard";
  if (level <= 3) return "Basic";
  if (level <= 6) return "Intermediate";
  if (level <= 8) return "Advanced";
  return "Expert";
};

export const getVocabularyLevelColor = (level: number | null): string => {
  if (level === null) return "bg-gray-100 text-gray-700";
  if (level <= 3) return "bg-green-100 text-green-700";
  if (level <= 6) return "bg-blue-100 text-blue-700";
  if (level <= 8) return "bg-purple-100 text-purple-700";
  return "bg-red-100 text-red-700";
}; 