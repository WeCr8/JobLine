<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Integrations</h1>
        <p class="text-gray-600">Manage global integration settings and connections</p>
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

    <!-- Global Integration Settings -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Global Integration Settings</h2>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveGlobalSettings" class="space-y-6">
          <!-- API Settings -->
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-4">API Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (requests per minute)</label>
                <input
                  v-model.number="globalSettings.apiRateLimit"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Timeout (seconds)</label>
                <input
                  v-model.number="globalSettings.apiTimeout"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Batch Size</label>
                <input
                  v-model.number="globalSettings.maxBatchSize"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                <input
                  v-model.number="globalSettings.maxFileSize"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- External Service Credentials -->
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-4">External Service Credentials</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Google API Key</label>
                <input
                  v-model="globalSettings.googleApiKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter Google API key"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP API Credentials</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    v-model="globalSettings.sapUsername"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Username"
                  />
                  <input
                    v-model="globalSettings.sapPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Toggles -->
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-4">Feature Toggles</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Enable AI Job Scheduling</h4>
                  <p class="text-sm text-gray-500">Allow AI to automatically schedule and optimize jobs</p>
                </div>
                <div>
                  <ToggleSwitch v-model="globalSettings.enableAiJobScheduling" />
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Enable External API Access</h4>
                  <p class="text-sm text-gray-500">Allow external systems to access the JobLine.ai API</p>
                </div>
                <div>
                  <ToggleSwitch v-model="globalSettings.enableExternalApiAccess" />
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Enable Webhook Integrations</h4>
                  <p class="text-sm text-gray-500">Allow webhook integrations for real-time data updates</p>
                </div>
                <div>
                  <ToggleSwitch v-model="globalSettings.enableWebhookIntegrations" />
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Enable File Uploads</h4>
                  <p class="text-sm text-gray-500">Allow file uploads for data import</p>
                </div>
                <div>
                  <ToggleSwitch v-model="globalSettings.enableFileUploads" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingGlobalSettings"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingGlobalSettings ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Organization Integrations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Organization Integrations</h2>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Connections</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Import</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="org in organizations" :key="org.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                  <div class="text-xs text-gray-500">{{ org.industry }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.activeConnections }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.lastImport ? formatTime(org.lastImport) : 'Never' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ org.status.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="viewOrgIntegrations(org)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="resetOrgIntegrations(org)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Integration Logs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Integration Logs</h2>
          <div class="flex space-x-2">
            <select
              v-model="logLevel"
              class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Error</option>
              <option value="DEBUG">Debug</option>
            </select>
            <button
              @click="refreshLogs"
              class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowPathIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connection</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatTime(log.timestamp) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getLogLevelClass(log.level)"
                  >
                    {{ log.level }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ log.message }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ log.organization || 'System' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ log.connection || '-' }}</div>
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
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const logLevel = ref('all');
const savingGlobalSettings = ref(false);

// Global settings
const globalSettings = ref({
  apiRateLimit: 60,
  apiTimeout: 30,
  maxBatchSize: 1000,
  maxFileSize: 10,
  googleApiKey: '',
  sapUsername: '',
  sapPassword: '',
  enableAiJobScheduling: true,
  enableExternalApiAccess: true,
  enableWebhookIntegrations: true,
  enableFileUploads: true
});

// Mock data for organizations
const organizations = ref([
  {
    id: 'org-1',
    name: 'Acme Manufacturing',
    industry: 'Manufacturing',
    activeConnections: 3,
    lastImport: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'org-2',
    name: 'TechCorp Industries',
    industry: 'Aerospace',
    activeConnections: 1,
    lastImport: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'org-3',
    name: 'Global Precision',
    industry: 'Automotive',
    activeConnections: 0,
    lastImport: null,
    status: 'inactive'
  }
]);

// Mock data for logs
const integrationLogs = ref([
  {
    id: '1',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'Import job completed successfully',
    organization: 'Acme Manufacturing',
    connection: 'ERP Connection'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    level: 'ERROR',
    message: 'Failed to connect to external API',
    organization: 'TechCorp Industries',
    connection: 'REST API'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    level: 'WARN',
    message: 'Missing required field in import data',
    organization: 'Acme Manufacturing',
    connection: 'ERP Connection'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'New connection created',
    organization: 'TechCorp Industries',
    connection: 'REST API'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    level: 'DEBUG',
    message: 'Testing connection parameters',
    organization: 'Acme Manufacturing',
    connection: 'Google Sheets'
  }
]);

// Computed
const filteredLogs = computed(() => {
  if (logLevel.value === 'all') {
    return integrationLogs.value;
  }
  return integrationLogs.value.filter(log => log.level === logLevel.value);
});

// Methods
const refreshData = async () => {
  try {
    // In a real implementation, this would fetch data from the database
    console.log('Refreshing data...');
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const saveGlobalSettings = async () => {
  savingGlobalSettings.value = true;
  
  try {
    // In a real implementation, this would save to the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Global settings saved successfully');
  } catch (error) {
    console.error('Error saving global settings:', error);
    alert('Failed to save global settings');
  } finally {
    savingGlobalSettings.value = false;
  }
};

const viewOrgIntegrations = (org: any) => {
  // In a real implementation, this would navigate to the organization's integrations page
  console.log('View integrations for organization:', org);
};

const resetOrgIntegrations = (org: any) => {
  if (confirm(`Are you sure you want to reset all integrations for ${org.name}? This will delete all connections and import history.`)) {
    // In a real implementation, this would reset the organization's integrations
    console.log('Reset integrations for organization:', org);
  }
};

const refreshLogs = async () => {
  try {
    // In a real implementation, this would fetch logs from the database
    console.log('Refreshing logs...');
  } catch (error) {
    console.error('Error refreshing logs:', error);
  }
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
};

const getLogLevelClass = (level: string) => {
  const classes = {
    'INFO': 'bg-blue-100 text-blue-800',
    'WARN': 'bg-yellow-100 text-yellow-800',
    'ERROR': 'bg-red-100 text-red-800',
    'DEBUG': 'bg-gray-100 text-gray-800'
  };
  return classes[level as keyof typeof classes] || classes.INFO;
};

onMounted(() => {
  refreshData();
});
</script>