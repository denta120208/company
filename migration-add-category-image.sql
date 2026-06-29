-- Add image column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT;
