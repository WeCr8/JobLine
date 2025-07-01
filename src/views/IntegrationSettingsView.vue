<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Integration Settings</h1>
        <p class="text-gray-600">Configure your data integration preferences</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="saveSettings"
          :disabled="saving"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
        >
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </div>

    <!-- API Access -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">API Access</h2>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div>
            <ApiKeyDisplay
              label="API Key"
              :value="apiKey"
              help-text="Use this key to authenticate API requests"
              can-regenerate
              @regenerate="regenerateApiKey"
              @copied="handleApiKeyCopied"
            />
          </div>
          
          <div>
            <ApiKeyDisplay
              label="Webhook Secret"
              :value="webhookSecret"
              help-text="Use this secret to verify webhook requests"
              can-regenerate
              @regenerate="regenerateWebhookSecret"
              @copied="handleWebhookSecretCopied"
            />
          </div>
          
          <div>
            <ApiKeyDisplay
              label="Webhook URL"
              :value="webhookUrl"
              help-text="Use this URL to receive webhook notifications"
              @copied="handleWebhookUrlCopied"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- API Permissions -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">API Permissions</h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="permission in apiPermissions" :key="permission.id" class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">{{ permission.name }}</h4>
              <p class="text-sm text-gray-500">{{ permission.description }}</p>
            </div>
            <div>
              <ToggleSwitch v-model="permission.enabled" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Mapping Templates -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Data Mapping Templates</h2>
          <button
            @click="showAddTemplateModal = true"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
          >
            Add Template
          </button>
        </div>
      </div>
      <div class="p-6">
        <div v-if="mappingTemplates.length === 0" class="text-center py-8">
          <DocumentDuplicateIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No mapping templates yet</p>
          <button
            @click="showAddTemplateModal = true"
            class="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Create your first template
          </button>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="template in mappingTemplates"
            :key="template.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
              <div class="flex space-x-2">
                <button
                  @click="editTemplate(template)"
                  class="text-primary-600 hover:text-primary-700"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="deleteTemplate(template.id)"
                  class="text-red-600 hover:text-red-700"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
            
            <div class="text-sm text-gray-500">
              <span>{{ template.mappings.length }} field mappings</span>
              <span class="mx-2">•</span>
              <span>{{ template.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance Settings -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Compliance Settings</h2>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Default Compliance Level</label>
            <select
              v-model="complianceSettings.defaultLevel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="basic">Basic</option>
              <option value="itar">ITAR</option>
              <option value="ear">EAR</option>
              <option value="cmmc-2">CMMC Level 2</option>
              <option value="cmmc-3">CMMC Level 3</option>
            </select>
            <p class="mt-1 text-sm text-gray-500">
              This compliance level will be applied to new connections by default
            </p>
          </div>
          
          <div class="space-y-4">
            <div v-for="rule in complianceSettings.rules" :key="rule.id" class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ rule.name }}</h4>
                <p class="text-sm text-gray-500">{{ rule.description }}</p>
              </div>
              <div>
                <ToggleSwitch v-model="rule.enabled" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Template Modal -->
    <div v-if="showAddTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">{{ editingTemplate.id ? 'Edit' : 'Add' }} Mapping Template</h3>
          <button
            @click="showAddTemplateModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveTemplate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                v-model="editingTemplate.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="ERP Job Import"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Import Type</label>
              <select
                v-model="editingTemplate.type"
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
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="editingTemplate.description"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Template for importing job data from ERP system"
              ></textarea>
            </div>
          </div>
          
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Field Mappings</h4>
            <IntegrationDataMapper
              v-model="editingTemplate.mappings"
              :source-fields="sourceFields"
              :target-fields="getTargetFieldsForType(editingTemplate.type)"
              show-compliance
              show-auto-map
            />
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="savingTemplate"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingTemplate ? 'Saving...' : (editingTemplate.id ? 'Update Template' : 'Add Template') }}
            </button>
            <button
              type="button"
              @click="showAddTemplateModal = false"
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
import { useAuthStore } from '../stores/auth.ts';
import { settingsService } from '../services/settings.service';
import ApiKeyDisplay from '../components/ApiKeyDisplay.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import IntegrationDataMapper from '../components/IntegrationDataMapper.vue';
import type { ImportMapping, ImportType } from '../types/integration';
import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

// State
const saving = ref(false);
const savingTemplate = ref(false);
const showAddTemplateModal = ref(false);

// API Settings
const apiKey = ref('jl_api_' + Math.random().toString(36).substring(2, 15));
const webhookSecret = ref(Math.random().toString(36).substring(2, 15));
const webhookUrl = computed(() => {
  return `${window.location.origin}/api/webhook/${authStore.user?.id || 'user-id'}`;
});

// API Permissions
const apiPermissions = ref([
  {
    id: 'read-jobs',
    name: 'Read Jobs',
    description: 'Allow reading job data via API',
    enabled: true
  },
  {
    id: 'write-jobs',
    name: 'Write Jobs',
    description: 'Allow creating and updating jobs via API',
    enabled: false
  },
  {
    id: 'read-machines',
    name: 'Read Machines',
    description: 'Allow reading machine data via API',
    enabled: true
  },
  {
    id: 'write-machines',
    name: 'Write Machines',
    description: 'Allow updating machine status via API',
    enabled: false
  },
  {
    id: 'read-users',
    name: 'Read Users',
    description: 'Allow reading user data via API',
    enabled: false
  }
]);

// Mapping Templates
interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  type: ImportType;
  mappings: ImportMapping[];
}

