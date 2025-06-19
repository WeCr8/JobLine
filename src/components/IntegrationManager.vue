<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Chat Integrations</h3>
        <button
          @click="showAddModal = true"
          class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
        >
          Add Integration
        </button>
      </div>
    </div>

    <!-- Integration List -->
    <div v-if="chatStore.integrations.length === 0" class="p-6 text-center">
      <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500">No integrations configured</p>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="integration in chatStore.integrations"
        :key="integration.id"
        class="p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getIntegrationIcon(integration.type).bgColor"
            >
              <component :is="getIntegrationIcon(integration.type).icon" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ integration.name }}</h4>
              <p class="text-sm text-gray-600 capitalize">{{ integration.type }} Integration</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="integration.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ integration.enabled ? 'Active' : 'Disabled' }}
            </span>
            <button
              @click="testIntegration(integration.id)"
              :disabled="testing === integration.id"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              {{ testing === integration.id ? 'Testing...' : 'Test' }}
            </button>
          </div>
        </div>

        <!-- Triggers -->
        <div class="space-y-2">
          <h5 class="text-sm font-medium text-gray-900">Triggers:</h5>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="trigger in integration.triggers.filter(t => t.enabled)"
              :key="trigger.event"
              class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
            >
              {{ formatTriggerEvent(trigger.event) }}
            </span>
          </div>
        </div>

        <!-- Configuration Preview -->
        <div class="mt-3 p-2 bg-gray-50 rounded text-xs">
          <div v-if="integration.config.webhookUrl" class="truncate">
            <span class="text-gray-500">Webhook:</span> {{ integration.config.webhookUrl }}
          </div>
          <div v-if="integration.config.channelId" class="truncate">
            <span class="text-gray-500">Channel:</span> {{ integration.config.channelId }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add Integration Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Chat Integration</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select 
              v-model="newIntegration.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="slack">Slack</option>
              <option value="teams">Microsoft Teams</option>
              <option value="discord">Discord</option>
              <option value="webhook">Custom Webhook</option>
              <option value="email">Email Notifications</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Integration Name</label>
            <input
              v-model="newIntegration.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Production Alerts"
            />
          </div>

          <!-- Slack Configuration -->
          <div v-if="newIntegration.type === 'slack'" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Slack Webhook URL</label>
              <input
                v-model="newIntegration.config.webhookUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Channel</label>
              <input
                v-model="newIntegration.config.channelId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="#manufacturing-alerts"
              />
            </div>
          </div>

          <!-- Teams Configuration -->
          <div v-if="newIntegration.type === 'teams'" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Teams Webhook URL</label>
              <input
                v-model="newIntegration.config.webhookUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://outlook.office.com/webhook/..."
              />
            </div>
          </div>

          <!-- Email Configuration -->
          <div v-if="newIntegration.type === 'email'" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
              <textarea
                v-model="emailRecipients"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="manager@company.com, supervisor@company.com"
              ></textarea>
            </div>
          </div>

          <!-- Triggers Configuration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notification Triggers</label>
            <div class="space-y-2">
              <label
                v-for="trigger in availableTriggers"
                :key="trigger.event"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="selectedTriggers"
                  :value="trigger.event"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700">{{ trigger.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="handleAddIntegration"
            class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Add Integration
          </button>
          <button
            @click="cancelAdd"
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
import { ref, reactive } from 'vue';
import { useChatStore } from '../stores/chat';
import type { IntegrationConfig } from '../types/chat';
import {
  ChatBubbleLeftRightIcon,
  BoltIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';

const chatStore = useChatStore();
const showAddModal = ref(false);
const testing = ref<string | null>(null);
const emailRecipients = ref('');
const selectedTriggers = ref<string[]>([]);

const newIntegration = reactive({
  name: '',
  type: 'slack' as any,
  enabled: true,
  config: {} as any,
  triggers: [] as any[]
});

const availableTriggers = [
  { event: 'job-status-change', label: 'Job Status Changes' },
  { event: 'urgent-job', label: 'Urgent Job Alerts' },
  { event: 'quality-issue', label: 'Quality Issues' },
  { event: 'machine-down', label: 'Machine Downtime' },
  { event: 'chat-mention', label: 'Chat Mentions' }
];

const getIntegrationIcon = (type: string) => {
  const icons = {
    'slack': { icon: ChatBubbleLeftRightIcon, bgColor: 'bg-purple-100 text-purple-600' },
    'teams': { icon: ChatBubbleLeftRightIcon, bgColor: 'bg-blue-100 text-blue-600' },
    'discord': { icon: ChatBubbleLeftRightIcon, bgColor: 'bg-indigo-100 text-indigo-600' },
    'webhook': { icon: BoltIcon, bgColor: 'bg-green-100 text-green-600' },
    'email': { icon: EnvelopeIcon, bgColor: 'bg-orange-100 text-orange-600' }
  };
  return icons[type as keyof typeof icons] || icons.webhook;
};

const formatTriggerEvent = (event: string) => {
  return event.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const testIntegration = async (integrationId: string) => {
  testing.value = integrationId;
  try {
    const success = await chatStore.testIntegration(integrationId);
    if (success) {
      alert('Integration test successful!');
    } else {
      alert('Integration test failed. Please check your configuration.');
    }
  } finally {
    testing.value = null;
  }
};

const handleAddIntegration = async () => {
  // Process email recipients
  if (newIntegration.type === 'email') {
    newIntegration.config.emailRecipients = emailRecipients.value
      .split(',')
      .map(email => email.trim())
      .filter(email => email);
  }

  // Create triggers
  newIntegration.triggers = selectedTriggers.value.map(event => ({
    event,
    enabled: true,
    message: `JobLine.ai Alert: ${formatTriggerEvent(event)}`
  }));

  await chatStore.addIntegration(newIntegration);
  cancelAdd();
};

const cancelAdd = () => {
  showAddModal.value = false;
  Object.assign(newIntegration, {
    name: '',
    type: 'slack',
    enabled: true,
    config: {},
    triggers: []
  });
  emailRecipients.value = '';
  selectedTriggers.value = [];
};
</script>