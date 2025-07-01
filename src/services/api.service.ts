import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generic API error handler
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  if (error.code === 'PGRST301') {
    throw new ApiError('You do not have permission to access this resource', 403);
  }
  
  if (error.code === 'PGRST204') {
    throw new ApiError('Resource not found', 404);
  }
  
  throw new ApiError(error.message || 'An unexpected error occurred', 500);
};

// Audit logging utility
export async function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  before,
  after,
  reason,
  ip,
  userAgent
}: {
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId?: string,
  before?: any,
  after?: any,
  reason?: string,
  ip?: string,
  userAgent?: string
}) {
  const { error } = await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    before: before ? JSON.stringify(before) : null,
    after: after ? JSON.stringify(after) : null,
    reason,
    ip,
    user_agent: userAgent
  });
  if (error) {
    console.error('[AuditLog] Failed to insert audit log:', error);
  }
}

// Consistency flagging utility
export async function logConsistencyFlag({
  type,
  severity,
  resourceType,
  resourceId,
  context,
  detectedBy,
  notes
}: {
  type: string,
  severity: string,
  resourceType: string,
  resourceId?: string,
  context?: any,
  detectedBy?: string,
  notes?: string
}) {
  const { error } = await supabase.from('consistency_flags').insert({
    type,
    severity,
    resource_type: resourceType,
    resource_id: resourceId,
    context: context ? JSON.stringify(context) : null,
    detected_by: detectedBy,
    notes
  });
  if (error) {
    console.error('[ConsistencyFlag] Failed to insert flag:', error);
  }
}