import { WritingStyle, User } from "@/lib/db-schemas";

interface GeminiPromptData {
  userPrompt: string;
  writingStyle?: WritingStyle;
  requirements?: string;
  user?: User;
}

export const buildGeminiPrompt = (data: GeminiPromptData): string => {
  const { userPrompt, writingStyle, requirements, user } = data;

  let prompt = `You are a personalized copywriter. Write the requested content in the user's unique writing style.`;

  // Add writing style details if available
  if (writingStyle) {
    prompt += `\n\nWRITING STYLE ANALYSIS:
- Style Name: ${writingStyle.styleName}
- Vocabulary Level: ${writingStyle.vocabularyLevel || "Standard"}
- Average Sentence Length: ${writingStyle.avgSentenceLength || "Standard"}
- Complexity Score: ${writingStyle.complexityScore || "Standard"}`;

    // Add tone analysis if available
    if (writingStyle.toneAnalysis) {
      const tone = writingStyle.toneAnalysis as Record<string, string>;
      prompt += `\n- Formality: ${tone.formality || "Standard"}
- Emotion: ${tone.emotion || "Neutral"}
- Confidence: ${tone.confidence || "Standard"}
- Engagement: ${tone.engagement || "Standard"}`;
    }

    // Add writing patterns if available
    if (writingStyle.writingPatterns) {
      const patterns = writingStyle.writingPatterns as Record<
        string,
        string | string[]
      >;
      prompt += `\n- Sentence Structure: ${
        patterns.sentenceStructure || "Standard"
      }
- Paragraph Length: ${patterns.paragraphLength || "Standard"}`;

      if (
        patterns.transitionWords &&
        Array.isArray(patterns.transitionWords) &&
        patterns.transitionWords.length > 0
      ) {
        prompt += `\n- Common Transition Words: ${patterns.transitionWords.join(
          ", "
        )}`;
      }

      if (
        patterns.uniqueCharacteristics &&
        Array.isArray(patterns.uniqueCharacteristics) &&
        patterns.uniqueCharacteristics.length > 0
      ) {
        prompt += `\n- Unique Characteristics: ${patterns.uniqueCharacteristics.join(
          ", "
        )}`;
      }
    }

    // Add sample phrases if available
    if (writingStyle.samplePhrases && writingStyle.samplePhrases.length > 0) {
      prompt += `\n- Sample Phrases: ${writingStyle.samplePhrases
        .slice(0, 3)
        .join(" | ")}`;
    }
  }

  // Add user personal data if available
  if (user) {
    prompt += `\n\nPERSONAL DATA REPLACEMENT:
When you encounter placeholder text like [Your Name], [Your Email], [Your University], [Your Major], etc., replace them with the user's actual information:
- [Your Name] → ${user.displayName || "the user"}
- [Your Email] → ${user.email || "the user's email"}
- [Your University] → ${user.university || "the user's university"}
- [Your Major] → ${user.major || "the user's major"}

If the user's actual data is not available, use generic but professional alternatives.`;

    // Add specific user data if available
    if (user.displayName || user.email || user.university || user.major) {
      prompt += `\n\nUSER'S ACTUAL INFORMATION:
- Name: ${user.displayName || "Not provided"}
- Email: ${user.email || "Not provided"}
- University: ${user.university || "Not provided"}
- Major: ${user.major || "Not provided"}`;
    }
  }

  // Add requirements if provided
  if (requirements && requirements.trim()) {
    prompt += `\n\nSPECIFIC REQUIREMENTS:
${requirements.trim()}`;
  }

  // Add the main user prompt
  prompt += `\n\nUSER REQUEST:
${userPrompt.trim()}

INSTRUCTIONS:
- Write the content in the user's unique writing style
- Match their vocabulary level, sentence structure, and tone
- Use their characteristic phrases and writing patterns
- Ensure the content feels authentic to their voice
- Replace any placeholder text like [Your Name], [Your Email], etc. with the user's actual information
- Provide only the generated content without any explanations or meta-text
- Do not include any headers, formatting instructions, or additional commentary
- Write as if you are the user themselves
- Use proper line breaks with \\n for paragraph separation
- Format the text with appropriate spacing and structure
- Include \\n\\n for paragraph breaks and \\n for line breaks within paragraphs
- Ensure the text is properly formatted for readability
- Use \\n\\n between paragraphs and \\n for line breaks within paragraphs
- Do not use markdown formatting - use plain text with \\n characters only`;

  return prompt;
};
