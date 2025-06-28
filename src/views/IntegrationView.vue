<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Data Integrations</h1>
        <p class="text-gray-600">Connect your manufacturing data with JobLine.ai</p>
      </div>
      <div class="flex space-x-3">
        <router-link
          to="/integration/settings"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Manage Connections
        </router-link>
        <button
          @click="showImportModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Import Data
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Connections</p>
            <p class="text-2xl font-bold text-gray-900">{{ integrationStore.activeConnections.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <GlobeAltIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Recent Imports</p>
            <p class="text-2xl font-bold text-gray-900">{{ integrationStore.recentImports.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ArrowDownTrayIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Compliance Alerts</p>
            <p class="text-2xl font-bold text-gray-900">{{ integrationStore.complianceAlerts.length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <ShieldExclamationIcon class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">ITAR Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ integrationStore.exportFlags.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <LockClosedIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Types -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Available Integrations</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="type in connectionTypes"
            :key="type.value"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex items-center space-x-3 mb-4">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="type.bgColor"
              >
                <component :is="type.icon" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ type.label }}</h3>
                <p class="text-sm text-gray-600">{{ integrationStore.connectionsByType[type.value] }} active</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ type.description }}</p>
            <router-link
              :to="`/integration/settings?type=${type.value}`"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Configure
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance Alerts -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Compliance Alerts</h2>
      </div>
      
      <div v-if="integrationStore.complianceAlerts.length === 0" class="p-6 text-center">
        <ShieldCheckIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No compliance alerts detected</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="alert in integrationStore.complianceAlerts"
          :key="alert.timestamp"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="w-5 h-5 text-red-500" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-900">Access Denied</h4>
                <span class="text-xs text-gray-500">{{ formatTime(alert.timestamp) }}</span>
              </div>
              <p class="text-sm text-gray-700 mb-2">
                User attempted {{ alert.action }} on job {{ alert.jobId }}
              </p>
              <div class="space-y-1">
                <div v-for="rule in alert.rules" :key="rule" class="text-xs text-red-600">
                  • {{ rule }}
                </div>
              </div>
              <div class="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                <span>User: {{ alert.userId }}</span>
                <span v-if="alert.ipAddress">IP: {{ alert.ipAddress }}</span>
                <span v-if="alert.location">Location: {{ alert.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-xl mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Import Data</h3>
          <button
            @click="showImportModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Connection</label>
            <select
              v-model="selectedConnectionId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a connection</option>
              <option v-for="conn in integrationStore.activeConnections" :key="conn.id" :value="conn.id">
                {{ conn.name }} ({{ getConnectionTypeLabel(conn.type) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Import Type</label>
            <select
              v-model="importSettings.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="job-data">Job Data</option>
              <option value="operator-workcenter">Operator/Workcenter Mapping</option>
              <option value="routing-operations">Routing & Operations</option>
              <option value="cost-tracking">Cost Tracking</option>
              <option value="customer-association">Customer Association</option>
            </select>
          </div>

          <div v-if="selectedConnectionId && importSettings.type === 'job-data'">
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div class="flex">
                <InformationCircleIcon class="h-5 w-5 text-blue-400" />
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    This will import job data from the selected connection. Make sure your data mapping is correctly configured.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedConnectionId && importSettings.type === 'csv-upload' && selectedConnection?.type === 'csv-upload'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200"
            >
              <DocumentArrowUpIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                ref="fileInput"
                @change="handleFileSelected"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors duration-200"
              >
                Browse Files
              </button>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              @click="runImport"
              :disabled="!selectedConnectionId || importing"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ importing ? 'Importing...' : 'Start Import' }}
            </button>
            <button
              type="button"
              @click="showImportModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { format } from 'date-fns';
import { useIntegrationStore } from '../stores/integration';
import type { ImportType } from '../types/integration';
import {
  GlobeAltIcon,
  ArrowDownTrayIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CloudIcon,
  DocumentArrowUpIcon,
  CircleStackIcon,
  BuildingOfficeIcon,
  BoltIcon,
  ServerIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline';

const integrationStore = useIntegrationStore();
const showImportModal = ref(false);
const importing = ref(false);
const selectedConnectionId = ref('');
const fileInput = ref<HTMLInputElement>();

const connectionTypes = [
  { 
    value: 'rest-api', 
    label: 'REST API', 
    icon: GlobeAltIcon, 
    bgColor: 'bg-purple-100 text-purple-600',
    description: 'Connect to any REST API endpoint to import and export data'
  },
  { 
    value: 'google-sheets', 
    label: 'Google Sheets', 
    icon: CloudIcon, 
    bgColor: 'bg-green-100 text-green-600',
    description: 'Import data directly from Google Sheets spreadsheets'
  },
  { 
    value: 'csv-upload', 
    label: 'CSV Upload', 
    icon: DocumentArrowUpIcon, 
    bgColor: 'bg-blue-100 text-blue-600',
    description: 'Import data from CSV, TSV, or Excel files'
  },
  { 
    value: 'sql-odbc', 
    label: 'SQL/ODBC', 
    icon: CircleStackIcon, 
    bgColor: 'bg-orange-100 text-orange-600',
    description: 'Connect to SQL databases via ODBC drivers'
  },
  { 
    value: 'sap-bapi', 
    label: 'SAP BAPI', 
    icon: BuildingOfficeIcon, 
    bgColor: 'bg-indigo-100 text-indigo-600',
    description: 'Connect to SAP systems using BAPI interfaces'
  },
  { 
    value: 'webhook', 
    label: 'Webhook', 
    icon: BoltIcon, 
    bgColor: 'bg-yellow-100 text-yellow-600',
    description: 'Receive data via webhooks from external systems'
  },
  { 
    value: 'sftp', 
    label: 'SFTP', 
    icon: ServerIcon, 
    bgColor: 'bg-gray-100 text-gray-600',
    description: 'Import data from files dropped on SFTP servers'
  }
];

const importSettings = reactive({
  type: 'job-data' as ImportType,
  file: null as File | null
});

const selectedConnection = computed(() => {
  if (!selectedConnectionId.value) return null;
  return integrationStore.connections.find(c => c.id === selectedConnectionId.value);
});

const getConnectionTypeLabel = (type: string) => {
  const labels = {
    'google-sheets': 'Google Sheets API',
    'csv-upload': 'CSV File Upload',
    'rest-api': 'REST API',
    'sql-odbc': 'SQL/ODBC Connection',
    'sap-bapi': 'SAP BAPI Connector',
    'webhook': 'Webhook Listener',
    'sftp': 'SFTP File Drop'
  };
  return labels[type as keyof typeof labels] || type;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

const handleFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    importSettings.file = target.files[0];
  }
};

const runImport = async () => {
  if (!selectedConnectionId.value) return;
  
  importing.value = true;
  try {
    await integrationStore.runImport(selectedConnectionId.value, importSettings.type);
    showImportModal.value = false;
    
    // Reset form
    selectedConnectionId.value = '';
    importSettings.type = 'job-data';
    importSettings.file = null;
    
    alert('Import job started successfully!');
  } catch (error) {
    console.error('Error running import:', error);
    alert('Import failed: ' + (error as Error).message);
  } finally {
    importing.value = false;
  }
};

onMounted(async () => {
  await integrationStore.fetchConnections();
  await integrationStore.fetchImportJobs();
  await integrationStore.fetchExportFlags();
});
</script>