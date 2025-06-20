<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ERP Integration</h1>
        <p class="text-gray-600">Connect your organization's ERP system to JobLine.ai</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Integration Setup -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">ERP Connection</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveIntegration" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
            <select
              v-model="integration.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="rest-api">REST API</option>
              <option value="sql-odbc">SQL/ODBC Connection</option>
              <option value="sap-bapi">SAP BAPI Connector</option>
              <option value="google-sheets">Google Sheets API</option>
              <option value="csv-upload">CSV File Upload</option>
              <option value="webhook">Webhook Listener</option>
              <option value="sftp">SFTP File Drop</option>
            </select>
          </div>

          <!-- REST API Configuration -->
          <div v-if="integration.type === 'rest-api'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                <input
                  v-model="integration.config.baseUrl"
                  type="url"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://api.example.com/v1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  v-model="integration.config.apiKey"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your API key"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                <select
                  v-model="integration.config.authType"
                  required
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
                  v-model.number="integration.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- SAP Configuration -->
          <div v-if="integration.type === 'sap-bapi'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Host</label>
                <input
                  v-model="integration.config.sapHost"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sap-prod.company.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Client</label>
                <input
                  v-model="integration.config.sapClient"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP System</label>
                <input
                  v-model="integration.config.sapSystem"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="PRD"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Username</label>
                <input
                  v-model="integration.config.sapUser"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Password</label>
                <input
                  v-model="integration.config.sapPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="integration.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Google Sheets Configuration -->
          <div v-if="integration.type === 'google-sheets'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Spreadsheet ID</label>
                <input
                  v-model="integration.config.spreadsheetId"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sheet Name</label>
                <input
                  v-model="integration.config.sheetName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Jobs"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Range</label>
                <input
                  v-model="integration.config.range"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="A1:Z1000"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="integration.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Compliance Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Level</label>
            <select
              v-model="integration.complianceLevel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="basic">Basic</option>
              <option value="itar">ITAR</option>
              <option value="ear">EAR</option>
              <option value="cmmc-2">CMMC Level 2</option>
              <option value="cmmc-3">CMMC Level 3</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="integration.enabled"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Enable Integration</label>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingIntegration"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingIntegration ? 'Saving...' : 'Save Configuration' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Data Mapping -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Data Mapping</h3>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Job Data Mapping</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Field</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Field</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Flag</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(mapping, index) in jobMapping" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.sourceField"
                        type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.targetField"
                        type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.required"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.complianceFlag"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 flex justify-between">
              <button
                @click="addMappingRow"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Field
              </button>
              <button
                @click="saveMapping"
                :disabled="savingMapping"
                class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
              >
                {{ savingMapping ? 'Saving...' : 'Save Mapping' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import History -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Import History</h3>
          <button
            @click="runImport"
            :disabled="runningImport"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ runningImport ? 'Running...' : 'Run Import Now' }}
          </button>
        </div>
      </div>
      <div class="p-6">
        <div v-if="importJobs.length === 0" class="text-center py-8">
          <ArrowDownTrayIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No import jobs yet</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="job in importJobs" :key="job.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(job.startedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatImportType(job.type) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getImportStatusClass(job.status)"
                  >
                    {{ job.status.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ job.recordsProcessed }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ job.recordsSuccess }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ job.recordsError }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    v-if="job.recordsError > 0"
                    @click="viewErrors(job)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    View Errors
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { format } from 'date-fns';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';

// Mock data - in a real app, this would come from the database
const integration = reactive({
  id: 'int-1',
  type: 'rest-api',
  name: 'ERP Integration',
  enabled: true,
  config: {
    baseUrl: 'https://api.example.com/v1',
    apiKey: '********',
    authType: 'bearer',
    pollIntervalMinutes: 5,
    sapHost: '',
    sapClient: '',
    sapSystem: '',
    sapUser: '',
    sapPassword: '',
    spreadsheetId: '',
    sheetName: '',
    range: ''
  },
  complianceLevel: 'basic',
  lastSync: '2024-01-12T14:30:00Z'
});

