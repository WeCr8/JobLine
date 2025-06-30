/*
  # Integration Tables

  1. New Tables
    - `connection_configs` - Stores connection configurations for external systems
    - `import_jobs` - Tracks data import jobs
    - `import_mappings` - Defines field mappings for imports
    - `compliance_checks` - Records compliance verification results
    - `export_control_flags` - Stores export control information for jobs

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Connection Configs table
CREATE TABLE IF NOT EXISTS connection_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  connection_type connection_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
  config JSONB,
  compliance_level compliance_level DEFAULT 'basic',
  last_sync TIMESTAMPTZ,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Import Jobs table
CREATE TABLE IF NOT EXISTS import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES connection_configs(id),
  import_type import_type NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  mapping JSONB,
  records_processed INTEGER DEFAULT 0,
  records_success INTEGER DEFAULT 0,
  records_error INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Import Mappings table
CREATE TABLE IF NOT EXISTS import_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES connection_configs(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  target_field TEXT NOT NULL,
  transform TEXT,
  required BOOLEAN DEFAULT false,
  compliance_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance Checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('allowed', 'denied', 'restricted')),
  rules TEXT[],
  ip_address INET,
  location TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Export Control Flags table
CREATE TABLE IF NOT EXISTS export_control_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) UNIQUE,
  classification TEXT NOT NULL CHECK (classification IN ('itar', 'ear', 'dfars', 'uncontrolled')),
  category TEXT,
  restrictions TEXT[],
  authorized_personnel UUID[],
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE connection_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_control_flags ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at columns
CREATE TRIGGER update_connection_configs_updated_at BEFORE UPDATE ON connection_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_export_control_flags_updated_at BEFORE UPDATE ON export_control_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create policies for connection_configs
CREATE POLICY "Organization admins can manage their connections" ON connection_configs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND (
        role = 'admin' OR
        role = 'organization_admin' OR
        role = 'manager'
      )
    )
  );

-- Create policies for import_jobs
CREATE POLICY "Organization admins can manage their import jobs" ON import_jobs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND (
        role = 'admin' OR
        role = 'organization_admin' OR
        role = 'manager'
      )
    )
  );

-- Create policies for import_mappings
CREATE POLICY "Organization admins can manage their import mappings" ON import_mappings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND (
        role = 'admin' OR
        role = 'organization_admin' OR
        role = 'manager'
      )
    )
  );

-- Create policies for compliance_checks
CREATE POLICY "Organization admins can view compliance checks" ON compliance_checks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND (
        role = 'admin' OR
        role = 'organization_admin' OR
        role = 'manager'
      )
    )
  );

-- Create policies for export_control_flags
CREATE POLICY "Authorized personnel can access export control" ON export_control_flags
  FOR SELECT TO authenticated
  USING (
    (auth.uid()::text = ANY (authorized_personnel::text[])) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND (
        role = 'manager' OR
        role = 'admin'
      )
    )
  );