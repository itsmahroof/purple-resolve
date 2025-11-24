-- Update description column length constraint to 500 characters
-- This enforces stricter input validation at the database level

-- First, drop the existing minimum length constraint for description
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS description_min_length;

-- Update the description column to VARCHAR(500)
ALTER TABLE complaints 
  ALTER COLUMN description TYPE VARCHAR(500);

-- Re-add the minimum length constraint
ALTER TABLE complaints
  ADD CONSTRAINT description_min_length CHECK (char_length(description) >= 10);

-- Add comment to document the constraint
COMMENT ON COLUMN complaints.description IS 'Detailed complaint description. Must be between 10-500 characters to prevent abuse and ensure meaningful content.';