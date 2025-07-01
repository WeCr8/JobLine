/*
  # Admin Portal Schema

  1. New Tables
    - `subscription_plans` - Subscription plan definitions
    - `organizations` - Customer organizations
    - `organization_users` - Organization membership
    - `system_settings` - Platform configuration settings
    - `system_logs` - System activity logs
    - `invites` - Organization user invitations

  2. Changes
    - Add `organization_admin` to user_role enum
    - Add `organization_id` to users table

  3. Security
    - Enable RLS on all new tables
    - Create policies for platform admins and organization admins
*/

-- Check if organization_admin exists in user_role enum before adding
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid
                  WHERE pg_type.typname = 'user_role' 
                  AND pg_enum.enumlabel = 'organization_admin') THEN
        ALTER TYPE user_role ADD VALUE 'organization_admin';
    END IF;
END$$;

-- Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- in cents
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  stripe_price_id TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  subscriber_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  plan_id UUID REFERENCES subscription_plans(id),
  max_users INTEGER DEFAULT 10,
  current_user_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organization Users table
CREATE TABLE IF NOT EXISTS organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  encrypted BOOLEAN DEFAULT false,
  description TEXT,
  category TEXT NOT NULL,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- System Logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG')),
  message TEXT NOT NULL,
  context JSONB,
  user_id UUID REFERENCES users(id),
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Add organization_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Enable RLS on new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for SaaS admin access (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscription_plans' AND policyname = 'Only platform admins can manage subscription plans') THEN
        CREATE POLICY "Only platform admins can manage subscription plans" ON subscription_plans
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Only platform admins can manage organizations') THEN
        CREATE POLICY "Only platform admins can manage organizations" ON organizations
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Organization admins can view their organization') THEN
        CREATE POLICY "Organization admins can view their organization" ON organizations
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM organization_users
              WHERE organization_id = organizations.id
              AND user_id::text = auth.uid()::text
              AND is_admin = true
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organization_users' AND policyname = 'Only platform admins can manage organization users') THEN
        CREATE POLICY "Only platform admins can manage organization users" ON organization_users
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organization_users' AND policyname = 'Organization admins can view their organization users') THEN
        CREATE POLICY "Organization admins can view their organization users" ON organization_users
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM organization_users ou
              WHERE ou.organization_id = organization_users.organization_id
              AND ou.user_id::text = auth.uid()::text
              AND ou.is_admin = true
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Only platform admins can manage system settings') THEN
        CREATE POLICY "Only platform admins can manage system settings" ON system_settings
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_logs' AND policyname = 'Only platform admins can view system logs') THEN
        CREATE POLICY "Only platform admins can view system logs" ON system_logs
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
END$$;

-- Update users policies to handle organization context
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Organization admins can view users in their organization') THEN
        CREATE POLICY "Organization admins can view users in their organization" ON users
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM organization_users
              WHERE organization_id = users.organization_id
              AND user_id::text = auth.uid()::text
              AND is_admin = true
            )
          );
    END IF;
END$$;

-- Create triggers for updated_at columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscription_plans_updated_at') THEN
        CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_organizations_updated_at') THEN
        CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_system_settings_updated_at') THEN
        CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END$$;

-- Insert initial system settings
INSERT INTO system_settings (key, value, encrypted, description, category)
VALUES
  ('stripe_secret_key', NULL, true, 'Stripe API Secret Key', 'payment'),
  ('stripe_webhook_secret', NULL, true, 'Stripe Webhook Secret', 'payment'),
  ('openai_api_key', NULL, true, 'OpenAI API Key', 'ai'),
  ('ai_default_model', 'gpt-4', false, 'Default AI model to use', 'ai'),
  ('ai_temperature', '0.7', false, 'AI temperature setting', 'ai'),
  ('ai_max_tokens', '2000', false, 'Maximum tokens for AI responses', 'ai'),
  ('backup_enabled', 'true', false, 'Enable automatic database backups', 'backup'),
  ('backup_frequency', 'daily', false, 'Backup frequency (hourly, daily, weekly)', 'backup'),
  ('backup_retention_days', '30', false, 'Number of days to retain backups', 'backup'),
  ('app_name', 'JobLine.ai', false, 'Application name', 'general'),
  ('support_email', 'support@jobline.ai', false, 'Support email address', 'general'),
  ('default_user_role', 'operator', false, 'Default role for new users', 'users')
ON CONFLICT (key) DO NOTHING;

-- Create initial platform admin users
INSERT INTO users (email, name, role, is_active)
VALUES 
  ('zach@wecr8.info', 'Zach Admin', 'admin', true),
  ('admin@wecr8.info', 'Admin User', 'admin', true)
ON CONFLICT (email) DO UPDATE
SET role = 'admin', organization_id = NULL, is_active = true;

-- Create invites table for organization user invitations
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

-- Enable RLS on invites table
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Create policies for invites
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invites' AND policyname = 'Only platform admins can manage all invites') THEN
        CREATE POLICY "Only platform admins can manage all invites" ON invites
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id::text = auth.uid()::text 
              AND role = 'admin'
              AND organization_id IS NULL
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invites' AND policyname = 'Organization admins can manage their organization invites') THEN
        CREATE POLICY "Organization admins can manage their organization invites" ON invites
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM organization_users
              WHERE organization_id = invites.organization_id
              AND user_id::text = auth.uid()::text
              AND is_admin = true
            )
          );
    END IF;
END$$;