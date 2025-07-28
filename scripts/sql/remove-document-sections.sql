-- =====================================================
-- Remove document_sections table and all related objects
-- =====================================================

-- Drop the document_sections table and all its dependencies
DROP TABLE IF EXISTS public.document_sections CASCADE;

-- Note: CASCADE will automatically drop:
-- - All triggers on the table
-- - All policies on the table  
-- - All indexes on the table
-- - All foreign key constraints referencing this table

-- The table and all its related objects have been completely removed 