-- Add likes functionality to feedback_comments table
-- This script should be run after the initial feedback_comments table is created

-- Add likes column to feedback_comments table
ALTER TABLE feedback_comments 
ADD COLUMN IF NOT EXISTS likes JSONB DEFAULT '[]'::jsonb;

-- Add likes_count column to feedback_comments table
ALTER TABLE feedback_comments 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create function to update likes count when likes array changes
CREATE OR REPLACE FUNCTION public.update_feedback_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.likes_count = jsonb_array_length(NEW.likes);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes count
DROP TRIGGER IF EXISTS update_feedback_comment_likes_count_trigger ON feedback_comments;
CREATE TRIGGER update_feedback_comment_likes_count_trigger
  BEFORE INSERT OR UPDATE ON public.feedback_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_feedback_comment_likes_count();

-- Create index for likes_count
CREATE INDEX IF NOT EXISTS idx_feedback_comments_likes_count ON feedback_comments(likes_count DESC);

-- Update existing comments to have empty likes array if they don't have one
UPDATE feedback_comments 
SET likes = '[]'::jsonb 
WHERE likes IS NULL;

-- Update likes_count for existing comments
UPDATE feedback_comments 
SET likes_count = jsonb_array_length(likes); 