-- =====================================================
-- Scribal Database Reset Script
-- =====================================================
-- WARNING: This script will delete all data and reset the public schema.
-- It will preserve auth.users and storage.files.
-- After running this, you must run schema.sql to rebuild the database.
-- =====================================================

-- Drop the public schema completely, which removes all its objects.
DROP SCHEMA IF EXISTS public CASCADE;

-- Recreate the public schema.
CREATE SCHEMA public;

-- Grant usage to the default Supabase roles.
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Re-enable the pgcrypto extension within the new public schema.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Restore default grants for the public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


-- =====================================================
-- Reset complete.
-- The public schema is now clean and ready for schema.sql.
-- ===================================================== 