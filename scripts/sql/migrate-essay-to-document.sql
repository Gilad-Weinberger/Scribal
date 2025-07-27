-- =====================================================
-- Migration Script: Essay to Document
-- =====================================================
-- This script renames all essay-related tables, columns, and references
-- to use "document" instead of "essay"

-- =====================================================
-- Step 1: Rename Tables
-- =====================================================

-- Rename sample_essays table to sample_documents
ALTER TABLE public.sample_essays RENAME TO sample_documents;

-- Rename generated_essays table to generated_documents
ALTER TABLE public.generated_essays RENAME TO generated_documents;

-- Rename essay_sections table to document_sections
ALTER TABLE public.essay_sections RENAME TO document_sections;

-- =====================================================
-- Step 2: Rename Columns
-- =====================================================

-- Rename columns in sample_documents table
ALTER TABLE public.sample_documents RENAME COLUMN writing_style_id TO writing_style_id;

-- Rename columns in generated_documents table
ALTER TABLE public.generated_documents RENAME COLUMN writing_style_id TO writing_style_id;

-- Rename columns in document_sections table
ALTER TABLE public.document_sections RENAME COLUMN generated_essay_id TO generated_document_id;

-- =====================================================
-- Step 3: Update Foreign Key Constraints
-- =====================================================

-- Drop existing foreign key constraints
ALTER TABLE public.document_sections DROP CONSTRAINT IF EXISTS essay_sections_generated_essay_id_fkey;

-- Add new foreign key constraints with updated names
ALTER TABLE public.document_sections 
ADD CONSTRAINT document_sections_generated_document_id_fkey 
FOREIGN KEY (generated_document_id) REFERENCES public.generated_documents(id) ON DELETE CASCADE;

-- =====================================================
-- Step 4: Update Triggers
-- =====================================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS sample_essays_updated_at ON public.sample_documents;
DROP TRIGGER IF EXISTS generated_essays_updated_at ON public.generated_documents;
DROP TRIGGER IF EXISTS essay_sections_updated_at ON public.document_sections;

-- Create new triggers with updated names
CREATE TRIGGER sample_documents_updated_at BEFORE UPDATE ON public.sample_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER generated_documents_updated_at BEFORE UPDATE ON public.generated_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER document_sections_updated_at BEFORE UPDATE ON public.document_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Step 5: Update Row Level Security Policies
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own sample essays" ON public.sample_documents;
DROP POLICY IF EXISTS "Users can manage their own generated essays" ON public.generated_documents;
DROP POLICY IF EXISTS "Users can manage sections of their own essays" ON public.document_sections;

-- Create new policies with updated names
CREATE POLICY "Users can manage their own sample documents" ON public.sample_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own generated documents" ON public.generated_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage sections of their own documents" ON public.document_sections
  FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM public.generated_documents WHERE id = generated_document_id
    )
  );

-- =====================================================
-- Step 6: Update Indexes
-- =====================================================

-- Drop existing indexes
DROP INDEX IF EXISTS idx_sample_essays_user_id;
DROP INDEX IF EXISTS idx_sample_essays_writing_style_id;
DROP INDEX IF EXISTS idx_generated_essays_user_id;
DROP INDEX IF EXISTS idx_generated_essays_created_at;
DROP INDEX IF EXISTS idx_essay_sections_generated_essay_id;

-- Create new indexes with updated names
CREATE INDEX idx_sample_documents_user_id ON sample_documents(user_id);
CREATE INDEX idx_sample_documents_writing_style_id ON sample_documents(writing_style_id);
CREATE INDEX idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX idx_generated_documents_created_at ON generated_documents(created_at DESC);
CREATE INDEX idx_document_sections_generated_document_id ON document_sections(generated_document_id);

-- =====================================================
-- Step 7: Update Comments
-- =====================================================

-- Update table comments
COMMENT ON TABLE public.sample_documents IS 'Sample documents uploaded by users for style analysis';
COMMENT ON TABLE public.generated_documents IS 'Generated documents and their metadata';
COMMENT ON TABLE public.document_sections IS 'Document sections for granular editing and authenticity tracking';

-- =====================================================
-- Migration Complete
-- =====================================================
-- All essay-related tables, columns, and references have been renamed to use "document" 