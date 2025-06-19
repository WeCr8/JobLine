-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('operator', 'lead', 'supervisor', 'manager', 'admin', 'customer');
CREATE TYPE job_status AS ENUM ('pending', 'setup', 'running', 'on-hold', 'completed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE operation_status AS ENUM ('pending', 'setup', 'running', 'completed', 'on-hold');
CREATE TYPE machine_status AS ENUM ('running', 'idle', 'maintenance', 'down');
CREATE TYPE machine_condition AS ENUM ('in-setup', 'running', 'idle', 'maintenance', 'down');
CREATE TYPE labor_type AS ENUM ('setup', 'run', 'teardown', 'maintenance', 'inspection');
CREATE TYPE shift_type AS ENUM ('day', 'evening', 'night');
CREATE TYPE tool_type AS ENUM ('end-mill', 'drill', 'tap', 'reamer', 'face-mill', 'insert', 'boring-bar');
CREATE TYPE connection_type AS ENUM ('google-sheets', 'csv-upload', 'rest-api', 'sql-odbc', 'sap-bapi', 'webhook', 'sftp');
CREATE TYPE compliance_level AS ENUM ('basic', 'itar', 'ear', 'cmmc-2', 'cmmc-3');
CREATE TYPE import_type AS ENUM ('job-data', 'operator-workcenter', 'routing-operations', 'cost-tracking', 'customer-association');

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'operator',
  department TEXT,
  employee_id TEXT UNIQUE,
  hire_date DATE DEFAULT CURRENT_DATE,
  phone TEXT,
  emergency_contact TEXT,
  certifications TEXT[],
  skills TEXT[],
  shift shift_type DEFAULT 'day',
  supervisor_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  department_type TEXT NOT NULL CHECK (department_type IN ('production', 'support')),
  supervisor_id UUID REFERENCES users(id),
  shift shift_type DEFAULT 'day',
  capabilities TEXT[],
  quality_standards TEXT[],
  active_jobs INTEGER DEFAULT 0,
  efficiency DECIMAL(5,2) DEFAULT 0,
  utilization_rate DECIMAL(5,2) DEFAULT 0,
  integrations TEXT[],
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Machines table
CREATE TABLE IF NOT EXISTS machines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  department_id TEXT REFERENCES departments(id),
  status machine_status DEFAULT 'idle',
  condition machine_condition DEFAULT 'idle',
  capabilities TEXT[],
  specifications JSONB,
  current_job_id UUID,
  operator_id UUID REFERENCES users(id),
  location TEXT,
  serial_number TEXT,
  manufacturer TEXT,
  model TEXT,
  year_installed INTEGER,
  last_maintenance DATE,
  next_maintenance DATE,
  utilization_rate DECIMAL(5,2) DEFAULT 0,
  efficiency DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Work Centers table
CREATE TABLE IF NOT EXISTS work_centers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department_id TEXT REFERENCES departments(id),
  machines TEXT[],
  capabilities TEXT[],
  capacity INTEGER DEFAULT 24, -- hours per day
  current_load DECIMAL(5,2) DEFAULT 0,
  efficiency DECIMAL(5,2) DEFAULT 0,
  setup_time INTEGER DEFAULT 0, -- minutes
  cycle_time INTEGER DEFAULT 0, -- minutes
  location TEXT,
  supervisor_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- JOB MANAGEMENT
-- =============================================

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT UNIQUE NOT NULL,
  part_number TEXT NOT NULL,
  part_name TEXT NOT NULL,
  customer TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  completed_quantity INTEGER DEFAULT 0 CHECK (completed_quantity >= 0),
  status job_status DEFAULT 'pending',
  priority priority_level DEFAULT 'medium',
  due_date DATE NOT NULL,
  start_date DATE,
  estimated_hours DECIMAL(8,2) DEFAULT 0,
  actual_hours DECIMAL(8,2) DEFAULT 0,
  operator_id UUID REFERENCES users(id),
  machine_id TEXT REFERENCES machines(id),
  work_center_id TEXT REFERENCES work_centers(id),
  operation TEXT,
  notes TEXT,
  export_control_classification TEXT,
  is_itar_controlled BOOLEAN DEFAULT false,
  customer_po TEXT,
  internal_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Job Operations table
CREATE TABLE IF NOT EXISTS job_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  operation_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  work_center_id TEXT REFERENCES work_centers(id),
  machine_id TEXT REFERENCES machines(id),
  setup_time INTEGER DEFAULT 0, -- minutes
  cycle_time INTEGER DEFAULT 0, -- minutes
  status operation_status DEFAULT 'pending',
  completed_quantity INTEGER DEFAULT 0,
  operator_id UUID REFERENCES users(id),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  notes TEXT,
  tooling TEXT[],
  programs TEXT[],
  instructions TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, operation_number)
);

