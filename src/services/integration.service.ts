import { supabase, handleApiError } from './api.service';
import type { 
  ConnectionConfig, 
  ImportJob, 
  ComplianceCheck, 
  ExportControlFlag,
  ConnectionType,
  ImportType,
  ImportMapping
} from '../types/integration';

export const integrationService = {
  /**
   * Fetch all connections
   */
  async fetchConnections(): Promise<ConnectionConfig[]> {
    try {
      const { data, error } = await supabase
        .from('connection_configs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(conn => ({
        id: conn.id,
        name: conn.name,
        type: conn.connection_type,
        status: conn.status,
        config: conn.config || {},
        complianceLevel: conn.compliance_level,
        lastSync: conn.last_sync,
        errorCount: conn.error_count || 0,
        mapping: [],
        createdAt: conn.created_at,
        updatedAt: conn.updated_at
      }));
    } catch (err) {
      console.error('Error fetching connections:', err);
      return [];
    }
  },

  /**
   * Fetch import jobs
   */
  async fetchImportJobs(): Promise<ImportJob[]> {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return (data || []).map(job => ({
        id: job.id,
        connectionId: job.connection_id,
        type: job.import_type,
        status: job.status,
        mapping: job.mapping || [],
        recordsProcessed: job.records_processed || 0,
        recordsSuccess: job.records_success || 0,
        recordsError: job.records_error || 0,
        errors: job.errors || [],
        startedAt: job.started_at,
        completedAt: job.completed_at
      }));
    } catch (err) {
      console.error('Error fetching import jobs:', err);
      return [];
    }
  },

  /**
   * Create a new connection
   */
  async createConnection(connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConnectionConfig> {
    try {
      const { data, error } = await supabase
        .from('connection_configs')
        .insert({
          name: connection.name,
          connection_type: connection.type,
          status: connection.status,
          config: connection.config,
          compliance_level: connection.complianceLevel,
          error_count: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (!data) throw new Error('Failed to create connection');
      
      // Insert mapping if provided
      if (connection.mapping && connection.mapping.length > 0) {
        const { error: mappingError } = await supabase
          .from('import_mappings')
          .insert(connection.mapping.map(mapping => ({
            connection_id: data.id,
            source_field: mapping.sourceField,
            target_field: mapping.targetField,
            required: mapping.required,
            compliance_flag: mapping.complianceFlag
          })));
        
        if (mappingError) {
          console.error('Error creating mapping:', mappingError);
        }
      }
      
      return {
        id: data.id,
        name: data.name,
        type: data.connection_type,
        status: data.status,
        config: data.config,
        complianceLevel: data.compliance_level,
        lastSync: data.last_sync,
        errorCount: data.error_count || 0,
        mapping: connection.mapping || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error creating connection:', err);
      throw err;
    }
  },

  /**
   * Update an existing connection
   */
  async updateConnection(connection: ConnectionConfig): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('connection_configs')
        .update({
          name: connection.name,
          connection_type: connection.type,
          status: connection.status,
          config: connection.config,
          compliance_level: connection.complianceLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', connection.id);
      
      if (error) throw error;
      
      // Update mapping if provided
      if (connection.mapping && connection.mapping.length > 0) {
        // First delete existing mappings
        const { error: deleteError } = await supabase
          .from('import_mappings')
          .delete()
          .eq('connection_id', connection.id);
        
        if (deleteError) {
          console.error('Error deleting existing mappings:', deleteError);
        }
        
        // Then insert new mappings
        const { error: mappingError } = await supabase
          .from('import_mappings')
          .insert(connection.mapping.map(mapping => ({
            connection_id: connection.id,
            source_field: mapping.sourceField,
            target_field: mapping.targetField,
            required: mapping.required,
            compliance_flag: mapping.complianceFlag
          })));
        
        if (mappingError) {
          console.error('Error updating mapping:', mappingError);
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating connection:', err);
      throw err;
    }
  },

  /**
   * Delete a connection
   */
  async deleteConnection(connectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('connection_configs')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error deleting connection:', err);
      throw err;
    }
  },

  /**
   * Test a connection
   */
  async testConnection(connectionId: string): Promise<boolean> {
    try {
      // In a real app, this would call an API endpoint to test the connection
      // For now, we'll simulate a successful test
      const { error } = await supabase
        .from('connection_configs')
        .update({
          status: 'active',
          last_sync: new Date().toISOString()
        })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error testing connection:', err);
      throw err;
    }
  },

  /**
   * Run an import job
   */
  async runImport(connectionId: string, importType: ImportType): Promise<ImportJob> {
    try {
      // First, create the import job
      const { data, error } = await supabase
        .from('import_jobs')
        .insert({
          connection_id: connectionId,
          import_type: importType,
          status: 'pending',
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (!data) throw new Error('Failed to create import job');
      
      // In a real app, this would trigger a background process
      // For now, we'll simulate a successful import after a delay
      setTimeout(async () => {
        try {
          // Update the import job with success data
          await supabase
            .from('import_jobs')
            .update({
              status: 'completed',
              records_processed: 100,
              records_success: 98,
              records_error: 2,
              errors: [
                {
                  row: 45,
                  field: 'export_control',
                  value: null,
                  error: 'Export control flag is required for all jobs',
                  severity: 'critical'
                },
                {
                  row: 72,
                  field: 'due_date',
                  value: '2023-13-45',
                  error: 'Invalid date format',
                  severity: 'error'
                }
              ],
              completed_at: new Date().toISOString()
            })
            .eq('id', data.id);
          
          // Update the connection's last sync time
          await supabase
            .from('connection_configs')
            .update({
              last_sync: new Date().toISOString()
            })
            .eq('id', connectionId);
        } catch (updateErr) {
          console.error('Error updating import job:', updateErr);
        }
      }, 3000);
      
      return {
        id: data.id,
        connectionId: data.connection_id,
        type: data.import_type,
        status: data.status,
        mapping: [],
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsError: 0,
        errors: [],
        startedAt: data.started_at,
        completedAt: null
      };
    } catch (err) {
      console.error('Error running import:', err);
      throw err;
    }
  },

  /**
   * Check compliance for a job
   */
  async checkCompliance(jobId: string, userId: string, action: string): Promise<ComplianceCheck> {
    try {
      const { data, error } = await supabase
        .from('compliance_checks')
        .insert({
          job_id: jobId,
          user_id: userId,
          action,
          result: 'allowed', // Default to allowed
          rules: []
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        jobId: data.job_id,
        userId: data.user_id,
        action: data.action,
        result: data.result,
        rules: data.rules || [],
        timestamp: data.timestamp
      };
    } catch (err) {
      console.error('Error checking compliance:', err);
      throw err;
    }
  },

  /**
   * Fetch export control flags
   */
  async fetchExportFlags(): Promise<ExportControlFlag[]> {
    try {
      const { data, error } = await supabase
        .from('export_control_flags')
        .select('*');
      
      if (error) throw error;
      
      return (data || []).map(flag => ({
        jobId: flag.job_id,
        classification: flag.classification,
        category: flag.category,
        restrictions: flag.restrictions || [],
        authorizedPersonnel: flag.authorized_personnel || [],
        expirationDate: flag.expiration_date,
        notes: flag.notes
      }));
    } catch (err) {
      console.error('Error fetching export flags:', err);
      return [];
    }
  }
};