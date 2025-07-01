<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Integration Dashboard</h1>
        <p class="text-gray-600">Connect and manage your data sources</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
        <button
          @click="showAddConnectionModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Connection
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
            <p class="text-sm font-medium text-gray-600">Scheduled Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ scheduledJobsCount }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Data Sources</p>
            <p class="text-2xl font-bold text-gray-900">{{ Object.values(integrationStore.connectionsByType).reduce((a, b) => a + b, 0) }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CircleStackIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
        >
          <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Connections Tab -->
    <div v-if="activeTab === 'connections'" class="space-y-6">
      <div v-if="integrationStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-2 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>

      <div v-else-if="integrationStore.connections.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LinkIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
        <p class="text-gray-600 mb-6">Get started by adding your first data connection</p>
        <button
          @click="showAddConnectionModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Connection
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationConnectionCard
          v-for="connection in integrationStore.connections"
          :key="connection.id"
          :connection="connection"
          :testing="testingConnection === connection.id"
          :importing="importingConnection === connection.id"
          @test-connection="testConnection"
          @run-import="showImportModal"
          @edit-connection="editConnection"
          @delete-connection="deleteConnection"
        />
      </div>
    </div>

    <!-- File Upload Tab -->
    <div v-if="activeTab === 'upload'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <IntegrationFileUploader
          :accepted-formats="['csv', 'xlsx', 'xls']"
          :max-file-size="10 * 1024 * 1024"
          description="Upload your data files for import into JobLine.ai"
          @upload-start="handleUploadStart"
          @upload-progress="handleUploadProgress"
          @upload-complete="handleUploadComplete"
          @upload-error="handleUploadError"
        />
      </div>
    </div>

    <!-- Job Scheduler Tab -->
    <div v-if="activeTab === 'scheduler'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <IntegrationJobScheduler
          title="AI Job Scheduler"
          description="Automatically schedule jobs based on AI recommendations"
          :jobs="jobsStore.jobs"
          :machines="machines"
          :operators="operators"
          :departments="departments"
          :loading="jobsStore.loading"
          @schedule-jobs="handleScheduleJobs"
          @auto-schedule="handleAutoSchedule"
          @optimization-complete="handleOptimizationComplete"
        />
      </div>
    </div>

    <!-- Import History Tab -->
    <div v-if="activeTab === 'history'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Import History</h2>
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
                  <div v-for="(error, index) in job.errors.slice(0, 3)" :key="index" class="text-xs text-red-600">
                    Row {{ error.row }}: {{ error.error }}
                  </div>
                  <div v-if="job.errors.length > 3" class="text-xs text-red-600">
                    ... and {{ job.errors.length - 3 }} more errors
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Connection Modal -->
    <div v-if="showAddConnectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">{{ editingConnection.id ? 'Edit' : 'Add' }} Connection</h3>
          <button
            @click="showAddConnectionModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveConnection" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Connection Name</label>
                <input
                  v-model="editingConnection.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="ERP Connection"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
                <select 
                  v-model="editingConnection.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option v-for="type in connectionTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Level</label>
                <select
                  v-model="editingConnection.complianceLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="basic">Basic</option>
                  <option value="itar">ITAR</option>
                  <option value="ear">EAR</option>
                  <option value="cmmc-2">CMMC Level 2</option>
                  <option value="cmmc-3">CMMC Level 3</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="editingConnection.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Connection-specific Configuration -->
          <div v-if="editingConnection.type === 'rest-api'">
            <h4 class="text-md font-medium text-gray-900 mb-4">REST API Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                <input
                  v-model="editingConnection.config.baseUrl"
                  type="url"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://api.example.com/v1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  v-model="editingConnection.config.apiKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your API key"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                <select
                  v-model="editingConnection.config.authType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="oauth">OAuth 2.0</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                <input
                  v-model.number="editingConnection.config.batchSize"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'google-sheets'">
            <h4 class="text-md font-medium text-gray-900 mb-4">Google Sheets Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Spreadsheet ID</label>
                <input
                  v-model="editingConnection.config.spreadsheetId"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
                <p class="text-xs text-gray-500 mt-1">Found in the URL of your Google Sheet</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sheet Name</label>
                <input
                  v-model="editingConnection.config.sheetName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Sheet1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Range</label>
                <input
                  v-model="editingConnection.config.range"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="A1:Z1000"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Data Mapping -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Data Mapping</h4>
            <IntegrationDataMapper
              v-model="editingConnection.mapping"
              :source-fields="sourceFields"
              :target-fields="targetFields"
              :sample-data="sampleData"
              show-compliance
              show-auto-map
              @change="handleMappingChange"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ saving ? 'Saving...' : (editingConnection.id ? 'Update Connection' : 'Add Connection') }}
            </button>
            <button
              type="button"
              @click="showAddConnectionModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Run Import</h3>
          <button
            @click="showImportModalVisible = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="confirmImport" class="space-y-4">
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

          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <InformationCircleIcon class="h-5 w-5 text-blue-400" />
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  This will import data from the selected connection. Make sure your data mapping is correctly configured.
                </p>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="importing"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ importing ? 'Importing...' : 'Start Import' }}
            </button>
            <button
              type="button"
              @click="showImportModalVisible = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useIntegrationStore } from '../stores/integration';
