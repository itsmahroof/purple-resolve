-- Update complaints table with proper column types and constraints
-- This migration enforces input validation at the database level

-- First, drop existing CHECK constraints if they exist
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS title_length;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS description_length;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS admin_note_length;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS description_min_length;

-- Alter column types with maximum lengths
ALTER TABLE complaints 
  ALTER COLUMN title TYPE VARCHAR(100);

ALTER TABLE complaints 
  ALTER COLUMN description TYPE VARCHAR(1000);

ALTER TABLE complaints 
  ALTER COLUMN category TYPE VARCHAR(50);

ALTER TABLE complaints 
  ALTER COLUMN admin_note TYPE VARCHAR(300);

-- Add minimum length constraint for description
ALTER TABLE complaints
  ADD CONSTRAINT description_min_length CHECK (char_length(description) >= 10);

-- Add minimum length constraint for title
ALTER TABLE complaints
  ADD CONSTRAINT title_min_length CHECK (char_length(title) >= 3);

-- Add minimum length constraint for category
ALTER TABLE complaints
  ADD CONSTRAINT category_min_length CHECK (char_length(category) >= 3);

-- Ensure title, description, and category are not empty (additional safety)
ALTER TABLE complaints
  ADD CONSTRAINT title_not_empty CHECK (trim(title) != '');

ALTER TABLE complaints
  ADD CONSTRAINT description_not_empty CHECK (trim(description) != '');

ALTER TABLE complaints
  ADD CONSTRAINT category_not_empty CHECK (trim(category) != '');