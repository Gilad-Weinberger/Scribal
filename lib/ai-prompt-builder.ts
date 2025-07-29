import { WritingStyle, User } from "@/lib/db-schemas";

interface AIPromptData {
  userPrompt: string;
  writingStyle?: WritingStyle;
  requirements?: string;
  user?: User;
}

export const buildAIPrompt = (data: AIPromptData): string => {
  const { userPrompt, writingStyle, requirements, user } = data;

  // Start with a clear, direct task
  let prompt = `Please help write the following content:

${userPrompt.trim()}`;

  // Add specific requirements if provided
  if (requirements && requirements.trim()) {
    prompt += `\n\nAdditional requirements:
${requirements.trim()}`;
  }

  // Add writing style guidance if available
  if (writingStyle) {
    prompt += `\n\nWriting style preferences:`;

    // Add tone guidance
    if (writingStyle.toneAnalysis) {
      const tone = writingStyle.toneAnalysis as Record<string, string>;
      if (tone.formality) prompt += `\n- Use a ${tone.formality} tone`;
      if (tone.emotion)
        prompt += `\n- Express emotions in a ${tone.emotion} way`;
      if (tone.confidence)
        prompt += `\n- Write with ${tone.confidence} confidence`;
    }

    // Add structural preferences
    if (writingStyle.avgSentenceLength) {
      const lengthGuide =
        writingStyle.avgSentenceLength <= 12
          ? "Keep sentences concise and direct"
          : writingStyle.avgSentenceLength > 20
          ? "Use more detailed, complex sentences"
          : "Use a balanced mix of sentence lengths";
      prompt += `\n- ${lengthGuide}`;
    }

    if (writingStyle.vocabularyLevel) {
      const vocabGuide =
        writingStyle.vocabularyLevel <= 8
          ? "Use clear, simple language appropriate for general audiences"
          : writingStyle.vocabularyLevel > 12
          ? "Feel free to use sophisticated, advanced vocabulary"
          : "Use accessible but varied vocabulary with some complexity";
      prompt += `\n- ${vocabGuide}`;
    }

    // Add writing patterns
    if (writingStyle.writingPatterns) {
      const patterns = writingStyle.writingPatterns as Record<
        string,
        string | string[]
      >;

      if (patterns.sentenceStructure) {
        prompt += `\n- Sentence style: ${patterns.sentenceStructure}`;
      }

      if (patterns.paragraphLength) {
        prompt += `\n- Paragraph approach: ${patterns.paragraphLength}`;
      }
    }
  }

  // Add user context only when relevant and necessary
  if (
    user &&
    (userPrompt.toLowerCase().includes("email") ||
      userPrompt.toLowerCase().includes("letter") ||
      userPrompt.toLowerCase().includes("message"))
  ) {
    prompt += `\n\nRelevant context:`;
    if (user.displayName) prompt += `\n- Writer's name: ${user.displayName}`;
    if (user.university && user.major) {
      prompt += `\n- Background: ${user.major} student at ${user.university}`;
    }
  }

  // Clear, actionable instructions
  prompt += `\n\nPlease write the requested content following these guidelines:
1. Create authentic, natural-sounding text
2. Match the specified tone and style preferences
3. Ensure the content serves its intended purpose effectively
4. Keep the writing clear and appropriate for the context
5. Make it sound genuine and personal when appropriate
6. Use the same writing style as the user's writing style
7. You can use 1 or 2 line breaks between paragraphs (2 lines is 1 empty line between paragraphs), but avoid using more than 2 consecutive line breaks.

Generate the content now:`;

  return prompt;
};
