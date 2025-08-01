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
  defaultWritingStyle: string | null;
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
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface SampleDocument {
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

export interface GeneratedDocument {
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
  isEdited: boolean;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

export interface Feedback {
  id: string; // UUID
  userId: string; // UUID
  title: string;
  description: string;
  category: "feature" | "bug";
  status: "open" | "in_progress" | "completed" | "closed";
  upvotes: string[]; // Array of user IDs who upvoted
  upvoteCount: number;
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
          default_writing_style: string | null;
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
          default_writing_style?: string | null;
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
          default_writing_style?: string | null;
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
          created_at?: string;
          updated_at?: string;
        };
      };
      sample_documents: {
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
      feedbacks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          status: string;
          upvotes: Json;
          upvote_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category?: string;
          status?: string;
          upvotes?: Json;
          upvote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          status?: string;
          upvotes?: Json;
          upvote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      generated_documents: {
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
          is_edited: boolean;
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
          is_edited?: boolean;
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
          is_edited?: boolean;
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

export type SampleDocumentRow = Tables<"sample_documents">;
export type SampleDocumentInsert = Inserts<"sample_documents">;
export type SampleDocumentUpdate = Updates<"sample_documents">;

export type GeneratedDocumentRow = Tables<"generated_documents">;
export type GeneratedDocumentInsert = Inserts<"generated_documents">;
export type GeneratedDocumentUpdate = Updates<"generated_documents">;

export type FeedbackRow = Tables<"feedbacks">;
export type FeedbackInsert = Inserts<"feedbacks">;
export type FeedbackUpdate = Updates<"feedbacks">;

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
  defaultWritingStyle: row.default_writing_style,
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
  if (user.defaultWritingStyle !== undefined)
    record.default_writing_style = user.defaultWritingStyle;

  return record as UserUpdate;
};

/** Convert database row to Feedback interface */
export const dbRowToFeedback = (row: FeedbackRow): Feedback => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  category: row.category as Feedback["category"],
  status: row.status as Feedback["status"],
  upvotes: (row.upvotes as string[]) || [],
  upvoteCount: row.upvote_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/** Convert a partial `Feedback` object to a Supabase `Update` object. */
export const feedbackToDbUpdate = (feedback: Partial<Feedback>): FeedbackUpdate => {
  const record: Partial<FeedbackUpdate> = {
    updated_at: new Date().toISOString(),
  };

  if (feedback.title !== undefined) record.title = feedback.title;
  if (feedback.description !== undefined) record.description = feedback.description;
  if (feedback.category !== undefined) record.category = feedback.category;
  if (feedback.status !== undefined) record.status = feedback.status;
  if (feedback.upvotes !== undefined) record.upvotes = feedback.upvotes;
  if (feedback.upvoteCount !== undefined) record.upvote_count = feedback.upvoteCount;

  return record as FeedbackUpdate;
};
