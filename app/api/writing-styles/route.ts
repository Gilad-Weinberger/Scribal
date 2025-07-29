import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { WritingStyle, WritingStyleInsert } from "@/lib/db-schemas";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  analyzeTextMetrics,
  calculateStyleCharacteristics,
  LinguisticMetrics,
  StyleCharacteristics,
} from "@/lib/functions/writing-style-analyzer";
import { calculateAuthenticityScore } from "@/lib/functions/authenticity-calculator";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// GET /api/writing-styles - Get all user writing styles
export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("writing_styles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to get writing styles",
        },
        { status: 500 }
      );
    }

    const writingStyles: WritingStyle[] = data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      styleName: row.style_name,
      vocabularyLevel: row.vocabulary_level,
      avgSentenceLength: row.avg_sentence_length,
      complexityScore: row.complexity_score,
      toneAnalysis: row.tone_analysis,
      writingPatterns: row.writing_patterns,
      samplePhrases: row.sample_phrases,
      authenticityBaseline: row.authenticity_baseline,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      success: true,
      writingStyles,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get writing styles",
      },
      { status: 500 }
    );
  }
}

// POST /api/writing-styles - Create new writing style
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, sampleDocuments } = await request.json();

    if (!name || !sampleDocuments || sampleDocuments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and sample documents are required",
        },
        { status: 400 }
      );
    }

    // Combine all sample document content for analysis
    const combinedContent = sampleDocuments
      .map((doc: { content: string }) => doc.content)
      .join("\n\n");

    // Use the new specific linguistic analysis
    const linguisticMetrics = analyzeTextMetrics(combinedContent);
    const styleCharacteristics =
      calculateStyleCharacteristics(linguisticMetrics);

    // Calculate authenticity using the PBA Scale
    const authenticityMetrics = calculateAuthenticityScore({
      vocabularyDiversity: linguisticMetrics.typeTokenRatio,
      sentenceComplexity: linguisticMetrics.sentenceComplexity,
      readabilityScore: linguisticMetrics.fleschKincaidGrade,
      formalityLevel: styleCharacteristics.formalityLevel,
      emotionalTone: styleCharacteristics.emotionalTone,
      engagementLevel: styleCharacteristics.engagementLevel,
      personalPronouns: linguisticMetrics.personalPronouns,
      hedgingLanguage: linguisticMetrics.hedgingLanguage,
      confidenceMarkers: linguisticMetrics.confidenceMarkers,
    });

    const now = new Date().toISOString();

    // Validate all numeric values to prevent overflow
    const validatedAnalysis = {
      vocabularyLevel: Math.max(
        1,
        Math.min(
          10,
          Math.round(styleCharacteristics.lexicalSophistication / 10)
        )
      ),
      avgSentenceLength: Math.max(
        0,
        Math.min(999.99, linguisticMetrics.averageSentenceLength)
      ),
      complexityScore: Math.max(
        0,
        Math.min(9.99, styleCharacteristics.syntacticComplexity / 10)
      ),
      authenticityBaseline: Math.max(
        0,
        Math.min(100, Math.round(authenticityMetrics.overallAuthenticity))
      ),
    };

    // Enhanced tone analysis with specific metrics
    const enhancedToneAnalysis = {
      formality: getFormalityDescription(styleCharacteristics.formalityLevel),
      emotion: getEmotionalToneDescription(styleCharacteristics.emotionalTone),
      confidence: getConfidenceDescription(
        styleCharacteristics.engagementLevel
      ),
      engagement: getEngagementDescription(
        styleCharacteristics.engagementLevel
      ),
      academicTone: getAcademicToneDescription(
        styleCharacteristics.academicTone
      ),
      personalVoice: getPersonalVoiceDescription(
        styleCharacteristics.personalVoice
      ),
    };

    // Enhanced writing patterns with specific linguistic features
    const enhancedWritingPatterns = {
      sentenceStructure: getSentenceStructureDescription(
        linguisticMetrics.sentenceComplexity
      ),
      paragraphLength: getParagraphLengthDescription(
        linguisticMetrics.paragraphLength
      ),
      transitionWords: getTransitionWordsDescription(
        linguisticMetrics.transitionWords
      ),
      passiveVoice: getPassiveVoiceDescription(linguisticMetrics.passiveVoice),
      vocabularyDiversity: getVocabularyDiversityDescription(
        linguisticMetrics.typeTokenRatio
      ),
      readabilityLevel: getReadabilityDescription(
        linguisticMetrics.fleschKincaidGrade
      ),
      uniqueCharacteristics: generateUniqueCharacteristics(
        linguisticMetrics,
        styleCharacteristics
      ),
    };

    // Generate sample phrases using AI
    const samplePhrases = await generateSamplePhrases(
      combinedContent,
      enhancedToneAnalysis
    );

    const newWritingStyle: WritingStyleInsert = {
      user_id: user.id,
      style_name: name.trim(),
      vocabulary_level: validatedAnalysis.vocabularyLevel,
      avg_sentence_length: validatedAnalysis.avgSentenceLength,
      complexity_score: validatedAnalysis.complexityScore,
      tone_analysis: enhancedToneAnalysis,
      writing_patterns: enhancedWritingPatterns,
      sample_phrases: samplePhrases,
      authenticity_baseline: validatedAnalysis.authenticityBaseline,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("writing_styles")
      .insert([newWritingStyle])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to create writing style",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "No data returned from writing style creation",
        },
        { status: 500 }
      );
    }

    // Convert database row to WritingStyle interface
    const writingStyle: WritingStyle = {
      id: data.id,
      userId: data.user_id,
      styleName: data.style_name,
      vocabularyLevel: data.vocabulary_level,
      avgSentenceLength: data.avg_sentence_length,
      complexityScore: data.complexity_score,
      toneAnalysis: data.tone_analysis,
      writingPatterns: data.writing_patterns,
      samplePhrases: data.sample_phrases,
      authenticityBaseline: data.authenticity_baseline,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({
      success: true,
      writingStyle,
      analysisDetails: {
        linguisticMetrics,
        styleCharacteristics,
        authenticityMetrics,
      },
    });
  } catch (error: unknown) {
    console.error("Error creating writing style:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create writing style",
      },
      { status: 500 }
    );
  }
}