-- Job History table
CREATE TABLE IF NOT EXISTS job_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES job_operations(id),
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Job Materials table
CREATE TABLE IF NOT EXISTS job_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  material TEXT NOT NULL,
  specification TEXT,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL,
  lot_number TEXT,
  certification_required BOOLEAN DEFAULT false,
  received BOOLEAN DEFAULT false,
  location TEXT,
  cost_per_unit DECIMAL(10,2),
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job Drawings table
CREATE TABLE IF NOT EXISTS job_drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES job_operations(id),
  name TEXT NOT NULL,
  revision TEXT NOT NULL,
  file_path TEXT NOT NULL,
  drawing_type TEXT CHECK (drawing_type IN ('part', 'assembly', 'detail', 'setup')),
  last_modified TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- DNC & PROGRAMMING
-- =============================================

-- DNC Programs table
CREATE TABLE IF NOT EXISTS dnc_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  version TEXT NOT NULL,
  last_modified TIMESTAMPTZ DEFAULT now(),
  operation_id UUID REFERENCES job_operations(id),
  machine_id TEXT REFERENCES machines(id),
  estimated_run_time INTEGER DEFAULT 0, -- minutes
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'development')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Program Tools table
CREATE TABLE IF NOT EXISTS program_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES dnc_programs(id) ON DELETE CASCADE,
  tool_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  tool_type tool_type NOT NULL,
  diameter DECIMAL(8,4),
  length DECIMAL(8,4),
  material TEXT,
  coating TEXT,
  vendor TEXT,
  part_number TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'broken')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Program Parameters table
CREATE TABLE IF NOT EXISTS program_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES dnc_programs(id) ON DELETE CASCADE,
  parameter_name TEXT NOT NULL,
  parameter_value TEXT NOT NULL,
  description TEXT,
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Programming Tasks table
CREATE TABLE IF NOT EXISTS programming_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  part_number TEXT NOT NULL,
  operation TEXT NOT NULL,
  machine_id TEXT REFERENCES machines(id),
  programmer_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in-progress', 'review', 'approved', 'released')),
  priority priority_level DEFAULT 'medium',
  estimated_hours DECIMAL(6,2) DEFAULT 0,
  actual_hours DECIMAL(6,2) DEFAULT 0,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- QUALITY MANAGEMENT
-- =============================================

-- Quality Requirements table
CREATE TABLE IF NOT EXISTS quality_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES job_operations(id),
  feature TEXT NOT NULL,
  specification TEXT NOT NULL,
  tolerance TEXT NOT NULL,
  inspection_method TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('first-piece', 'in-process', 'final', 'statistical')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quality Checks table