import { useJobsStore } from '../stores/jobs';
import IntegrationConnectionCard from '../components/IntegrationConnectionCard.vue';
import IntegrationFileUploader from '../components/IntegrationFileUploader.vue';
import IntegrationDataMapper from '../components/IntegrationDataMapper.vue';
import IntegrationJobScheduler from '../components/IntegrationJobScheduler.vue';
import {
  LinkIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  ClockIcon,
  CircleStackIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline';

const integrationStore = useIntegrationStore();
const jobsStore = useJobsStore();

// State
const activeTab = ref('connections');
const showAddConnectionModal = ref(false);
const showImportModalVisible = ref(false);
const testingConnection = ref<string | null>(null);
const importingConnection = ref<string | null>(null);
const saving = ref(false);
const importing = ref(false);

// Mock data for machines, operators, and departments
const machines = ref([
  {
    id: 'machine-1',
    name: 'CNC-001',
    type: 'CNC Machining Center',
    department: 'cnc-machining',
    status: 'idle',
    capabilities: ['milling', 'drilling', 'tapping']
  },
  {
    id: 'machine-2',
    name: 'CNC-002',
    type: 'CNC Lathe',
    department: 'cnc-machining',
    status: 'idle',
    capabilities: ['turning', 'threading', 'facing']
  },
  {
    id: 'machine-3',
    name: 'LASER-001',
    type: 'Laser Cutter',
    department: 'sheet-metal',
    status: 'idle',
    capabilities: ['cutting', 'marking', 'engraving']
  }
]);

const operators = ref([
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'operator',
    department: 'cnc-machining',
    is_active: true,
    skills: ['milling', 'drilling', 'programming']
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'lead',
    department: 'cnc-machining',
    is_active: true,
    skills: ['setup', 'inspection', 'programming']
  },
  {
    id: 'user-3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'operator',
    department: 'sheet-metal',
    is_active: true,
    skills: ['laser-cutting', 'bending', 'welding']
  }
]);

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining'
  },
  {
    id: 'sheet-metal',
    name: 'Sheet Metal'
  },
  {
    id: 'quality',
    name: 'Quality Control'
  }
]);

const tabs = [
  { id: 'connections', name: 'Connections', icon: LinkIcon },
  { id: 'upload', name: 'File Upload', icon: DocumentArrowUpIcon },
  { id: 'scheduler', name: 'Job Scheduler', icon: ClockIcon },
  { id: 'history', name: 'Import History', icon: ArrowDownTrayIcon }
];

const connectionTypes = [
  { value: 'rest-api', label: 'REST API' },
  { value: 'google-sheets', label: 'Google Sheets' },
  { value: 'csv-upload', label: 'CSV Upload' },
  { value: 'sql-odbc', label: 'SQL/ODBC' },
  { value: 'sap-bapi', label: 'SAP BAPI' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'sftp', label: 'SFTP' }
];

const editingConnection = reactive<any>({
  id: '',
  name: '',
  type: 'rest-api',
  status: 'inactive',
  config: {},
  complianceLevel: 'basic',
  mapping: [],
  errorCount: 0
});

const importSettings = reactive({
  type: 'job-data' as ImportType
});

// Sample data for mapping
const sourceFields = ref([
  'job_number', 'part_number', 'part_name', 'customer', 'quantity', 
  'due_date', 'priority', 'export_control', 'material', 'notes'
]);

const targetFields = ref([
  'jobNumber', 'partNumber', 'partName', 'customer', 'quantity',
  'dueDate', 'priority', 'exportControl', 'material', 'notes'
]);

const sampleData = ref([
  {
    job_number: 'J2024-001',
    part_number: 'PN-12345',
    part_name: 'Hydraulic Cylinder Housing',
    customer: 'Acme Manufacturing',
    quantity: 50,
    due_date: '2024-02-15',
    priority: 'high',
    export_control: 'None'
  },
  {
    job_number: 'J2024-002',
    part_number: 'PN-67890',
    part_name: 'Gear Assembly',
    customer: 'TechCorp Industries',
    quantity: 25,
    due_date: '2024-02-20',
    priority: 'medium',
    export_control: 'ITAR'
  }
]);

