-- Fix authenticity score columns to support percentages (0-100)
-- This migration changes the column types to support proper percentage values

-- Update writing_styles.authenticity_baseline to support percentages
ALTER TABLE writing_styles 
ALTER COLUMN authenticity_baseline TYPE DECIMAL(5,2);

-- Update generated_documents.authenticity_score to support percentages  
ALTER TABLE generated_documents 
ALTER COLUMN authenticity_score TYPE DECIMAL(5,2);

-- Update existing values to proper percentages
-- Convert any values that are currently in the 0-9.99 range to 0-100 range
UPDATE writing_styles 
SET authenticity_baseline = 85.00 
WHERE authenticity_baseline <= 9.99;

UPDATE generated_documents 
SET authenticity_score = 85.00 
WHERE authenticity_score <= 9.99;

-- Set default values to proper percentages
ALTER TABLE writing_styles 
ALTER COLUMN authenticity_baseline SET DEFAULT 85.00;

ALTER TABLE generated_documents 
ALTER COLUMN authenticity_score SET DEFAULT 85.00;