CREATE TABLE IF NOT EXISTS quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES quality_requirements(id),
  operation_id UUID REFERENCES job_operations(id),
  inspector_id UUID REFERENCES users(id),
  inspector_name TEXT NOT NULL,
  result TEXT CHECK (result IN ('pass', 'fail', 'rework')),
  actual_value TEXT,
  notes TEXT,
  images TEXT[],
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Quality Insights table (AI-generated)
CREATE TABLE IF NOT EXISTS quality_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  frequency INTEGER DEFAULT 0,
  impact TEXT CHECK (impact IN ('low', 'medium', 'high')),
  root_cause TEXT,
  recommendations TEXT[],
  trend TEXT CHECK (trend IN ('increasing', 'decreasing', 'stable')),
  related_jobs UUID[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PERFORMANCE & GAMIFICATION
-- =============================================

-- Performance Metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  efficiency DECIMAL(5,2) DEFAULT 0,
  quality DECIMAL(5,2) DEFAULT 0,
  safety DECIMAL(5,2) DEFAULT 0,
  productivity DECIMAL(5,2) DEFAULT 0,
  teamwork DECIMAL(5,2) DEFAULT 0,
  innovation DECIMAL(5,2) DEFAULT 0,
  attendance DECIMAL(5,2) DEFAULT 0,
  skill_development DECIMAL(5,2) DEFAULT 0,
  total_score DECIMAL(5,2) DEFAULT 0,
  rank INTEGER,
  bonus_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, period, start_date, end_date)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  points INTEGER DEFAULT 0,
  bonus_amount DECIMAL(8,2) DEFAULT 0,
  icon TEXT,
  requirements JSONB,
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Team Challenges table
CREATE TABLE IF NOT EXISTS team_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT CHECK (challenge_type IN ('department', 'shift', 'machine', 'skill-level', 'cross-functional')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  participants UUID[],
  metrics TEXT[],
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Streaks table
CREATE TABLE IF NOT EXISTS performance_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  streak_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  bonus_per_day DECIMAL(6,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Innovation Submissions table
CREATE TABLE IF NOT EXISTS innovation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('process-improvement', 'cost-reduction', 'safety-enhancement', 'quality-improvement', 'efficiency-boost')),
  submitted_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under-review', 'approved', 'implemented', 'rejected')),
  reviewers UUID[],
  estimated_savings DECIMAL(12,2) DEFAULT 0,
  actual_savings DECIMAL(12,2),
  implementation_date DATE,
  bonus_awarded DECIMAL(8,2) DEFAULT 0,
  recognition_level TEXT CHECK (recognition_level IN ('department', 'company', 'industry')),
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bonus Structures table
CREATE TABLE IF NOT EXISTS bonus_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bonus_type TEXT CHECK (bonus_type IN ('performance', 'achievement', 'streak', 'team', 'skill', 'innovation')),
  base_amount DECIMAL(8,2) DEFAULT 0,
  multipliers JSONB,
  eligibility JSONB,
  payout_schedule TEXT CHECK (payout_schedule IN ('immediate', 'weekly', 'monthly', 'quarterly')),
  max_amount DECIMAL(8,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- OPERATIONS & PASSDOWN
-- =============================================

-- Passdown Notes table
CREATE TABLE IF NOT EXISTS passdown_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order TEXT NOT NULL,
  shift shift_type NOT NULL,
  date DATE NOT NULL,
  operator_id UUID REFERENCES users(id),
  operator_name TEXT NOT NULL,
  machine_id TEXT REFERENCES machines(id),
  labor_type labor_type NOT NULL,
  machine_condition machine_condition NOT NULL,
  hours_worked DECIMAL(4,2) NOT NULL CHECK (hours_worked >= 0 AND hours_worked <= 24),
  parts_completed INTEGER DEFAULT 0,
  quality_issues TEXT,
  machine_issues TEXT,
  next_shift_notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5S Checklists table
CREATE TABLE IF NOT EXISTS five_s_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passdown_note_id UUID REFERENCES passdown_notes(id) ON DELETE CASCADE,
  coolant_level BOOLEAN DEFAULT false,
  coolant_condition TEXT CHECK (coolant_condition IN ('good', 'needs-change', 'low')),
  chip_bin_emptied BOOLEAN DEFAULT false,
  chip_bin_condition TEXT CHECK (chip_bin_condition IN ('empty', 'half-full', 'full')),
  desk_cleaned BOOLEAN DEFAULT false,
  tooling_returned BOOLEAN DEFAULT false,
  tooling_condition TEXT CHECK (tooling_condition IN ('good', 'worn', 'damaged')),
  work_area_organized BOOLEAN DEFAULT false,
  safety_checked BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- OPTIMIZATION & AI
-- =============================================

-- Part Similarities table (AI-generated)
CREATE TABLE IF NOT EXISTS part_similarities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL,
  part_name TEXT NOT NULL,
  material TEXT,
  dimensions JSONB,
  machine_type TEXT,
  fixture_type TEXT,
  setup_time INTEGER DEFAULT 0,
  cycle_time INTEGER DEFAULT 0,
  tooling TEXT[],
  operations TEXT[],
  similarity_score DECIMAL(3,2) DEFAULT 0,
  group_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Setup Optimizations table (AI-generated)
CREATE TABLE IF NOT EXISTS setup_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  current_setup_time INTEGER NOT NULL,
  optimized_setup_time INTEGER NOT NULL,
  time_savings INTEGER NOT NULL,
  suggestions JSONB,
  confidence DECIMAL(3,2) DEFAULT 0,
  implementation_difficulty TEXT CHECK (implementation_difficulty IN ('easy', 'medium', 'hard')),
  estimated_roi DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'implemented', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Production Trends table (AI-generated)
CREATE TABLE IF NOT EXISTS production_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL,
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly')),
  data JSONB,
  trend TEXT CHECK (trend IN ('improving', 'declining', 'stable')),
  change_percent DECIMAL(5,2) DEFAULT 0,
  insights TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Voice Notes table
CREATE TABLE IF NOT EXISTS voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  audio_url TEXT NOT NULL,
  transcription TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0,
  duration INTEGER DEFAULT 0, -- seconds
  note_type TEXT CHECK (note_type IN ('job-update', 'quality-issue', 'machine-problem', 'general')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media Uploads table
CREATE TABLE IF NOT EXISTS media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  media_type TEXT CHECK (media_type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INTEGRATION & COMPLIANCE
-- =============================================

-- Connection Configs table
CREATE TABLE IF NOT EXISTS connection_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  connection_type connection_type NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
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

-- Compliance Checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  result TEXT CHECK (result IN ('allowed', 'denied', 'restricted')),
  rules TEXT[],
  ip_address INET,
  location TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Export Control Flags table
CREATE TABLE IF NOT EXISTS export_control_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) UNIQUE,
  classification TEXT CHECK (classification IN ('itar', 'ear', 'dfars', 'uncontrolled')),
  category TEXT,
  restrictions TEXT[],
  authorized_personnel UUID[],
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INVENTORY & MATERIALS
-- =============================================

-- Material Inventory table
CREATE TABLE IF NOT EXISTS material_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  specification TEXT,
  current_stock DECIMAL(12,3) DEFAULT 0,
  unit TEXT NOT NULL,
  location TEXT,
  bin TEXT,
  reorder_point DECIMAL(12,3) DEFAULT 0,
  max_stock DECIMAL(12,3) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  supplier TEXT,
  last_received DATE,
  expiration_date DATE,
  certifications TEXT[],
  heat_number TEXT,
  lot_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  supplier TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'acknowledged', 'partial', 'complete', 'cancelled')),
  order_date DATE DEFAULT CURRENT_DATE,
  requested_date DATE,
  promised_date DATE,
  total_value DECIMAL(12,2) DEFAULT 0,
  buyer_id UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Purchase Order Items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  requested_date DATE,
  promised_date DATE,
  received_quantity DECIMAL(12,3) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'complete', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping Receiving table
CREATE TABLE IF NOT EXISTS shipping_receiving (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT CHECK (transaction_type IN ('receiving', 'shipping')),
  document_number TEXT UNIQUE NOT NULL,
  supplier TEXT,
  customer TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'complete', 'exception')),
  scheduled_date DATE,
  actual_date DATE,
  carrier TEXT,
  tracking_number TEXT,
  dock TEXT,
  handler_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping Items table
