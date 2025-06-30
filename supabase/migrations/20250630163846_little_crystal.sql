/*
  # User Account Types Schema

  1. New Tables
    - `account_types` - Defines different account types (demo, live, trial)
    - `user_account_settings` - Links users to account types with additional settings
    - `demo_data_status` - Tracks demo data seeding status

  2. Changes
    - Add `account_type_id` to users table
    - Add policies for account type management

  3. Security
    - Enable RLS on all new tables
    - Create policies for accessing account type data
*/

-- Account Types table
CREATE TABLE IF NOT EXISTS account_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB DEFAULT '{}',
  limitations JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Account Settings table
CREATE TABLE IF NOT EXISTS user_account_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_type_id UUID REFERENCES account_types(id),
  settings JSONB DEFAULT '{}',
  is_demo BOOLEAN DEFAULT false,
  demo_data_seeded BOOLEAN DEFAULT false,
  demo_seed_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Demo Data Status table
CREATE TABLE IF NOT EXISTS demo_data_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  is_seeded BOOLEAN DEFAULT false,
  seed_date TIMESTAMPTZ,
  seed_version TEXT,
  seed_status TEXT DEFAULT 'pending' CHECK (seed_status IN ('pending', 'in-progress', 'completed', 'failed')),
  seed_log JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id)
);

-- Add account_type_id to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'account_type_id'
  ) THEN
    ALTER TABLE users ADD COLUMN account_type_id UUID REFERENCES account_types(id);
  END IF;
END$$;

-- Enable RLS on new tables
ALTER TABLE account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_data_status ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at columns
CREATE TRIGGER update_account_types_updated_at 
  BEFORE UPDATE ON account_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_account_settings_updated_at 
  BEFORE UPDATE ON user_account_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demo_data_status_updated_at 
  BEFORE UPDATE ON demo_data_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create policies for account types
CREATE POLICY "Only platform admins can manage account types" ON account_types
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
      AND organization_id IS NULL
    )
  );

CREATE POLICY "Users can view account types" ON account_types
  FOR SELECT TO authenticated
  USING (true);

-- Create policies for user account settings
CREATE POLICY "Users can view their own account settings" ON user_account_settings
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Only platform admins can manage user account settings" ON user_account_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
      AND organization_id IS NULL
    )
  );

-- Create policies for demo data status
CREATE POLICY "Organization admins can view their demo data status" ON demo_data_status
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_users
      WHERE organization_id = demo_data_status.organization_id
      AND user_id::text = auth.uid()::text
      AND is_admin = true
    )
  );

CREATE POLICY "Only platform admins can manage demo data status" ON demo_data_status
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
      AND organization_id IS NULL
    )
  );

-- Insert default account types
INSERT INTO account_types (name, description, features, limitations, is_active)
VALUES 
  ('live', 'Production account with full access', 
   '{"full_access": true, "support_level": "premium", "data_retention": "unlimited"}', 
   '{}', 
   true),
  ('demo', 'Demonstration account with sample data', 
   '{"sample_data": true, "expiration": true}', 
   '{"max_records": 100, "duration_days": 14, "export_disabled": true}', 
   true),
  ('trial', 'Trial account with limited features', 
   '{"full_access": true, "expiration": true}', 
   '{"duration_days": 30, "max_users": 5}', 
   true)
ON CONFLICT (name) DO NOTHING;

-- Create function to handle demo user creation
CREATE OR REPLACE FUNCTION handle_demo_user_creation()
RETURNS TRIGGER AS $$
DECLARE
  demo_account_id UUID;
