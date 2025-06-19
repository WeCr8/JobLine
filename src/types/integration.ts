export interface ConnectionConfig {
  id: string;
  name: string;
  type: ConnectionType;
  status: 'active' | 'inactive' | 'error' | 'testing';
  config: ConnectionSettings;
  complianceLevel: ComplianceLevel;
  lastSync?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ConnectionType = 
  | 'google-sheets'
  | 'csv-upload'
  | 'rest-api'
  | 'sql-odbc'
  | 'sap-bapi'
  | 'webhook'
  | 'sftp';

export type ComplianceLevel = 'basic' | 'itar' | 'ear' | 'cmmc-2' | 'cmmc-3';

export interface ConnectionSettings {
  // Google Sheets
  spreadsheetId?: string;
  sheetName?: string;
  range?: string;
  
  // REST API
  baseUrl?: string;
  apiKey?: string;
  authType?: 'bearer' | 'basic' | 'oauth';
  headers?: Record<string, string>;
  
  // SQL/ODBC
  connectionString?: string;
  database?: string;
  table?: string;
  query?: string;
  
  // SAP BAPI
  sapHost?: string;
  sapClient?: string;
  sapUser?: string;
  sapSystem?: string;
  
  // SFTP
  host?: string;
  port?: number;
  username?: string;
  privateKey?: string;
  remotePath?: string;
  
  // Webhook
  endpoint?: string;
  secret?: string;
  
  // Common settings
  pollInterval?: number;
  batchSize?: number;
  retryAttempts?: number;
  timeout?: number;
}

export interface ImportMapping {
  sourceField: string;
  targetField: string;
  transform?: 'uppercase' | 'lowercase' | 'trim' | 'date' | 'number';
  required: boolean;
  complianceFlag?: boolean;
}

export interface ImportJob {
  id: string;
  connectionId: string;
  type: ImportType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  mapping: ImportMapping[];
  recordsProcessed: number;
  recordsSuccess: number;
  recordsError: number;
  errors: ImportError[];
  startedAt?: string;
  completedAt?: string;
}

export type ImportType = 
  | 'job-data'
  | 'operator-workcenter'
  | 'routing-operations'
  | 'cost-tracking'
  | 'customer-association';

export interface ImportError {
  row: number;
  field: string;
  value: any;
  error: string;
  severity: 'warning' | 'error' | 'critical';
}

export interface ComplianceRule {
  id: string;
  name: string;
  type: ComplianceType;
  condition: string;
  action: ComplianceAction;
  message: string;
  enabled: boolean;
}

export type ComplianceType = 'itar' | 'ear' | 'dfars' | 'cmmc' | 'custom';
export type ComplianceAction = 'block' | 'redact' | 'warn' | 'log';

export interface ComplianceCheck {
  jobId: string;
  userId: string;
  action: string;
  result: 'allowed' | 'denied' | 'restricted';
  rules: string[];
  timestamp: string;
  ipAddress?: string;
  location?: string;
}

export interface ExportControlFlag {
  jobId: string;
  classification: 'itar' | 'ear' | 'dfars' | 'uncontrolled';
  category?: string;
  restrictions: string[];
  authorizedPersonnel: string[];
  expirationDate?: string;
  notes?: string;
}