CREATE TABLE IF NOT EXISTS shipping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_id UUID REFERENCES shipping_receiving(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  unit TEXT NOT NULL,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('good', 'damaged', 'discrepancy')),
  location TEXT,
  serial_numbers TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TOOL MANAGEMENT
-- =============================================

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  tool_type tool_type NOT NULL,
  diameter DECIMAL(8,4),
  length DECIMAL(8,4),
  material TEXT,
  coating TEXT,
  vendor TEXT,
  part_number TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'broken')),
  cost DECIMAL(8,2),
  purchase_date DATE,
  last_inspection DATE,
  next_inspection DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tool Data Integrity table (TDIT)
CREATE TABLE IF NOT EXISTS tool_data_integrity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id),
  digital_data JSONB,
  physical_verification JSONB,
  compliance_status TEXT CHECK (compliance_status IN ('verified', 'discrepancy', 'pending')),
  last_verification TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  discrepancies TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Digital Twin Compliance table
CREATE TABLE IF NOT EXISTS digital_twin_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL,
  digital_twin_version TEXT NOT NULL,
  physical_part_version TEXT NOT NULL,
  compliance_status TEXT CHECK (compliance_status IN ('compliant', 'non-compliant', 'under-review')),
  last_validation TIMESTAMPTZ,
  deviations JSONB,
  approved_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dnc_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE programming_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE passdown_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE five_s_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_similarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_control_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_receiving ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_data_integrity ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_twin_compliance ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Managers can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('manager', 'admin', 'supervisor')
    )
  );

