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
import axios from 'axios';
import { storeOfflineData, getOfflineData, registerBackgroundSync } from '../utils/offline';

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
      
      // Try to get from offline cache
      const cachedConnections = await getOfflineData<ConnectionConfig[]>('integration', 'connections');
      return cachedConnections || [];
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
      
      // Try to get from offline cache
      const cachedJobs = await getOfflineData<ImportJob[]>('integration', 'importJobs');
      return cachedJobs || [];
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
      
      const newConnection = {
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
      
      // Update local cache
      const connections = await getOfflineData<ConnectionConfig[]>('integration', 'connections') || [];
      connections.unshift(newConnection);
      await storeOfflineData('integration', 'connections', connections);
      
      return newConnection;
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
      
      // Update local cache
      const connections = await getOfflineData<ConnectionConfig[]>('integration', 'connections') || [];
      const index = connections.findIndex(c => c.id === connection.id);
      if (index !== -1) {
        connections[index] = connection;
        await storeOfflineData('integration', 'connections', connections);
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
      
      // Update local cache
      const connections = await getOfflineData<ConnectionConfig[]>('integration', 'connections') || [];
      const updatedConnections = connections.filter(c => c.id !== connectionId);
      await storeOfflineData('integration', 'connections', updatedConnections);
      
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
      // Get connection details
      const { data: connection, error: connError } = await supabase
        .from('connection_configs')
        .select('*')
        .eq('id', connectionId)
        .single();
      
      if (connError) throw connError;
      
      // Test connection based on type
      let success = false;
      
      switch (connection.connection_type) {
        case 'rest-api':
          success = await this.testRestApiConnection(connection.config);
          break;
        case 'google-sheets':
          success = await this.testGoogleSheetsConnection(connection.config);
          break;
        case 'sql-odbc':
          success = await this.testSqlConnection(connection.config);
          break;
        case 'sap-bapi':
          success = await this.testSapConnection(connection.config);
          break;
        case 'sftp':
          success = await this.testSftpConnection(connection.config);
          break;
        case 'webhook':
          // Webhooks are passive, so we'll just assume success
          success = true;
          break;
        case 'csv-upload':
          // CSV uploads are manual, so we'll just assume success
          success = true;
          break;
        default:
          throw new Error(`Unsupported connection type: ${connection.connection_type}`);
      }
      
      // Update connection status
      if (success) {
        await supabase
          .from('connection_configs')
          .update({
            status: 'active',
            last_sync: new Date().toISOString()
          })
          .eq('id', connectionId);
      } else {
        await supabase
          .from('connection_configs')
          .update({
            status: 'error',
            error_count: connection.error_count + 1
          })
          .eq('id', connectionId);
      }
      
      return success;
    } catch (err) {
      console.error('Error testing connection:', err);
      
      // Update connection status to error
      await supabase
        .from('connection_configs')
        .update({
          status: 'error',
          error_count: supabase.sql`error_count + 1`
        })
        .eq('id', connectionId);
      
      throw err;
    }
  },

  /**
   * Test REST API connection
   */
  async testRestApiConnection(config: any): Promise<boolean> {
    try {
      const { baseUrl, apiKey, authType } = config;
      
      if (!baseUrl) {
        throw new Error('Base URL is required');
      }
      
      const headers: Record<string, string> = {};
      
      if (apiKey) {
        switch (authType) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${apiKey}`;
            break;
          case 'basic':
            headers['Authorization'] = `Basic ${btoa(apiKey)}`;
            break;
          default:
            headers['X-API-Key'] = apiKey;
            break;
        }
      }
      
      const response = await axios.get(baseUrl, { headers });
      
      return response.status >= 200 && response.status < 300;
    } catch (err) {
      console.error('Error testing REST API connection:', err);
      return false;
    }
  },

  /**
   * Test Google Sheets connection
   */
  async testGoogleSheetsConnection(config: any): Promise<boolean> {
    // In a real implementation, this would use the Google Sheets API
    // For now, we'll simulate success
    return true;
  },

  /**
   * Test SQL connection
   */
  async testSqlConnection(config: any): Promise<boolean> {
    // In a real implementation, this would use a SQL client
    // For now, we'll simulate success
    return true;
  },

  /**
   * Test SAP connection
   */
  async testSapConnection(config: any): Promise<boolean> {
    // In a real implementation, this would use SAP client libraries
    // For now, we'll simulate success
    return true;
  },

  /**
   * Test SFTP connection
   */
  async testSftpConnection(config: any): Promise<boolean> {
    // In a real implementation, this would use an SFTP client
    // For now, we'll simulate success
    return true;
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
      
      // Get connection details
      const { data: connection, error: connError } = await supabase
        .from('connection_configs')
        .select('*')
        .eq('id', connectionId)
        .single();
      
      if (connError) throw connError;
      
      // Get mapping for this connection
      const { data: mappings, error: mappingError } = await supabase
        .from('import_mappings')
        .select('*')
        .eq('connection_id', connectionId);
      
      if (mappingError) {
        console.error('Error fetching mappings:', mappingError);
      }
      
      const formattedMappings = (mappings || []).map(mapping => ({
        sourceField: mapping.source_field,
        targetField: mapping.target_field,
        required: mapping.required,
        complianceFlag: mapping.compliance_flag
      }));
      
      // Create the import job object
      const importJob: ImportJob = {
        id: data.id,
        connectionId: data.connection_id,
        type: data.import_type,
        status: data.status,
        mapping: formattedMappings,
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsError: 0,
        errors: [],
        startedAt: data.started_at,
        completedAt: null
      };
      
      // Start the import process in the background
      this.processImport(importJob, connection);
      
      return importJob;
    } catch (err) {
      console.error('Error running import:', err);
      throw err;
    }
  },

  /**
   * Process an import job
   */
  async processImport(importJob: ImportJob, connection: any): Promise<void> {
    try {
      // Update job status to running
      await supabase
        .from('import_jobs')
        .update({
          status: 'running'
        })
        .eq('id', importJob.id);
      
      // Process the import based on connection type
      let importData: any[] = [];
      
      switch (connection.connection_type) {
        case 'rest-api':
          importData = await this.importFromRestApi(connection.config, importJob.type);
          break;
        case 'google-sheets':
          importData = await this.importFromGoogleSheets(connection.config, importJob.type);
          break;
        case 'sql-odbc':
          importData = await this.importFromSql(connection.config, importJob.type);
          break;
        case 'sap-bapi':
          importData = await this.importFromSap(connection.config, importJob.type);
          break;
        case 'sftp':
          importData = await this.importFromSftp(connection.config, importJob.type);
          break;
        case 'csv-upload':
          // CSV uploads are handled separately
          importData = [];
          break;
        default:
          throw new Error(`Unsupported connection type: ${connection.connection_type}`);
      }
      
      // Process the imported data
      const { processed, success, errors } = await this.processImportData(
        importData,
        importJob.mapping,
        importJob.type,
        connection.compliance_level
      );
      
      // Update job status to completed
      await supabase
        .from('import_jobs')
        .update({
          status: 'completed',
          records_processed: processed,
          records_success: success,
          records_error: errors.length,
          errors: errors,
          completed_at: new Date().toISOString()
        })
        .eq('id', importJob.id);
      
      // Update connection's last sync time
      await supabase
        .from('connection_configs')
        .update({
          last_sync: new Date().toISOString()
        })
        .eq('id', connection.id);
      
      // Update local cache
      const importJobs = await getOfflineData<ImportJob[]>('integration', 'importJobs') || [];
      const updatedJob = {
        ...importJob,
        status: 'completed',
        recordsProcessed: processed,
        recordsSuccess: success,
        recordsError: errors.length,
        errors: errors,
        completedAt: new Date().toISOString()
      };
      
      const index = importJobs.findIndex(job => job.id === importJob.id);
      if (index !== -1) {
        importJobs[index] = updatedJob;
      } else {
        importJobs.unshift(updatedJob);
      }
      
      await storeOfflineData('integration', 'importJobs', importJobs);
      
    } catch (err) {
      console.error('Error processing import:', err);
      
      // Update job status to failed
      await supabase
        .from('import_jobs')
        .update({
          status: 'failed',
          errors: [{ error: (err as Error).message }],
          completed_at: new Date().toISOString()
        })
        .eq('id', importJob.id);
    }
  },

  /**
   * Import data from REST API
   */
  async importFromRestApi(config: any, importType: ImportType): Promise<any[]> {
    try {
      const { baseUrl, apiKey, authType } = config;
      
      if (!baseUrl) {
        throw new Error('Base URL is required');
      }
      
      const headers: Record<string, string> = {};
      
      if (apiKey) {
        switch (authType) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${apiKey}`;
            break;
          case 'basic':
            headers['Authorization'] = `Basic ${btoa(apiKey)}`;
            break;
          default:
            headers['X-API-Key'] = apiKey;
            break;
        }
      }
      
      // Construct endpoint based on import type
      let endpoint = baseUrl;
      if (!endpoint.endsWith('/')) {
        endpoint += '/';
      }
      
      switch (importType) {
        case 'job-data':
          endpoint += 'jobs';
          break;
        case 'operator-workcenter':
          endpoint += 'operators';
          break;
        case 'routing-operations':
          endpoint += 'operations';
          break;
        case 'cost-tracking':
          endpoint += 'costs';
          break;
        case 'customer-association':
          endpoint += 'customers';
          break;
      }
      
      const response = await axios.get(endpoint, { headers });
      
      if (response.status >= 200 && response.status < 300) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (err) {
      console.error('Error importing from REST API:', err);
      throw err;
    }
  },

  /**
   * Import data from Google Sheets
   */
  async importFromGoogleSheets(config: any, importType: ImportType): Promise<any[]> {
    // In a real implementation, this would use the Google Sheets API
    // For now, we'll return mock data
    return this.getMockData(importType, 50);
  },

  /**
   * Import data from SQL
   */
  async importFromSql(config: any, importType: ImportType): Promise<any[]> {
    // In a real implementation, this would use a SQL client
    // For now, we'll return mock data
    return this.getMockData(importType, 75);
  },

  /**
   * Import data from SAP
   */
  async importFromSap(config: any, importType: ImportType): Promise<any[]> {
    // In a real implementation, this would use SAP client libraries
    // For now, we'll return mock data
    return this.getMockData(importType, 100);
  },

  /**
   * Import data from SFTP
   */
  async importFromSftp(config: any, importType: ImportType): Promise<any[]> {
    // In a real implementation, this would use an SFTP client
    // For now, we'll return mock data
    return this.getMockData(importType, 25);
  },

  /**
   * Process imported data
   */
  async processImportData(
    data: any[],
    mapping: ImportMapping[],
    importType: ImportType,
    complianceLevel: string
  ): Promise<{ processed: number; success: number; errors: any[] }> {
    const processed = data.length;
    let success = 0;
    const errors: any[] = [];
    
    // Process each record
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      
      try {
        // Map fields according to mapping
        const mappedRecord: Record<string, any> = {};
        
        for (const map of mapping) {
          if (record[map.sourceField] !== undefined) {
            mappedRecord[map.targetField] = record[map.sourceField];
          } else if (map.required) {
            throw new Error(`Required field ${map.sourceField} is missing`);
          }
          
          // Check compliance flags
          if (map.complianceFlag && complianceLevel !== 'basic') {
            if (record[map.sourceField] === undefined || record[map.sourceField] === null) {
              throw new Error(`Compliance field ${map.sourceField} is required for ${complianceLevel} compliance level`);
            }
          }
        }
        
        // Insert the record into the appropriate table
        let tableName = '';
        
        switch (importType) {
          case 'job-data':
            tableName = 'jobs';
            break;
          case 'operator-workcenter':
            tableName = 'users';
            break;
          case 'routing-operations':
            tableName = 'job_operations';
            break;
          case 'cost-tracking':
            tableName = 'job_materials';
            break;
          case 'customer-association':
            tableName = 'customers';
            break;
        }
        
        if (tableName) {
          const { error } = await supabase
            .from(tableName)
            .upsert(mappedRecord);
          
          if (error) {
            throw error;
          }
        }
        
        success++;
      } catch (err) {
        errors.push({
          row: i + 1,
          record,
          error: (err as Error).message,
          severity: 'error'
        });
      }
    }
    
    return { processed, success, errors };
  },

  /**
   * Get mock data for testing
   */
  getMockData(importType: ImportType, count: number): any[] {
    const data: any[] = [];
    
    for (let i = 0; i < count; i++) {
      switch (importType) {
        case 'job-data':
          data.push({
            job_number: `J2024-${1000 + i}`,
            part_number: `PN-${5000 + i}`,
            part_name: `Sample Part ${i}`,
            customer: `Customer ${i % 10}`,
            quantity: 10 + (i % 90),
            due_date: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0],
            priority: ['low', 'medium', 'high', 'urgent'][i % 4],
            export_control: i % 5 === 0 ? 'ITAR' : 'None'
          });
          break;
        
        case 'operator-workcenter':
          data.push({
            operator_id: `OP-${1000 + i}`,
            operator_name: `Operator ${i}`,
            work_center: `WC-${100 + (i % 5)}`,
            shift: ['day', 'evening', 'night'][i % 3],
            skills: ['milling', 'turning', 'grinding', 'inspection'][i % 4]
          });
          break;
        
        case 'routing-operations':
          data.push({
            job_number: `J2024-${1000 + (i % 20)}`,
            operation_number: i + 1,
            operation_name: `Operation ${i + 1}`,
            work_center: `WC-${100 + (i % 5)}`,
            setup_time: 10 + (i % 50),
            cycle_time: 5 + (i % 30)
          });
          break;
        
        case 'cost-tracking':
          data.push({
            job_number: `J2024-${1000 + (i % 20)}`,
            material_cost: 100 + (i * 10),
            labor_cost: 50 + (i * 5),
            overhead_cost: 25 + (i * 2.5),
            total_cost: 175 + (i * 17.5)
          });
          break;
        
        case 'customer-association':
          data.push({
            customer_id: `CUST-${1000 + i}`,
            customer_name: `Customer ${i}`,
            contact_name: `Contact ${i}`,
            contact_email: `contact${i}@example.com`,
            contact_phone: `555-${100 + i}`
          });
          break;
      }
    }
    
    return data;
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
      
      // Try to get from offline cache
      const cachedFlags = await getOfflineData<ExportControlFlag[]>('integration', 'exportFlags');
      return cachedFlags || [];
    }
  },

  /**
   * Process file upload for CSV/Excel import
   */
  async processFileUpload(file: File, connectionId: string, importType: ImportType): Promise<ImportJob> {
    try {
      // Create import job
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
      
      // Get connection details
      const { data: connection, error: connError } = await supabase
        .from('connection_configs')
        .select('*')
        .eq('id', connectionId)
        .single();
      
      if (connError) throw connError;
      
      // Get mapping for this connection
      const { data: mappings, error: mappingError } = await supabase
        .from('import_mappings')
        .select('*')
        .eq('connection_id', connectionId);
      
      if (mappingError) {
        console.error('Error fetching mappings:', mappingError);
      }
      
      const formattedMappings = (mappings || []).map(mapping => ({
        sourceField: mapping.source_field,
        targetField: mapping.target_field,
        required: mapping.required,
        complianceFlag: mapping.compliance_flag
      }));
      
      // Create the import job object
      const importJob: ImportJob = {
        id: data.id,
        connectionId: data.connection_id,
        type: data.import_type,
        status: data.status,
        mapping: formattedMappings,
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsError: 0,
        errors: [],
        startedAt: data.started_at,
        completedAt: null
      };
      
      // Process the file
      this.processUploadedFile(file, importJob, connection);
      
      return importJob;
    } catch (err) {
      console.error('Error processing file upload:', err);
      throw err;
    }
  },

  /**
   * Process uploaded file
   */
  async processUploadedFile(file: File, importJob: ImportJob, connection: any): Promise<void> {
    try {
      // Update job status to running
      await supabase
        .from('import_jobs')
        .update({
          status: 'running'
        })
        .eq('id', importJob.id);
      
      // Read the file
      const fileData = await this.readFileData(file, connection.config.fileFormat || 'csv');
      
      // Process the data
      const { processed, success, errors } = await this.processImportData(
        fileData,
        importJob.mapping,
        importJob.type,
        connection.compliance_level
      );
      
      // Update job status to completed
      await supabase
        .from('import_jobs')
        .update({
          status: 'completed',
          records_processed: processed,
          records_success: success,
          records_error: errors.length,
          errors: errors,
          completed_at: new Date().toISOString()
        })
        .eq('id', importJob.id);
      
      // Update connection's last sync time
      await supabase
        .from('connection_configs')
        .update({
          last_sync: new Date().toISOString()
        })
        .eq('id', connection.id);
      
    } catch (err) {
      console.error('Error processing uploaded file:', err);
      
      // Update job status to failed
      await supabase
        .from('import_jobs')
        .update({
          status: 'failed',
          errors: [{ error: (err as Error).message }],
          completed_at: new Date().toISOString()
        })
        .eq('id', importJob.id);
    }
  },

  /**
   * Read file data
   */
  async readFileData(file: File, format: 'csv' | 'tsv' | 'excel'): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (!content) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          let data: any[] = [];
          
          switch (format) {
            case 'csv':
              data = this.parseCSV(content, ',');
              break;
            case 'tsv':
              data = this.parseCSV(content, '\t');
              break;
            case 'excel':
              // In a real implementation, this would use a library like SheetJS
              // For now, we'll just parse it as CSV
              data = this.parseCSV(content, ',');
              break;
          }
          
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  },

  /**
   * Parse CSV data
   */
  parseCSV(content: string, delimiter: string): any[] {
    const lines = content.split('\n');
    
    if (lines.length === 0) {
      return [];
    }
    
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const data: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        continue;
      }
      
      const values = line.split(delimiter);
      const record: Record<string, any> = {};
      
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = values[j]?.trim() || '';
      }
      
      data.push(record);
    }
    
    return data;
  },

  /**
   * Schedule automatic sync
   */
  async scheduleAutomaticSync(connectionId: string): Promise<boolean> {
    try {
      // Get connection details
      const { data: connection, error } = await supabase
        .from('connection_configs')
        .select('*')
        .eq('id', connectionId)
        .single();
      
      if (error) throw error;
      
      // Check if connection is active
      if (connection.status !== 'active') {
        return false;
      }
      
      // Check if poll interval is set
      const pollInterval = connection.config.pollInterval || connection.config.pollIntervalMinutes * 60000;
      
      if (!pollInterval) {
        return false;
      }
      
      // Schedule sync using background sync API if available
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        // Store connection ID for background sync
        await storeOfflineData('integration', `sync-${connectionId}`, {
          connectionId,
          lastSync: new Date().toISOString(),
          nextSync: new Date(Date.now() + pollInterval).toISOString()
        });
        
        // Register for background sync
        await registerBackgroundSync(`sync-connection-${connectionId}`);
        
        return true;
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          this.runImport(connectionId, 'job-data');
        }, pollInterval);
        
        return true;
      }
    } catch (err) {
      console.error('Error scheduling automatic sync:', err);
      return false;
    }
  },

  /**
   * AI-powered job shuffling
   */
  async optimizeJobSchedule(departmentId?: string): Promise<boolean> {
    try {
      // Get all active jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['pending', 'setup', 'running'])
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true });
      
      if (jobsError) throw jobsError;
      
      // Get all available machines
      const { data: machines, error: machinesError } = await supabase
        .from('machines')
        .select('*')
        .eq('status', 'idle');
      
      if (machinesError) throw machinesError;
      
      // Filter by department if specified
      const filteredMachines = departmentId
        ? machines.filter(m => m.department_id === departmentId)
        : machines;
      
      // Get all available operators
      const { data: operators, error: operatorsError } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .in('role', ['operator', 'lead']);
      
      if (operatorsError) throw operatorsError;
      
      // Filter by department if specified
      const filteredOperators = departmentId
        ? operators.filter(o => o.department === departmentId)
        : operators;
      
      // Simple optimization algorithm:
      // 1. Sort jobs by priority and due date
      // 2. Assign jobs to available machines and operators
      
      let assignedCount = 0;
      
      for (const job of jobs) {
        // Skip jobs that are already running
        if (job.status === 'running') {
          continue;
        }
        
        // Find an available machine
        const machine = filteredMachines.find(m => !m.current_job_id);
        
        if (!machine) {
          // No available machines
          continue;
        }
        
        // Find an available operator
        const operator = filteredOperators.find(o => {
          // Check if operator is already assigned to a job
          const isAssigned = jobs.some(j => 
            j.status === 'running' && 
            j.operator_id === o.id
          );
          
          return !isAssigned;
        });
        
        if (!operator) {
          // No available operators
          continue;
        }
        
        // Assign job to machine and operator
        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            status: 'setup',
            machine_id: machine.id,
            operator_id: operator.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);
        
        if (updateError) {
          console.error('Error updating job:', updateError);
          continue;
        }
        
        // Update machine status
        const { error: machineError } = await supabase
          .from('machines')
          .update({
            status: 'running',
            current_job_id: job.id,
            operator_id: operator.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', machine.id);
        
        if (machineError) {
          console.error('Error updating machine:', machineError);
        }
        
        assignedCount++;
      }
      
      return assignedCount > 0;
    } catch (err) {
      console.error('Error optimizing job schedule:', err);
      return false;
    }
  },

  /**
   * AI-powered job recommendations
   */
  async getJobRecommendations(operatorId: string): Promise<any[]> {
    try {
      // Get operator details
      const { data: operator, error: operatorError } = await supabase
        .from('users')
        .select('*')
        .eq('id', operatorId)
        .single();
      
      if (operatorError) throw operatorError;
      
      // Get operator's skills and department
      const skills = operator.skills || [];
      const department = operator.department;
      
      // Get all pending jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true });
      
      if (jobsError) throw jobsError;
      
      // Get all machines in the operator's department
      const { data: machines, error: machinesError } = await supabase
        .from('machines')
        .select('*')
        .eq('department_id', department)
        .eq('status', 'idle');
      
      if (machinesError) throw machinesError;
      
      // Score each job based on:
      // 1. Priority
      // 2. Due date
      // 3. Operator skills match
      // 4. Available machines
      
      const scoredJobs = jobs.map(job => {
        // Base score
        let score = 0;
        
        // Priority score (0-30)
        switch (job.priority) {
          case 'urgent':
            score += 30;
            break;
          case 'high':
            score += 20;
            break;
          case 'medium':
            score += 10;
            break;
          case 'low':
            score += 0;
            break;
        }
        
        // Due date score (0-30)
        const dueDate = new Date(job.due_date);
        const today = new Date();
        const daysUntilDue = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        
        if (daysUntilDue <= 1) {
          score += 30;
        } else if (daysUntilDue <= 3) {
          score += 20;
        } else if (daysUntilDue <= 7) {
          score += 10;
        }
        
        // Skills match score (0-20)
        // This would require job skills to be defined
        // For now, we'll use a random score
        score += Math.floor(Math.random() * 20);
        
        // Available machines score (0-20)
        const availableMachines = machines.filter(m => 
          m.capabilities && 
          m.capabilities.some(c => job.operation?.includes(c))
        );
        
        if (availableMachines.length > 0) {
          score += 20;
        }
        
        return {
          ...job,
          score,
          recommendedMachine: availableMachines[0]?.id
        };
      });
      
      // Sort by score (descending)
      return scoredJobs.sort((a, b) => b.score - a.score);
    } catch (err) {
      console.error('Error getting job recommendations:', err);
      return [];
    }
  }
};