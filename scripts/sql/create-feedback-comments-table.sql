-- Create feedback_comments table
CREATE TABLE IF NOT EXISTS feedback_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_comments_feedback_id ON feedback_comments(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_user_id ON feedback_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_created_at ON feedback_comments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to read all comments
CREATE POLICY "Users can view all feedback comments" ON feedback_comments
    FOR SELECT USING (true);

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create feedback comments" ON feedback_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own feedback comments" ON feedback_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own feedback comments" ON feedback_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feedback_comments_updated_at
    BEFORE UPDATE ON feedback_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_comments_updated_at(); 