-- Jobs policies
CREATE POLICY "Users can read jobs" ON jobs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators can update assigned jobs" ON jobs
  FOR UPDATE TO authenticated
  USING (
    operator_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('lead', 'supervisor', 'manager', 'admin')
    )
  );

-- Job Operations policies
CREATE POLICY "Users can read job operations" ON job_operations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators can update operations" ON job_operations
  FOR UPDATE TO authenticated
  USING (
    operator_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('lead', 'supervisor', 'manager', 'admin')
    )
  );

-- Performance metrics policies
CREATE POLICY "Users can read own performance" ON performance_metrics
  FOR SELECT TO authenticated
  USING (
    user_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('supervisor', 'manager', 'admin')
    )
  );

-- Passdown notes policies
CREATE POLICY "Users can read passdown notes" ON passdown_notes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators can create passdown notes" ON passdown_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    operator_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('operator', 'lead', 'supervisor', 'manager', 'admin')
    )
  );

-- Quality checks policies
CREATE POLICY "Users can read quality checks" ON quality_checks
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Quality inspectors can create checks" ON quality_checks
  FOR INSERT TO authenticated
  WITH CHECK (
    inspector_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('operator', 'lead', 'supervisor', 'manager', 'admin')
    )
  );

-- Innovation submissions policies
CREATE POLICY "Users can read innovations" ON innovation_submissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create innovations" ON innovation_submissions
  FOR INSERT TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

-- Material inventory policies (restricted access)
CREATE POLICY "Material staff can access inventory" ON material_inventory
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND (department IN ('material-stores', 'purchasing') OR role IN ('manager', 'admin'))
    )
  );

-- Purchase orders policies (restricted access)
CREATE POLICY "Purchasing staff can access POs" ON purchase_orders
  FOR ALL TO authenticated
  USING (
    buyer_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND (department = 'purchasing' OR role IN ('manager', 'admin'))
    )
  );

-- Tool data integrity policies (TDIT access)
CREATE POLICY "TDIT can access tool data" ON tool_data_integrity
  FOR ALL TO authenticated
  USING (
    verified_by::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND (department = 'tdit' OR role IN ('manager', 'admin'))
    )
  );

-- Digital twin compliance policies
CREATE POLICY "Digital twin team can access compliance" ON digital_twin_compliance
  FOR ALL TO authenticated
  USING (
    approved_by::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND (department = 'digital-twin-compliance' OR role IN ('manager', 'admin'))
    )
  );