BEGIN
  -- Get the demo account type ID
  SELECT id INTO demo_account_id FROM account_types WHERE name = 'demo';
  
  -- If the email contains 'demo' or the user is explicitly marked as demo
  IF NEW.email LIKE '%demo%' OR NEW.account_type_id = demo_account_id THEN
    -- Set the account type to demo if not already set
    IF NEW.account_type_id IS NULL THEN
      NEW.account_type_id := demo_account_id;
    END IF;
    
    -- Create user account settings entry
    INSERT INTO user_account_settings (
      user_id, 
      account_type_id, 
      is_demo, 
      settings,
      expiration_date
    )
    VALUES (
      NEW.id, 
      demo_account_id, 
      true, 
      '{"demo_profile": true, "demo_features_enabled": true}',
      NOW() + INTERVAL '14 days'
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      account_type_id = demo_account_id,
      is_demo = true,
      expiration_date = NOW() + INTERVAL '14 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for demo user handling
DROP TRIGGER IF EXISTS handle_demo_user_trigger ON users;
CREATE TRIGGER handle_demo_user_trigger
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_demo_user_creation();

-- Create function to track user logins
CREATE OR REPLACE FUNCTION track_user_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user account settings with login information
  INSERT INTO user_account_settings (
    user_id,
    last_login,
    login_count
  )
  VALUES (
    NEW.id,
    NEW.last_login,
    1
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_login = NEW.last_login,
    login_count = user_account_settings.login_count + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for login tracking
DROP TRIGGER IF EXISTS track_user_login_trigger ON users;
CREATE TRIGGER track_user_login_trigger
  AFTER UPDATE OF last_login ON users
  FOR EACH ROW
  WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
  EXECUTE FUNCTION track_user_login();

-- Create demo users if they don't exist
DO $$
DECLARE
  demo_account_id UUID;
  org_id UUID;
  admin_id UUID;
  operator_id UUID;
BEGIN
  -- Get the demo account type ID
  SELECT id INTO demo_account_id FROM account_types WHERE name = 'demo';
  
  -- Get or create demo organization
  SELECT id INTO org_id FROM organizations WHERE name = 'Demo Organization';
  IF org_id IS NULL THEN
    INSERT INTO organizations (
      name, 
      industry, 
      primary_contact_name, 
      primary_contact_email,
      is_active
    )
    VALUES (
      'Demo Organization', 
      'Manufacturing', 
      'Demo Admin', 
      'demo-org-admin@wecr8.info',
      true
    )
    RETURNING id INTO org_id;
  END IF;
  
  -- Create demo org admin if not exists
  SELECT id INTO admin_id FROM users WHERE email = 'demo-org-admin@wecr8.info';
  IF admin_id IS NULL THEN
    INSERT INTO users (
      email,
      name,
      role,
      department,
      organization_id,
      account_type_id,
      is_active
    )
    VALUES (
      'demo-org-admin@wecr8.info',
      'Demo Organization Admin',
      'organization_admin',
      'Administration',
      org_id,
      demo_account_id,
      true
    )
    RETURNING id INTO admin_id;
    
    -- Add to organization_users
    INSERT INTO organization_users (
      organization_id,
      user_id,
      role,
      is_admin,
      is_primary
    )
    VALUES (
      org_id,
      admin_id,
      'organization_admin',
      true,
      true
    );
  END IF;
  
  -- Create demo operator if not exists
  SELECT id INTO operator_id FROM users WHERE email = 'demo-operator@wecr8.info';
  IF operator_id IS NULL THEN
    INSERT INTO users (
      email,
      name,
      role,
      department,
      organization_id,
      account_type_id,
      is_active
    )
    VALUES (
      'demo-operator@wecr8.info',
      'Demo Operator',
      'operator',
      'cnc-machining',
      org_id,
      demo_account_id,
      true
    )
    RETURNING id INTO operator_id;
    
    -- Add to organization_users
    INSERT INTO organization_users (
      organization_id,
      user_id,
      role,
      is_admin,
      is_primary
    )
    VALUES (
      org_id,
      operator_id,
      'operator',
      false,
      false
    );
  END IF;
  
  -- Create demo data status entry
  INSERT INTO demo_data_status (
    organization_id,
    is_seeded,
    seed_status
  )
  VALUES (
    org_id,
    false,
    'pending'
  )
  ON CONFLICT (organization_id) DO NOTHING;
  
END$$;