const mappingTemplates = ref<MappingTemplate[]>([
  {
    id: '1',
    name: 'ERP Job Import',
    description: 'Template for importing job data from ERP system',
    type: 'job-data',
    mappings: [
      { sourceField: 'job_number', targetField: 'jobNumber', required: true, complianceFlag: false },
      { sourceField: 'part_number', targetField: 'partNumber', required: true, complianceFlag: false },
      { sourceField: 'part_name', targetField: 'partName', required: true, complianceFlag: false },
      { sourceField: 'customer', targetField: 'customer', required: true, complianceFlag: false },
      { sourceField: 'quantity', targetField: 'quantity', required: true, complianceFlag: false },
      { sourceField: 'due_date', targetField: 'dueDate', required: true, complianceFlag: false },
      { sourceField: 'priority', targetField: 'priority', required: false, complianceFlag: false },
      { sourceField: 'export_control', targetField: 'exportControl', required: false, complianceFlag: true }
    ]
  }
]);

const editingTemplate = reactive<MappingTemplate>({
  id: '',
  name: '',
  description: '',
  type: 'job-data',
  mappings: []
});

// Compliance Settings
const complianceSettings = reactive({
  defaultLevel: 'basic',
  rules: [
    {
      id: 'itar-check',
      name: 'ITAR Compliance Check',
      description: 'Verify ITAR compliance for all imported jobs',
      enabled: true
    },
    {
      id: 'ear-check',
      name: 'EAR Compliance Check',
      description: 'Verify EAR compliance for all imported jobs',
      enabled: true
    },
    {
      id: 'cmmc-check',
      name: 'CMMC Compliance Check',
      description: 'Verify CMMC compliance for all imported jobs',
      enabled: false
    }
  ]
});

// Field options for mapping
const sourceFields = ref([
  'job_number', 'part_number', 'part_name', 'customer', 'quantity', 
  'due_date', 'priority', 'export_control', 'material', 'notes',
  'operator_id', 'machine_id', 'work_center', 'operation', 'setup_time',
  'cycle_time', 'material_cost', 'labor_cost', 'overhead_cost', 'total_cost',
  'customer_id', 'customer_name', 'contact_name', 'contact_email', 'contact_phone'
]);

const jobFields = [
  'jobNumber', 'partNumber', 'partName', 'customer', 'quantity',
  'dueDate', 'priority', 'exportControl', 'material', 'notes'
];

const operatorFields = [
  'operatorId', 'name', 'email', 'role', 'department',
  'employeeId', 'hireDate', 'phone', 'shift', 'skills'
];

const operationFields = [
  'operationNumber', 'name', 'description', 'workCenter',
  'machine', 'setupTime', 'cycleTime', 'status'
];

const costFields = [
  'materialCost', 'laborCost', 'overheadCost', 'totalCost',
  'setupCost', 'runCost', 'toolingCost'
];

const customerFields = [
  'customerId', 'name', 'industry', 'address', 'phone',
  'website', 'primaryContactName', 'primaryContactEmail'
];

// Methods
const getTargetFieldsForType = (type: ImportType) => {
  switch (type) {
    case 'job-data':
      return jobFields;
    case 'operator-workcenter':
      return operatorFields;
    case 'routing-operations':
      return operationFields;
    case 'cost-tracking':
      return costFields;
    case 'customer-association':
      return customerFields;
    default:
      return [];
  }
};

const saveSettings = async () => {
  saving.value = true;
  
  try {
    // In a real implementation, this would save to the database
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings');
  } finally {
    saving.value = false;
  }
};

const regenerateApiKey = async () => {
  try {
    const newApiKey = await settingsService.regenerateApiKey();
    if (newApiKey) {
      apiKey.value = newApiKey;
      alert('API key regenerated successfully');
    }
  } catch (error) {
    console.error('Error regenerating API key:', error);
    alert('Failed to regenerate API key');
  }
};

const regenerateWebhookSecret = () => {
  webhookSecret.value = Math.random().toString(36).substring(2, 15);
  alert('Webhook secret regenerated successfully');
};

const handleApiKeyCopied = () => {
  alert('API key copied to clipboard');
};

const handleWebhookSecretCopied = () => {
  alert('Webhook secret copied to clipboard');
};

const handleWebhookUrlCopied = () => {
  alert('Webhook URL copied to clipboard');
};

const editTemplate = (template: MappingTemplate) => {
  Object.assign(editingTemplate, { ...template });
  showAddTemplateModal.value = true;
};

const saveTemplate = async () => {
  savingTemplate.value = true;
  
  try {
    if (editingTemplate.id) {
      // Update existing template
      const index = mappingTemplates.value.findIndex(t => t.id === editingTemplate.id);
      if (index !== -1) {
        mappingTemplates.value[index] = { ...editingTemplate };
      }
    } else {
      // Add new template
      const newTemplate = {
        ...editingTemplate,
        id: Date.now().toString()
      };
      mappingTemplates.value.push(newTemplate);
    }
    
    showAddTemplateModal.value = false;
    
    // Reset form
    Object.assign(editingTemplate, {
      id: '',
      name: '',
      description: '',
      type: 'job-data',
      mappings: []
    });
  } catch (error) {
    console.error('Error saving template:', error);
    alert('Failed to save template');
  } finally {
    savingTemplate.value = false;
  }
};

const deleteTemplate = (templateId: string) => {
  if (confirm('Are you sure you want to delete this template?')) {
    mappingTemplates.value = mappingTemplates.value.filter(t => t.id !== templateId);
  }
};

onMounted(async () => {
  try {
    // Load settings
    const settings = await settingsService.fetchUserSettings();
    
    if (settings?.integrations) {
      apiKey.value = settings.integrations.apiKey || apiKey.value;
      webhookSecret.value = settings.integrations.webhookSecret || webhookSecret.value;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
});
</script>