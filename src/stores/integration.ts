import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { integrationService } from '../services/integration.service.ts';
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
  const error = ref<string | null>(null);

  const fetchConnections = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const fetchedConnections = await integrationService.fetchConnections();
      connections.value = fetchedConnections;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching connections:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchImportJobs = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const fetchedJobs = await integrationService.fetchImportJobs();
      importJobs.value = fetchedJobs;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching import jobs:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchExportFlags = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const fetchedFlags = await integrationService.fetchExportFlags();
      exportFlags.value = fetchedFlags;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching export flags:', err);
    } finally {
      loading.value = false;
    }
  };

  const createConnection = async (connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newConnection = await integrationService.createConnection(connection);
      connections.value.unshift(newConnection);
      return newConnection;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error creating connection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateConnection = async (connection: ConnectionConfig) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await integrationService.updateConnection(connection);
      
      if (success) {
        const index = connections.value.findIndex(c => c.id === connection.id);
        if (index !== -1) {
          connections.value[index] = { ...connection };
        }
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating connection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteConnection = async (connectionId: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await integrationService.deleteConnection(connectionId);
      
      if (success) {
        connections.value = connections.value.filter(c => c.id !== connectionId);
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting connection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const testConnection = async (connectionId: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await integrationService.testConnection(connectionId);
      
      if (success) {
        const index = connections.value.findIndex(c => c.id === connectionId);
        if (index !== -1) {
          connections.value[index].status = 'active';
          connections.value[index].lastSync = new Date().toISOString();
        }
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error testing connection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const runImport = async (connectionId: string, importType: ImportType) => {
    loading.value = true;
    error.value = null;
    
    try {
      const importJob = await integrationService.runImport(connectionId, importType);
      importJobs.value.unshift(importJob);
      return importJob;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error running import:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const checkCompliance = async (jobId: string, userId: string, action: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const check = await integrationService.checkCompliance(jobId, userId, action);
      complianceChecks.value.unshift(check);
      return check;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error checking compliance:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const scheduleAutomaticSync = async (connectionId: string) => {
    try {
      return await integrationService.scheduleAutomaticSync(connectionId);
    } catch (err: any) {
      console.error('Error scheduling automatic sync:', err);
      return false;
    }
  };

  const optimizeJobSchedule = async (departmentId?: string) => {
    try {
      return await integrationService.optimizeJobSchedule(departmentId);
    } catch (err: any) {
      console.error('Error optimizing job schedule:', err);
      return false;
    }
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
    error,
    activeConnections,
    connectionsByType,
    recentImports,
    complianceAlerts,
    fetchConnections,
    fetchImportJobs,
    fetchExportFlags,
    createConnection,
    updateConnection,
    deleteConnection,
    testConnection,
    runImport,
    checkCompliance,
    scheduleAutomaticSync,
    optimizeJobSchedule
  };
});