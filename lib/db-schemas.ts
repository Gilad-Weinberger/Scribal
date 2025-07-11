/*
 |-----------------------------------------------------------------------------
 | Database Schema Types for Scribal
 |-----------------------------------------------------------------------------
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface User {
  id: string; // UUID
  email: string | null;
  displayName: string | null;
  role: "client" | "admin" | null;
  university: string | null;
  major: string | null;
  profilePictureUrl: string | null;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface WritingStyle {
  id: string; // UUID
  userId: string; // UUID
  styleName: string;
  vocabularyLevel: number | null;
  avgSentenceLength: number | null;
  complexityScore: number | null;
  toneAnalysis: Json | null; // JSONB
  writingPatterns: Json | null; // JSONB
  samplePhrases: string[] | null; // TEXT[]
  authenticityBaseline: number;
  isActive: boolean;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface SampleEssay {
  id: string; // UUID
  userId: string; // UUID
  writingStyleId: string | null; // UUID
  title: string;
  content: string;
  wordCount: number;
  fileName: string | null;
  fileSize: number | null;
  analysisStatus: "pending" | "analyzing" | "completed" | "error";
  analysisResults: Json | null; // JSONB
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface GeneratedEssay {
  id: string; // UUID
  userId: string; // UUID
  writingStyleId: string | null; // UUID
  title: string;
  prompt: string;
  requirements: string | null;
  generatedContent: string;
  wordCount: number;
  authenticityScore: number;
  generationTimeMs: number | null;
  status: "generating" | "completed" | "error";
  isFavorite: boolean;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface EssaySection {
  id: string; // UUID
  generatedEssayId: string; // UUID
  sectionType: "introduction" | "body_paragraph" | "conclusion";
  sectionOrder: number;
  content: string;
  authenticityScore: number;
  userEdited: boolean;
  editCount: number;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

/*
 |-----------------------------------------------------------------------------
 | Supabase Database Types
 |-----------------------------------------------------------------------------
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; // UUID
          email: string | null;
          display_name: string | null;
          role: "client" | "admin" | null;
          university: string | null;
          major: string | null;
          profile_picture_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string; // UUID
          email?: string | null;
          display_name?: string | null;
          role?: "client" | "admin" | null;
          university?: string | null;
          major?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string; // UUID
          email?: string | null;
          display_name?: string | null;
          role?: "client" | "admin" | null;
          university?: string | null;
          major?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      writing_styles: {
        Row: {
          id: string;
          user_id: string;
          style_name: string;
          vocabulary_level: number | null;
          avg_sentence_length: number | null;
          complexity_score: number | null;
          tone_analysis: Json | null;
          writing_patterns: Json | null;
          sample_phrases: string[] | null;
          authenticity_baseline: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          style_name?: string;
          vocabulary_level?: number | null;
          avg_sentence_length?: number | null;
          complexity_score?: number | null;
          tone_analysis?: Json | null;
          writing_patterns?: Json | null;
          sample_phrases?: string[] | null;
          authenticity_baseline?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          style_name?: string;
          vocabulary_level?: number | null;
          avg_sentence_length?: number | null;
          complexity_score?: number | null;
          tone_analysis?: Json | null;
          writing_patterns?: Json | null;
          sample_phrases?: string[] | null;
          authenticity_baseline?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sample_essays: {
        Row: {
          id: string;
          user_id: string;
          writing_style_id: string | null;
          title: string;
          content: string;
          word_count: number;
          file_name: string | null;
          file_size: number | null;
          analysis_status: string;
          analysis_results: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          writing_style_id?: string | null;
          title: string;
          content: string;
          word_count: number;
          file_name?: string | null;
          file_size?: number | null;
          analysis_status?: string;
          analysis_results?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          writing_style_id?: string | null;
          title?: string;
          content?: string;
          word_count?: number;
          file_name?: string | null;
          file_size?: number | null;
          analysis_status?: string;
          analysis_results?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      generated_essays: {
        Row: {
          id: string;
          user_id: string;
          writing_style_id: string | null;
          title: string;
          prompt: string;
          requirements: string | null;
          generated_content: string;
          word_count: number;
          authenticity_score: number;
          generation_time_ms: number | null;
          status: string;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          writing_style_id?: string | null;
          title: string;
          prompt: string;
          requirements?: string | null;
          generated_content: string;
          word_count: number;
          authenticity_score?: number;
          generation_time_ms?: number | null;
          status?: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          writing_style_id?: string | null;
          title?: string;
          prompt?: string;
          requirements?: string | null;
          generated_content?: string;
          word_count?: number;
          authenticity_score?: number;
          generation_time_ms?: number | null;
          status?: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      essay_sections: {
        Row: {
          id: string;
          generated_essay_id: string;
          section_type: string;
          section_order: number;
          content: string;
          authenticity_score: number;
          user_edited: boolean;
          edit_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          generated_essay_id: string;
          section_type: string;
          section_order: number;
          content: string;
          authenticity_score?: number;
          user_edited?: boolean;
          edit_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          generated_essay_id?: string;
          section_type?: string;
          section_order?: number;
          content?: string;
          authenticity_score?: number;
          user_edited?: boolean;
          edit_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "client" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

/*
 |-----------------------------------------------------------------------------
 | Helper Types
 |-----------------------------------------------------------------------------
 */

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Table-specific types
export type UserRow = Tables<"users">;
export type UserInsert = Inserts<"users">;
export type UserUpdate = Updates<"users">;

export type WritingStyleRow = Tables<"writing_styles">;
export type WritingStyleInsert = Inserts<"writing_styles">;
export type WritingStyleUpdate = Updates<"writing_styles">;

export type SampleEssayRow = Tables<"sample_essays">;
export type SampleEssayInsert = Inserts<"sample_essays">;
export type SampleEssayUpdate = Updates<"sample_essays">;

export type GeneratedEssayRow = Tables<"generated_essays">;
export type GeneratedEssayInsert = Inserts<"generated_essays">;
export type GeneratedEssayUpdate = Updates<"generated_essays">;

export type EssaySectionRow = Tables<"essay_sections">;
export type EssaySectionInsert = Inserts<"essay_sections">;
export type EssaySectionUpdate = Updates<"essay_sections">;

/*
 |-----------------------------------------------------------------------------
 | Utility Functions
 |-----------------------------------------------------------------------------
 */

/** Convert database row to User interface */
export const dbRowToUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
  role: row.role,
  university: row.university,
  major: row.major,
  profilePictureUrl: row.profile_picture_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/** Convert a partial `User` object to a Supabase `Update` object. */
export const userToDbUpdate = (user: Partial<User>): UserUpdate => {
  const record: Partial<UserUpdate> = {
    updated_at: new Date().toISOString(),
  };

  if (user.email !== undefined) record.email = user.email;
  if (user.displayName !== undefined) record.display_name = user.displayName;
  if (user.role !== undefined) record.role = user.role;
  if (user.university !== undefined) record.university = user.university;
  if (user.major !== undefined) record.major = user.major;
  if (user.profilePictureUrl !== undefined)
    record.profile_picture_url = user.profilePictureUrl;

  return record as UserUpdate;
};
