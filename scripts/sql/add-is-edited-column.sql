-- Add is_edited column to generated_documents table
-- This column tracks whether a generated document has been manually edited

ALTER TABLE generated_documents 
ADD COLUMN is_edited BOOLEAN DEFAULT FALSE;

-- Update existing records to set is_edited to false
UPDATE generated_documents 
SET is_edited = FALSE 
WHERE is_edited IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE generated_documents 
ALTER COLUMN is_edited SET NOT NULL;