// Computed
const scheduledJobsCount = computed(() => {
  return jobsStore.jobs.filter(job => job.status === 'setup').length;
});

// Methods
const refreshData = async () => {
  try {
    await integrationStore.fetchConnections();
    await integrationStore.fetchImportJobs();
    await integrationStore.fetchExportFlags();
    await jobsStore.fetchJobs();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const testConnection = async (connectionId: string) => {
  testingConnection.value = connectionId;
  try {
    const success = await integrationStore.testConnection(connectionId);
    if (success) {
      alert('Connection test successful!');
    } else {
      alert('Connection test failed. Please check your configuration.');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    alert('Connection test failed: ' + (error as Error).message);
  } finally {
    testingConnection.value = null;
  }
};

const showImportModal = (connectionId: string) => {
  importingConnection.value = connectionId;
  showImportModalVisible.value = true;
};

const confirmImport = async () => {
  if (!importingConnection.value) return;
  
  importing.value = true;
  try {
    await integrationStore.runImport(importingConnection.value, importSettings.type);
    showImportModalVisible.value = false;
    alert('Import job started successfully!');
  } catch (error) {
    console.error('Error running import:', error);
    alert('Import failed: ' + (error as Error).message);
  } finally {
    importing.value = false;
    importingConnection.value = null;
  }
};

const editConnection = (connectionId: string) => {
  const connection = integrationStore.connections.find(c => c.id === connectionId);
  
  if (connection) {
    // Convert poll interval from ms to minutes for UI
    const config = { ...connection.config };
    if (config.pollInterval) {
      config.pollIntervalMinutes = Math.floor(config.pollInterval / 60000);
    }
    
    Object.assign(editingConnection, {
      ...connection,
      config,
      mapping: connection.mapping || []
    });
    
    showAddConnectionModal.value = true;
  }
};

const deleteConnection = async (connectionId: string) => {
  try {
    await integrationStore.deleteConnection(connectionId);
    alert('Connection deleted successfully');
  } catch (error) {
    console.error('Error deleting connection:', error);
    alert('Failed to delete connection: ' + (error as Error).message);
  }
};

const saveConnection = async () => {
  saving.value = true;
  
  try {
    // Convert poll interval from minutes to ms
    if (editingConnection.config.pollIntervalMinutes) {
      editingConnection.config.pollInterval = editingConnection.config.pollIntervalMinutes * 60000;
    }
    
    const connection: Partial<ConnectionConfig> = {
      id: editingConnection.id || undefined,
      name: editingConnection.name,
      type: editingConnection.type,
      status: editingConnection.status,
      config: editingConnection.config,
      complianceLevel: editingConnection.complianceLevel,
      mapping: editingConnection.mapping
    };
    
    if (editingConnection.id) {
      await integrationStore.updateConnection(connection as ConnectionConfig);
    } else {
      await integrationStore.createConnection(connection as Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    showAddConnectionModal.value = false;
    
    // Reset form
    Object.assign(editingConnection, {
      id: '',
      name: '',
      type: 'rest-api',
      status: 'inactive',
      config: {},
      complianceLevel: 'basic',
      mapping: []
    });
  } catch (error) {
    console.error('Error saving connection:', error);
    alert('Failed to save connection: ' + (error as Error).message);
  } finally {
    saving.value = false;
  }
};

const handleMappingChange = (mappings: ImportMapping[]) => {
  editingConnection.mapping = mappings;
};

const handleUploadStart = (file: File) => {
  console.log('Upload started:', file.name);
};

const handleUploadProgress = (progress: number) => {
  console.log('Upload progress:', progress);
};

const handleUploadComplete = (result: any) => {
  console.log('Upload complete:', result);
  alert('File uploaded and processed successfully!');
  refreshData();
};

const handleUploadError = (error: string) => {
  console.error('Upload error:', error);
  alert('Upload failed: ' + error);
};

const handleScheduleJobs = (jobIds: string[]) => {
  console.log('Schedule jobs:', jobIds);
};

const handleAutoSchedule = () => {
  console.log('Auto-schedule all jobs');
};

const handleOptimizationComplete = (results: any[]) => {
  console.log('Optimization complete:', results);
  refreshData();
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

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
  const types = {
    'job-data': 'Job Data',
    'operator-workcenter': 'Operator/Workcenter',
    'routing-operations': 'Routing & Operations',
    'cost-tracking': 'Cost Tracking',
    'customer-association': 'Customer Association'
  };
  return types[type] || type;
};

onMounted(() => {
  refreshData();
});
</script>