// Helper functions for generating descriptions based on specific metrics

const getFormalityDescription = (level: number): string => {
  if (level >= 80) return "Highly Formal";
  if (level >= 60) return "Formal";
  if (level >= 40) return "Semi-Formal";
  if (level >= 20) return "Informal";
  return "Very Informal";
};

const getEmotionalToneDescription = (tone: number): string => {
  if (tone >= 60) return "Very Positive";
  if (tone >= 20) return "Positive";
  if (tone >= -20) return "Neutral";
  if (tone >= -60) return "Negative";
  return "Very Negative";
};

const getConfidenceDescription = (level: number): string => {
  if (level >= 80) return "Very Confident";
  if (level >= 60) return "Confident";
  if (level >= 40) return "Moderate";
  if (level >= 20) return "Cautious";
  return "Uncertain";
};

const getEngagementDescription = (level: number): string => {
  if (level >= 80) return "Highly Engaging";
  if (level >= 60) return "Engaging";
  if (level >= 40) return "Moderate";
  if (level >= 20) return "Passive";
  return "Very Passive";
};

const getAcademicToneDescription = (level: number): string => {
  if (level >= 80) return "Highly Academic";
  if (level >= 60) return "Academic";
  if (level >= 40) return "Semi-Academic";
  if (level >= 20) return "Conversational";
  return "Very Conversational";
};

const getPersonalVoiceDescription = (level: number): string => {
  if (level >= 80) return "Very Personal";
  if (level >= 60) return "Personal";
  if (level >= 40) return "Moderate";
  if (level >= 20) return "Impersonal";
  return "Very Impersonal";
};

const getSentenceStructureDescription = (complexity: number): string => {
  if (complexity >= 3) return "Complex";
  if (complexity >= 2) return "Compound";
  if (complexity >= 1.5) return "Mixed";
  return "Simple";
};

const getParagraphLengthDescription = (length: number): string => {
  if (length >= 5) return "Long";
  if (length >= 3) return "Medium";
  return "Short";
};

const getTransitionWordsDescription = (percentage: number): string => {
  if (percentage >= 5) return "Frequent";
  if (percentage >= 2) return "Moderate";
  return "Minimal";
};

const getPassiveVoiceDescription = (percentage: number): string => {
  if (percentage >= 10) return "Frequent";
  if (percentage >= 5) return "Moderate";
  return "Minimal";
};

const getVocabularyDiversityDescription = (ratio: number): string => {
  if (ratio >= 0.7) return "Very Diverse";
  if (ratio >= 0.5) return "Diverse";
  if (ratio >= 0.3) return "Moderate";
  return "Limited";
};

const getReadabilityDescription = (grade: number): string => {
  if (grade >= 16) return "Graduate Level";
  if (grade >= 13) return "College Level";
  if (grade >= 10) return "High School";
  if (grade >= 7) return "Middle School";
  return "Elementary";
};

const generateUniqueCharacteristics = (
  metrics: LinguisticMetrics,
  styleCharacteristics: StyleCharacteristics
): string[] => {
  const uniqueTraits: string[] = [];

  if (metrics.personalPronouns > 5)
    uniqueTraits.push("High personal pronoun usage");
  if (metrics.passiveVoice < 5) uniqueTraits.push("Active voice preference");
  if (metrics.transitionWords > 3)
    uniqueTraits.push("Strong use of transitions");
  if (styleCharacteristics.formalityLevel > 70)
    uniqueTraits.push("Formal academic style");
  if (styleCharacteristics.personalVoice > 70)
    uniqueTraits.push("Personal and authentic voice");
  if (metrics.typeTokenRatio > 0.6)
    uniqueTraits.push("Rich vocabulary diversity");

  return uniqueTraits.length > 0 ? uniqueTraits : ["Balanced writing style"];
};

const generateSamplePhrases = async (
  content: string,
  toneAnalysis: {
    formality: string;
    emotion: string;
    confidence: string;
    engagement: string;
    academicTone: string;
    personalVoice: string;
  }
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Based on the following writing style analysis, generate 3-5 sample phrases that capture the distinctive voice:
    
    Tone Analysis: ${JSON.stringify(toneAnalysis)}
    
    Original Content Sample: ${content.substring(0, 500)}...
    
    Generate 3-5 representative phrases (10-20 words each) that demonstrate this writing style. 
    Focus on capturing the unique voice characteristics and tone.
    Return only the phrases, one per line, without numbering or additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const phrases = response
      .text()
      .split("\n")
      .filter((phrase) => phrase.trim().length > 0);

    return phrases.slice(0, 5); // Return up to 5 phrases
  } catch (error) {
    console.error("Error generating sample phrases:", error);
    return ["Sample phrase generation unavailable"];
  }
};
