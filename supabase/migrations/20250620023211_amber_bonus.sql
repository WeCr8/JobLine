/*
  # SaaS Owner Administration Schema

  1. New Tables
    - `subscription_plans`: Defines available subscription plans
      - Includes pricing, features, and Stripe integration
      - Tracks subscriber counts and plan status

    - `organizations`: Manages customer organizations
      - Links to subscription and users
      - Stores organization metadata and settings
      - Enables multi-tenant architecture

    - `organization_users`: Maps users to organizations
      - Defines user roles within organizations
      - Supports multiple organizations per user

    - `system_settings`: Stores global application settings
      - API keys, AI configuration, backup settings
      - Email templates and notification settings

    - `system_logs`: Records important system events
      - Tracks errors, warnings, and audit information
      - Supports troubleshooting and compliance

  2. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for SaaS admin access
    - Separates organization admin from platform admin

  3. Roles
    - Adds 'organization_admin' role to user_role enum
    - Distinguishes between platform admins and org admins
*/

-- Add organization_admin to user_role enum
ALTER TYPE user_role ADD VALUE 'organization_admin';

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

-- Create policies for SaaS admin access
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

-- Update users policies to handle organization context
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

-- Create triggers for updated_at columns
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
  ('default_user_role', 'operator', false, 'Default role for new users', 'users');