-- Export control flags policies (restricted access)
CREATE POLICY "Authorized personnel can access export control" ON export_control_flags
  FOR SELECT TO authenticated
  USING (
    auth.uid()::text = ANY(authorized_personnel::text[]) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('manager', 'admin')
    )
  );

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Job indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority);
CREATE INDEX IF NOT EXISTS idx_jobs_due_date ON jobs(due_date);
CREATE INDEX IF NOT EXISTS idx_jobs_operator ON jobs(operator_id);
CREATE INDEX IF NOT EXISTS idx_jobs_machine ON jobs(machine_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer);
CREATE INDEX IF NOT EXISTS idx_jobs_part_number ON jobs(part_number);

-- Job operations indexes
CREATE INDEX IF NOT EXISTS idx_job_operations_job_id ON job_operations(job_id);
CREATE INDEX IF NOT EXISTS idx_job_operations_status ON job_operations(status);
CREATE INDEX IF NOT EXISTS idx_job_operations_operator ON job_operations(operator_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_period ON performance_metrics(user_id, period, start_date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_rank ON performance_metrics(rank);

-- Passdown indexes
CREATE INDEX IF NOT EXISTS idx_passdown_notes_date ON passdown_notes(date);
CREATE INDEX IF NOT EXISTS idx_passdown_notes_machine ON passdown_notes(machine_id);
CREATE INDEX IF NOT EXISTS idx_passdown_notes_shift ON passdown_notes(shift);

-- Quality indexes
CREATE INDEX IF NOT EXISTS idx_quality_checks_timestamp ON quality_checks(timestamp);
CREATE INDEX IF NOT EXISTS idx_quality_checks_result ON quality_checks(result);

-- Material inventory indexes
CREATE INDEX IF NOT EXISTS idx_material_inventory_code ON material_inventory(material_code);
CREATE INDEX IF NOT EXISTS idx_material_inventory_location ON material_inventory(location);

-- Tool indexes
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_location ON tools(location);

-- =============================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_operations_updated_at BEFORE UPDATE ON job_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dnc_programs_updated_at BEFORE UPDATE ON dnc_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON performance_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_passdown_notes_updated_at BEFORE UPDATE ON passdown_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create job history entries
CREATE OR REPLACE FUNCTION create_job_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history for actual changes
  IF TG_OP = 'UPDATE' AND OLD IS NOT DISTINCT FROM NEW THEN
    RETURN NEW;
  END IF;

  -- Insert history record for status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO job_history (job_id, user_id, user_name, action, field_name, old_value, new_value)
    VALUES (
      NEW.id,
      auth.uid(),
      COALESCE((SELECT name FROM users WHERE id::text = auth.uid()::text), 'System'),
      'status-changed',
      'status',
      OLD.status::text,
      NEW.status::text
    );
  END IF;

  -- Insert history record for quantity changes
  IF TG_OP = 'UPDATE' AND OLD.completed_quantity IS DISTINCT FROM NEW.completed_quantity THEN
    INSERT INTO job_history (job_id, user_id, user_name, action, field_name, old_value, new_value)
    VALUES (
      NEW.id,
      auth.uid(),
      COALESCE((SELECT name FROM users WHERE id::text = auth.uid()::text), 'System'),
      'quantity-updated',
      'completed_quantity',
      OLD.completed_quantity::text,
      NEW.completed_quantity::text
    );
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for job history
CREATE TRIGGER create_job_history_trigger
  AFTER UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION create_job_history();

-- Function to update job progress when operations are completed
CREATE OR REPLACE FUNCTION update_job_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update job completed quantity based on minimum operation completion
  UPDATE jobs 
  SET completed_quantity = (
    SELECT COALESCE(MIN(completed_quantity), 0)
    FROM job_operations 
    WHERE job_id = NEW.job_id
  )
  WHERE id = NEW.job_id;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for job progress updates
CREATE TRIGGER update_job_progress_trigger
  AFTER UPDATE ON job_operations
  FOR EACH ROW
  EXECUTE FUNCTION update_job_progress();