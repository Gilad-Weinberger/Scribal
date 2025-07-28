-- =====================================================
-- Scribal Database Schema for Supabase
-- =====================================================

-- =====================================================
-- Extensions
-- =====================================================
-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- ENUM Types
-- =====================================================
CREATE TYPE public.user_role AS ENUM ('client', 'admin');

-- =====================================================
-- Tables
-- =====================================================

-- Writing styles table - stores user's unique writing DNA
CREATE TABLE public.writing_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_name TEXT NOT NULL DEFAULT 'My Writing Style',
    vocabulary_level INTEGER CHECK (vocabulary_level >= 1 AND vocabulary_level <= 10),
    avg_sentence_length DECIMAL(5,2),
    complexity_score DECIMAL(3,2),
    tone_analysis JSONB,
    writing_patterns JSONB,
    sample_phrases TEXT[],
    authenticity_baseline DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Users table for authentication and profile
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    display_name TEXT,
    role public.user_role DEFAULT 'client'::public.user_role,
    university TEXT,
    major TEXT,
    profile_picture_url TEXT,
    default_writing_style UUID REFERENCES public.writing_styles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add user_id foreign key to writing_styles
ALTER TABLE public.writing_styles
ADD COLUMN user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE;

-- Sample documents uploaded by users for style analysis
CREATE TABLE public.sample_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    writing_style_id UUID REFERENCES public.writing_styles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    file_name TEXT,
    file_size INTEGER,
    analysis_status TEXT DEFAULT 'pending', -- pending, analyzing, completed, error
    analysis_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Generated documents and their metadata
CREATE TABLE public.generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    writing_style_id UUID REFERENCES public.writing_styles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    requirements TEXT,
    generated_content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    authenticity_score DECIMAL(3,2) DEFAULT 0.00,
    generation_time_ms INTEGER,
    status TEXT DEFAULT 'completed', -- generating, completed, error
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);



-- =====================================================
-- Triggers
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER writing_styles_updated_at BEFORE UPDATE ON public.writing_styles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER sample_documents_updated_at BEFORE UPDATE ON public.sample_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER generated_documents_updated_at BEFORE UPDATE ON public.generated_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;


-- Policies for users table
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own data" ON public.users FOR DELETE USING (auth.uid() = id);

-- Policies for writing_styles table
CREATE POLICY "Users can manage their own writing styles" ON public.writing_styles FOR ALL USING (auth.uid() = user_id);

-- Policies for sample_documents table
CREATE POLICY "Users can manage their own sample documents" ON public.sample_documents FOR ALL USING (auth.uid() = user_id);

-- Policies for generated_documents table
CREATE POLICY "Users can manage their own generated documents" ON public.generated_documents FOR ALL USING (auth.uid() = user_id);




-- =====================================================
-- User Profile Management
-- =====================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, profile_picture_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_writing_styles_user_id ON writing_styles(user_id);
CREATE INDEX idx_sample_documents_user_id ON sample_documents(user_id);
CREATE INDEX idx_sample_documents_writing_style_id ON sample_documents(writing_style_id);
CREATE INDEX idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX idx_generated_documents_created_at ON generated_documents(created_at DESC);
 