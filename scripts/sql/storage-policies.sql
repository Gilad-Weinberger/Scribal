-- scripts/sql/storage-policies.sql

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES FOR 'scribal-bucket'
-- -----------------------------------------------------------------------------
-- These policies grant specific permissions to authenticated users for
-- interacting with files within the 'profile-pictures' folder in the
-- 'scribal-bucket'.
--
-- To apply these, run this script in your Supabase SQL Editor.
-- -----------------------------------------------------------------------------

-- 1. Policy to allow authenticated users to upload profile pictures.
-- This policy grants INSERT permissions to any authenticated user, but only
-- for files being uploaded into the 'profile-pictures' folder.
CREATE POLICY "Allow authenticated users to upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'scribal-bucket' AND
  (storage.foldername(name))[1] = 'profile-pictures'
);

-- 2. Policy to allow public read access to all profile pictures.
-- This makes any file in the 'profile-pictures' folder readable by anyone,
-- which is suitable for public avatars.
CREATE POLICY "Allow public read access to profile pictures"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scribal-bucket' AND
  (storage.foldername(name))[1] = 'profile-pictures'
);

-- 3. Policy to allow users to update their own profile picture.
-- This policy allows an authenticated user to UPDATE an existing object,
-- but only if they are the owner of that object (i.e., they uploaded it).
CREATE POLICY "Allow users to update their own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'scribal-bucket' AND
  (storage.foldername(name))[1] = 'profile-pictures' AND
  owner = auth.uid()
);

-- 4. Policy to allow users to delete their own profile picture.
-- This policy allows an authenticated user to DELETE an object, but only
-- if they are the owner of that object.
CREATE POLICY "Allow users to delete their own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'scribal-bucket' AND
  (storage.foldername(name))[1] = 'profile-pictures' AND
  owner = auth.uid()
); 