<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ERP Integration</h1>
        <p class="text-gray-600">Manage data connections and compliance monitoring</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showImportModal = true"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Import Data
        </button>
        <button
          @click="showConnectionModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          New Connection
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

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Connections -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Data Connections</h2>
          </div>
          
          <div v-if="integrationStore.loading" class="p-6">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="integrationStore.connections.length === 0" class="p-6 text-center">
            <GlobeAltIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No connections configured</p>
          </div>

          <div v-else class="p-6 space-y-6">
            <ConnectionCard
              v-for="connection in integrationStore.connections"
              :key="connection.id"
              :connection="connection"
              @test-connection="handleTestConnection"
              @run-import="handleRunImport"
              @edit-connection="handleEditConnection"
            />
          </div>
        </div>
      </div>

      <!-- Compliance Alerts -->
      <div>
        <ComplianceAlert
          :alerts="integrationStore.complianceAlerts"
          @view-all-alerts="handleViewAllAlerts"
        />
      </div>
    </div>

    <!-- Recent Import Jobs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Recent Import Jobs</h2>
      </div>
      
      <div v-if="integrationStore.recentImports.length === 0" class="p-6 text-center">
        <ArrowDownTrayIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No import jobs yet</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="job in integrationStore.recentImports"
          :key="job.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getImportStatusClass(job.status)"
              >
                {{ job.status.toUpperCase() }}
              </span>
              <h3 class="text-sm font-medium text-gray-900">{{ getImportTypeLabel(job.type) }}</h3>
            </div>
            <span class="text-xs text-gray-500">{{ formatTime(job.startedAt || '') }}</span>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Processed:</span>
              <p class="font-medium text-gray-900">{{ job.recordsProcessed }}</p>
            </div>
            <div>
              <span class="text-gray-500">Success:</span>
              <p class="font-medium text-green-600">{{ job.recordsSuccess }}</p>
            </div>
            <div>
              <span class="text-gray-500">Errors:</span>
              <p class="font-medium text-red-600">{{ job.recordsError }}</p>
            </div>
          </div>

          <div v-if="job.errors.length > 0" class="mt-3">
            <details class="text-sm">
              <summary class="cursor-pointer text-red-600 hover:text-red-700">
                View {{ job.errors.length }} error(s)
              </summary>
              <div class="mt-2 space-y-1">
                <div v-for="error in job.errors.slice(0, 3)" :key="error.row" class="text-xs text-red-600">
                  Row {{ error.row }}: {{ error.error }}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Modal -->
    <div v-if="showConnectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">New Data Connection</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
            <select 
              v-model="newConnection.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="google-sheets">Google Sheets API</option>
              <option value="csv-upload">CSV File Upload</option>
              <option value="rest-api">REST API</option>
              <option value="sql-odbc">SQL/ODBC Connection</option>
              <option value="sap-bapi">SAP BAPI Connector</option>
              <option value="webhook">Webhook Listener</option>
              <option value="sftp">SFTP File Drop</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Connection Name</label>
            <input
              v-model="newConnection.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="My ERP Connection"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Level</label>
            <select 
              v-model="newConnection.complianceLevel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="basic">Basic</option>
              <option value="itar">ITAR</option>
              <option value="ear">EAR</option>
              <option value="cmmc-2">CMMC Level 2</option>
              <option value="cmmc-3">CMMC Level 3</option>
            </select>
          </div>

          <!-- Dynamic configuration fields based on connection type -->
          <div v-if="newConnection.type === 'rest-api'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
              <input
                v-model="newConnection.config.baseUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://api.example.com/v1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                v-model="newConnection.config.apiKey"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your API key"
              />
            </div>
          </div>

          <div v-if="newConnection.type === 'google-sheets'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Spreadsheet ID</label>
              <input
                v-model="newConnection.config.spreadsheetId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sheet Name</label>
              <input
                v-model="newConnection.config.sheetName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Jobs"
              />
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="handleCreateConnection"
            class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Create Connection
          </button>
          <button
            @click="showConnectionModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { format } from 'date-fns';
import { useIntegrationStore } from '../stores/integration';
import ConnectionCard from '../components/ConnectionCard.vue';
import ComplianceAlert from '../components/ComplianceAlert.vue';
import type { ConnectionConfig, ImportType } from '../types/integration';
import {
  GlobeAltIcon,
  ArrowDownTrayIcon,
  ShieldExclamationIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline';

const integrationStore = useIntegrationStore();
const showConnectionModal = ref(false);
const showImportModal = ref(false);

const newConnection = reactive({
  name: '',
  type: 'rest-api' as any,
  status: 'inactive' as any,
  config: {} as any,
  complianceLevel: 'basic' as any,
  errorCount: 0
});

const getImportStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'running': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getImportTypeLabel = (type: ImportType) => {
  const labels = {
    'job-data': 'Job Data Import',
    'operator-workcenter': 'Operator/Workcenter Mapping',
    'routing-operations': 'Routing & Operations',
    'cost-tracking': 'Cost & SLA Tracking',
    'customer-association': 'Customer Association'
  };
  return labels[type] || type;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

const handleTestConnection = async (connectionId: string) => {
  await integrationStore.testConnection(connectionId);
};

const handleRunImport = async (connectionId: string) => {
  await integrationStore.runImport(connectionId, 'job-data');
};

const handleEditConnection = (connectionId: string) => {
  console.log('Edit connection:', connectionId);
};

const handleCreateConnection = async () => {
  await integrationStore.createConnection(newConnection);
  showConnectionModal.value = false;
  
  // Reset form
  Object.assign(newConnection, {
    name: '',
    type: 'rest-api',
    status: 'inactive',
    config: {},
    complianceLevel: 'basic',
    errorCount: 0
  });
};

const handleViewAllAlerts = () => {
  console.log('View all compliance alerts');
};

onMounted(() => {
  integrationStore.fetchConnections();
  integrationStore.fetchImportJobs();
  integrationStore.fetchExportFlags();
});
</script>