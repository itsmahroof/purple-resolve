-- Add length constraints to complaints table
ALTER TABLE complaints
ADD CONSTRAINT title_length CHECK (char_length(title) <= 200 AND char_length(title) >= 5),
ADD CONSTRAINT description_length CHECK (char_length(description) <= 5000 AND char_length(description) >= 20),
ADD CONSTRAINT admin_note_length CHECK (admin_note IS NULL OR char_length(admin_note) <= 5000);