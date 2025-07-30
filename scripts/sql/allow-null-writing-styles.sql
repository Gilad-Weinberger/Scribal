-- =====================================================
-- Allow Null Writing Styles and Handle Deletion
-- =====================================================

-- This script ensures that documents can have null writing_style_id
-- and properly handles the deletion of writing styles

-- 1. Ensure writing_style_id can be null in sample_documents
-- (This should already be the case, but let's make it explicit)
ALTER TABLE public.sample_documents 
ALTER COLUMN writing_style_id DROP NOT NULL;

-- 2. Ensure writing_style_id can be null in generated_documents  
-- (This should already be the case, but let's make it explicit)
ALTER TABLE public.generated_documents 
ALTER COLUMN writing_style_id DROP NOT NULL;

-- 3. Update foreign key constraints to handle null values properly
-- For sample_documents
ALTER TABLE public.sample_documents 
DROP CONSTRAINT IF EXISTS sample_documents_writing_style_id_fkey;

ALTER TABLE public.sample_documents 
ADD CONSTRAINT sample_documents_writing_style_id_fkey 
FOREIGN KEY (writing_style_id) 
REFERENCES public.writing_styles(id) 
ON DELETE SET NULL;

-- For generated_documents
ALTER TABLE public.generated_documents 
DROP CONSTRAINT IF EXISTS generated_documents_writing_style_id_fkey;

ALTER TABLE public.generated_documents 
ADD CONSTRAINT generated_documents_writing_style_id_fkey 
FOREIGN KEY (writing_style_id) 
REFERENCES public.writing_styles(id) 
ON DELETE SET NULL;

-- 4. Create a function to handle writing style deletion
CREATE OR REPLACE FUNCTION public.handle_writing_style_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Set writing_style_id to NULL for all sample_documents that reference this writing style
  UPDATE public.sample_documents 
  SET writing_style_id = NULL 
  WHERE writing_style_id = OLD.id;
  
  -- Set writing_style_id to NULL for all generated_documents that reference this writing style
  UPDATE public.generated_documents 
  SET writing_style_id = NULL 
  WHERE writing_style_id = OLD.id;
  
  -- Set default_writing_style to NULL for users who have this as their default
  UPDATE public.users 
  SET default_writing_style = NULL 
  WHERE default_writing_style = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to automatically handle writing style deletion
DROP TRIGGER IF EXISTS on_writing_style_deleted ON public.writing_styles;
CREATE TRIGGER on_writing_style_deleted
  BEFORE DELETE ON public.writing_styles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_writing_style_deletion();

-- 6. Add comments for clarity
COMMENT ON COLUMN public.sample_documents.writing_style_id IS 'Can be NULL if no writing style is associated';
COMMENT ON COLUMN public.generated_documents.writing_style_id IS 'Can be NULL if no writing style is associated';

-- 7. Create indexes for better performance when querying by writing_style_id
CREATE INDEX IF NOT EXISTS idx_sample_documents_writing_style_id_null ON public.sample_documents(writing_style_id) WHERE writing_style_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_generated_documents_writing_style_id_null ON public.generated_documents(writing_style_id) WHERE writing_style_id IS NULL; 