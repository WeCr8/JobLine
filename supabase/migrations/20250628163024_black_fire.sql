/*
  # User Settings Tables
  
  1. New Tables
    - `user_settings` - Stores user preferences and settings
  
  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to manage their own settings
*/

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_settings table
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at column
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create policies for user_settings
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Create policy for admins to view all settings
CREATE POLICY "Admins can view all user settings" ON user_settings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );