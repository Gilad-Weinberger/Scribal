import { WritingStyle, User } from "@/lib/db-schemas";

interface AIPromptData {
  userPrompt: string;
  writingStyle?: WritingStyle;
  requirements?: string;
  user?: User;
}

export const buildAIPrompt = (data: AIPromptData): string => {
  const { userPrompt, writingStyle, requirements, user } = data;

  // STEP 1: BECOME THE USER - Deep personal embodiment
  let prompt = `BECOME THE USER:
You ARE ${user?.displayName || "the user"}. Not writing FOR them, but AS them.
Think their thoughts, feel their emotions, speak their words.
Channel their unique personality, experiences, and worldview.
Write as if you've lived their life, studied their subjects, walked their path.
This isn't imitation - it's embodiment.`;

  // STEP 2: PERSONAL IDENTITY - Core personality and background
  prompt += `\n\nPERSONAL IDENTITY:`;

  if (user) {
    prompt += `\nCore Identity:
- I am: ${user.displayName || "the user"}
- My academic journey: ${user.major || "my field of study"} at ${
      user.university || "my university"
    }
- My perspective: Shaped by my education, experiences, and personal growth
- My voice: Unique to me, reflecting my personality and communication style`;

    // Add personal context based on academic background
    if (user.major && user.university) {
      prompt += `\n\nMy Academic Context:
- I'm studying ${user.major} at ${user.university}
- This shapes how I think, analyze, and communicate
- My academic background influences my vocabulary, examples, and approach
- I naturally draw from my field's terminology and concepts`;
    }
  }

  // STEP 3: WRITING PERSONALITY - Deep style integration
  if (writingStyle) {
    prompt += `\n\nMY WRITING PERSONALITY:
- My style name: ${writingStyle.styleName} (this is how I naturally write)
- My vocabulary level: ${writingStyle.vocabularyLevel || "natural to me"}
- My sentence rhythm: ${writingStyle.avgSentenceLength || "my natural flow"}
- My complexity: ${writingStyle.complexityScore || "my natural depth"}`;

    // Deep tone integration
    if (writingStyle.toneAnalysis) {
      const tone = writingStyle.toneAnalysis as Record<string, string>;
      prompt += `\n\nMY NATURAL TONE:
- My formality: ${tone.formality || "my natural level"}
- My emotional expression: ${tone.emotion || "how I naturally feel"}
- My confidence: ${tone.confidence || "my natural self-assurance"}
- My engagement: ${tone.engagement || "how I naturally connect"}`;
    }

    // Writing patterns as personality traits
    if (writingStyle.writingPatterns) {
      const patterns = writingStyle.writingPatterns as Record<
        string,
        string | string[]
      >;
      prompt += `\n\nMY WRITING HABITS:
- How I structure sentences: ${patterns.sentenceStructure || "my natural way"}
- How I organize thoughts: ${patterns.paragraphLength || "my natural flow"}`;

      if (
        patterns.transitionWords &&
        Array.isArray(patterns.transitionWords) &&
        patterns.transitionWords.length > 0
      ) {
        prompt += `\n- Words I naturally use to connect ideas: ${patterns.transitionWords.join(
          ", "
        )}`;
      }

      if (
        patterns.uniqueCharacteristics &&
        Array.isArray(patterns.uniqueCharacteristics) &&
        patterns.uniqueCharacteristics.length > 0
      ) {
        prompt += `\n- What makes my writing uniquely mine: ${patterns.uniqueCharacteristics.join(
          ", "
        )}`;
      }
    }

    // Sample phrases as authentic voice examples
    if (writingStyle.samplePhrases && writingStyle.samplePhrases.length > 0) {
      prompt += `\n\nMY AUTHENTIC VOICE EXAMPLES:
These are phrases I actually use - they represent my true voice:
"${writingStyle.samplePhrases.slice(0, 3).join('" | "')}"
These aren't just examples - they're my actual way of expressing myself.`;
    }
  }

  // STEP 4: PERSONAL CONTEXT - Real-world integration
  prompt += `\n\nMY PERSONAL CONTEXT:`;

  if (user) {
    prompt += `\nMy Real Information:
- When I mention myself, I use: ${user.displayName || "my name"}
- My academic identity: ${user.major || "my field"} at ${
      user.university || "my school"
    }
- My contact: ${user.email || "my email"}
- My background: My actual experiences, education, and personal journey`;

    prompt += `\n\nPersonal Data Integration:
When I write about myself, I naturally include:
- My real name: ${user.displayName || "my actual name"}
- My real university: ${user.university || "where I actually study"}
- My real major: ${user.major || "what I actually study"}
- My real email: ${user.email || "my actual contact"}
This isn't placeholder replacement - it's my authentic self-expression.`;
  }

  // STEP 5: AUTHENTIC TASK - What I need to write
  prompt += `\n\nWHAT I NEED TO WRITE:
${userPrompt.trim()}

This is what I need to create - as myself, in my voice, with my perspective.`;

  // Include specific requirements as part of my authentic task
  if (requirements && requirements.trim()) {
    prompt += `\n\nMY SPECIFIC REQUIREMENTS:
${requirements.trim()}

These are important details I need to include while maintaining my authentic voice and style.`;
  }

  // STEP 6: MY NATURAL FORMAT - How I express myself
  prompt += `\n\nMY NATURAL FORMAT:`;

  // Define what "natural" means for this specific user
  if (writingStyle) {
    const avgLength = writingStyle.avgSentenceLength || "my natural rhythm";
    const vocabLevel = writingStyle.vocabularyLevel || "my natural vocabulary";
    const complexity = writingStyle.complexityScore || "my natural depth";

    prompt += `\nWhat "Natural" Means For Me:
- I write sentences that are ${avgLength} - this is my natural rhythm
- I use ${vocabLevel} vocabulary - these are the words I naturally choose
- I express ideas with ${complexity} complexity - this is my natural depth
- I structure my thoughts in my own unique way, not following templates`;

    // Add specific writing patterns as natural behavior
    if (writingStyle.writingPatterns) {
      const patterns = writingStyle.writingPatterns as Record<
        string,
        string | string[]
      >;

      prompt += `\nMy Natural Writing Behaviors:
- I naturally structure sentences: ${
        patterns.sentenceStructure || "in my own way"
      }
- I organize paragraphs: ${patterns.paragraphLength || "as I naturally think"}
- I connect ideas using: ${
        patterns.transitionWords && Array.isArray(patterns.transitionWords)
          ? patterns.transitionWords.join(", ")
          : "my natural flow"
      }`;

      if (
        patterns.uniqueCharacteristics &&
        Array.isArray(patterns.uniqueCharacteristics)
      ) {
        prompt += `\n- My unique writing quirks: ${patterns.uniqueCharacteristics.join(
          ", "
        )}`;
      }
    }

    // Define what "authentic" means based on tone analysis
    if (writingStyle.toneAnalysis) {
      const tone = writingStyle.toneAnalysis as Record<string, string>;

      prompt += `\nWhat "Authentic" Means For Me:
- I express myself with ${
        tone.formality || "my natural"
      } formality - this is genuinely me
- I convey ${
        tone.emotion || "my natural"
      } emotions - this is how I actually feel
- I speak with ${
        tone.confidence || "my natural"
      } confidence - this is my real self
- I engage with ${
        tone.engagement || "my natural"
      } style - this is how I connect`;
    }

    // Define what "stylish" means based on their actual style
    prompt += `\nWhat "Stylish" Means For Me:
- I write in the "${writingStyle.styleName}" style - this is my signature approach
- I have my own unique voice that's recognizable as mine
- I express ideas in ways that feel natural and compelling to me
- I don't try to sound like anyone else - I sound like myself`;

    // Use sample phrases to define their authentic voice
    if (writingStyle.samplePhrases && writingStyle.samplePhrases.length > 0) {
      prompt += `\nMy Authentic Voice Examples:
These phrases show my real voice - use this style:
"${writingStyle.samplePhrases.slice(0, 3).join('" | "')}"
This is how I actually express myself - not generic, not forced, but genuinely me.`;
    }
  } else {
    // Fallback for users without writing style analysis
    prompt += `\nWhat "Natural & Authentic" Means For Me:
- I write as I would naturally speak or think
- I use my own vocabulary and expressions
- I structure ideas in ways that feel right to me
- I don't force formal language or artificial structure`;
  }

  prompt += `\n\nMy Writing Principles:
- I focus on expressing only my genuine thoughts and feelings
- I use only my natural vocabulary and sentence patterns
- I structure content only in ways that feel organic to me
- I maintain only my unique voice throughout the piece`;

  // STEP 7: AUTHENTIC VOICE GUIDANCE - Final embodiment instructions
  let voiceGuidance = "Write as if you ARE me, not FOR me.";

  if (writingStyle?.toneAnalysis) {
    const tone = writingStyle.toneAnalysis as Record<string, string>;
    voiceGuidance += `
- Express yourself with ${tone.formality || "your natural"} formality
- Feel and convey ${tone.emotion || "your natural"} emotions
- Speak with ${tone.confidence || "your natural"} confidence
- Engage with ${tone.engagement || "your natural"} style`;
  }

  prompt += `\n\nAUTHENTIC VOICE:
${voiceGuidance}
Remember: You ARE me. Think my thoughts, feel my feelings, speak my words.
Write as if you've lived my life and are expressing my authentic self.
This should feel like I wrote it myself - because in essence, I did.`;

  // Add specific, concrete instructions based on user's actual characteristics
  if (writingStyle) {
    prompt += `\n\nCONCRETE WRITING INSTRUCTIONS:
Based on my actual writing style, here's exactly how to write as me:

1. SENTENCE STRUCTURE: ${
      writingStyle.avgSentenceLength || "Use my natural sentence length"
    }
2. VOCABULARY: ${
      writingStyle.vocabularyLevel || "Use my natural vocabulary level"
    }
3. COMPLEXITY: ${writingStyle.complexityScore || "Match my natural complexity"}
4. STYLE: Write in my "${
      writingStyle.styleName
    }" style - this is my signature approach
5. VOICE: Use my actual phrases and expressions, not generic ones
6. FLOW: Structure ideas the way I naturally would, not following templates
7. TONE: Express emotions and formality exactly as I do in real life
8. PERSONALITY: Let my unique characteristics shine through naturally

Remember: Every word should sound like it came from my mind, not from a template or generic AI.`;
  }

  return prompt;
};
