import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  ConnectionConfig, 
  ImportJob, 
  ComplianceCheck, 
  ExportControlFlag,
  ConnectionType,
  ImportType 
} from '../types/integration';

export const useIntegrationStore = defineStore('integration', () => {
  const connections = ref<ConnectionConfig[]>([]);
  const importJobs = ref<ImportJob[]>([]);
  const complianceChecks = ref<ComplianceCheck[]>([]);
  const exportFlags = ref<ExportControlFlag[]>([]);
  const loading = ref(false);

  // Mock data for demonstration
  const mockConnections: ConnectionConfig[] = [
    {
      id: '1',
      name: 'ProShop ERP Connection',
      type: 'rest-api',
      status: 'active',
      config: {
        baseUrl: 'https://api.proshop.com/v1',
        apiKey: '***hidden***',
        authType: 'bearer',
        pollInterval: 300000, // 5 minutes
        batchSize: 100
      },
      complianceLevel: 'itar',
      lastSync: '2024-01-12T14:30:00Z',
      errorCount: 0,
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '2',
      name: 'SAP Production Orders',
      type: 'sap-bapi',
      status: 'active',
      config: {
        sapHost: 'sap-prod.company.com',
        sapClient: '100',
        sapSystem: 'PRD',
        pollInterval: 900000, // 15 minutes
        batchSize: 50
      },
      complianceLevel: 'cmmc-2',
      lastSync: '2024-01-12T14:15:00Z',
      errorCount: 0,
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-12T14:15:00Z'
    },
    {
      id: '3',
      name: 'Job Data Spreadsheet',
      type: 'google-sheets',
      status: 'active',
      config: {
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        sheetName: 'Jobs',
        range: 'A1:Z1000',
        pollInterval: 60000 // 1 minute
      },
      complianceLevel: 'basic',
      lastSync: '2024-01-12T14:45:00Z',
      errorCount: 0,
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-01-12T14:45:00Z'
    }
  ];

  const mockImportJobs: ImportJob[] = [
    {
      id: '1',
      connectionId: '1',
      type: 'job-data',
      status: 'completed',
      mapping: [
        { sourceField: 'job_number', targetField: 'jobNumber', required: true },
        { sourceField: 'part_name', targetField: 'partName', required: true },
        { sourceField: 'itar_flag', targetField: 'exportFlag', required: true, complianceFlag: true }
      ],
      recordsProcessed: 150,
      recordsSuccess: 148,
      recordsError: 2,
      errors: [
        {
          row: 45,
          field: 'itar_flag',
          value: null,
          error: 'ITAR flag is required for all jobs',
          severity: 'critical'
        }
      ],
      startedAt: '2024-01-12T14:30:00Z',
      completedAt: '2024-01-12T14:32:15Z'
    }
  ];

  const mockExportFlags: ExportControlFlag[] = [
    {
      jobId: '4',
      classification: 'itar',
      category: 'Category VIII',
      restrictions: ['US Persons Only', 'No Export', 'Facility Access Required'],
      authorizedPersonnel: ['john.smith@company.com', 'sarah.johnson@company.com'],
      notes: 'Defense article - requires ITAR compliance'
    }
  ];

  const fetchConnections = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    connections.value = mockConnections;
    loading.value = false;
  };

  const fetchImportJobs = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 600));
    importJobs.value = mockImportJobs;
    loading.value = false;
  };

  const fetchExportFlags = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    exportFlags.value = mockExportFlags;
    loading.value = false;
  };

  const createConnection = async (connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConnection: ConnectionConfig = {
      ...connection,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    connections.value.push(newConnection);
  };

  const testConnection = async (connectionId: string): Promise<boolean> => {
    const connection = connections.value.find(c => c.id === connectionId);
    if (!connection) return false;

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock success/failure based on connection type
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      connection.status = 'active';
      connection.errorCount = 0;
    } else {
      connection.status = 'error';
      connection.errorCount++;
    }
    
    connection.updatedAt = new Date().toISOString();
    return success;
  };

  const runImport = async (connectionId: string, importType: ImportType) => {
    const connection = connections.value.find(c => c.id === connectionId);
    if (!connection) throw new Error('Connection not found');

    const importJob: ImportJob = {
      id: Date.now().toString(),
      connectionId,
      type: importType,
      status: 'running',
      mapping: [], // Would be configured based on import type
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsError: 0,
      errors: [],
      startedAt: new Date().toISOString()
    };

    importJobs.value.unshift(importJob);

    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock completion
    importJob.status = 'completed';
    importJob.recordsProcessed = 100;
    importJob.recordsSuccess = 98;
    importJob.recordsError = 2;
    importJob.completedAt = new Date().toISOString();

    connection.lastSync = new Date().toISOString();
  };

  const checkCompliance = async (jobId: string, userId: string, action: string): Promise<ComplianceCheck> => {
    const exportFlag = exportFlags.value.find(f => f.jobId === jobId);
    
    const check: ComplianceCheck = {
      jobId,
      userId,
      action,
      result: 'allowed',
      rules: [],
      timestamp: new Date().toISOString()
    };

    if (exportFlag) {
      // Check if user is authorized for ITAR-controlled job
      if (exportFlag.classification === 'itar') {
        const isAuthorized = exportFlag.authorizedPersonnel.includes(userId);
        if (!isAuthorized) {
          check.result = 'denied';
          check.rules.push('ITAR-controlled job requires authorized personnel');
        }
      }
    }

    complianceChecks.value.unshift(check);
    return check;
  };

  // Computed properties
  const activeConnections = computed(() => 
    connections.value.filter(c => c.status === 'active')
  );

  const connectionsByType = computed(() => {
    const types: Record<ConnectionType, number> = {
      'google-sheets': 0,
      'csv-upload': 0,
      'rest-api': 0,
      'sql-odbc': 0,
      'sap-bapi': 0,
      'webhook': 0,
      'sftp': 0
    };
    
    connections.value.forEach(conn => {
      types[conn.type]++;
    });
    
    return types;
  });

  const recentImports = computed(() => 
    importJobs.value.slice(0, 10).sort((a, b) => 
      new Date(b.startedAt || '').getTime() - new Date(a.startedAt || '').getTime()
    )
  );

  const complianceAlerts = computed(() => 
    complianceChecks.value.filter(c => c.result === 'denied').slice(0, 5)
  );

  return {
    connections,
    importJobs,
    complianceChecks,
    exportFlags,
    loading,
    activeConnections,
    connectionsByType,
    recentImports,
    complianceAlerts,
    fetchConnections,
    fetchImportJobs,
    fetchExportFlags,
    createConnection,
    testConnection,
    runImport,
    checkCompliance
  };
});