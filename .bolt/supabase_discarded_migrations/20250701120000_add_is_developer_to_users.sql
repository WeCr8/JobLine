-- Add is_developer boolean column to users table
ALTER TABLE users ADD COLUMN is_developer boolean NOT NULL DEFAULT false; 