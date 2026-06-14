-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add scenario_id to questions
-- First check if it exists to avoid errors
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='questions' AND column_name='scenario_id') THEN
        ALTER TABLE questions ADD COLUMN scenario_id UUID REFERENCES scenarios(id);
    END IF;
END $$;