const jobMapping = ref([
  { sourceField: 'job_number', targetField: 'jobNumber', required: true, complianceFlag: false },
  { sourceField: 'part_name', targetField: 'partName', required: true, complianceFlag: false },
  { sourceField: 'customer', targetField: 'customer', required: true, complianceFlag: false },
  { sourceField: 'quantity', targetField: 'quantity', required: true, complianceFlag: false },
  { sourceField: 'due_date', targetField: 'dueDate', required: true, complianceFlag: false },
  { sourceField: 'itar_flag', targetField: 'exportFlag', required: false, complianceFlag: true }
]);

const importJobs = ref([
  {
    id: 'job-1',
    type: 'job-data',
    status: 'completed',
    recordsProcessed: 150,
    recordsSuccess: 148,
    recordsError: 2,
    startedAt: '2024-01-12T14:30:00Z',
    completedAt: '2024-01-12T14:32:15Z',
    errors: [
      {
        row: 45,
        field: 'itar_flag',
        value: null,
        error: 'ITAR flag is required for all jobs',
        severity: 'critical'
      }
    ]
  },
  {
    id: 'job-2',
    type: 'operator-workcenter',
    status: 'completed',
    recordsProcessed: 25,
    recordsSuccess: 25,
    recordsError: 0,
    startedAt: '2024-01-11T10:15:00Z',
    completedAt: '2024-01-11T10:16:30Z',
    errors: []
  }
]);

const savingIntegration = ref(false);
const savingMapping = ref(false);
const runningImport = ref(false);

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

const formatImportType = (type: string) => {
  const types = {
    'job-data': 'Job Data',
    'operator-workcenter': 'Operator/Workcenter',
    'routing-operations': 'Routing & Operations',
    'cost-tracking': 'Cost Tracking',
    'customer-association': 'Customer Association'
  };
  return types[type as keyof typeof types] || type;
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

const saveIntegration = async () => {
  savingIntegration.value = true;
  try {
    // In a real app, you would implement this
    console.log('Saving integration:', integration);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Integration configuration saved successfully');
  } catch (error) {
    console.error('Error saving integration:', error);
    alert('Error saving integration configuration');
  } finally {
    savingIntegration.value = false;
  }
};

const addMappingRow = () => {
  jobMapping.value.push({ sourceField: '', targetField: '', required: false, complianceFlag: false });
};

const saveMapping = async () => {
  savingMapping.value = true;
  try {
    // In a real app, you would implement this
    console.log('Saving mapping:', jobMapping.value);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Data mapping saved successfully');
  } catch (error) {
    console.error('Error saving mapping:', error);
    alert('Error saving data mapping');
  } finally {
    savingMapping.value = false;
  }
};

const runImport = async () => {
  runningImport.value = true;
  try {
    // In a real app, you would implement this
    console.log('Running import...');
    
    // Simulate import
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add a new import job to the list
    importJobs.value.unshift({
      id: `job-${Date.now()}`,
      type: 'job-data',
      status: 'completed',
      recordsProcessed: 75,
      recordsSuccess: 75,
      recordsError: 0,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      errors: []
    });
    
    alert('Import completed successfully');
  } catch (error) {
    console.error('Error running import:', error);
    alert('Error running import');
  } finally {
    runningImport.value = false;
  }
};

const viewErrors = (job: any) => {
  // In a real app, you would implement this
  console.log('View errors for job:', job);
  
  // Show errors in an alert for now
  if (job.errors && job.errors.length > 0) {
    const errorMessages = job.errors.map((err: any) => 
      `Row ${err.row}: ${err.error} (${err.field})`
    ).join('\n');
    
    alert(`Import Errors:\n\n${errorMessages}`);
  }
};

onMounted(async () => {
  await refreshData();
});
</script>
```