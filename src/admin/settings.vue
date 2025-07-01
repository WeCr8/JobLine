<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
        <p class="text-gray-600">Configure global platform settings</p>
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

    <!-- Settings Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">System Settings</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveSettings" class="space-y-6">
          <!-- Stripe Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Stripe Integration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                <input
                  v-model="systemSettings.stripeSecretKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk_live_..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
                <input
                  v-model="systemSettings.stripeWebhookSecret"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="whsec_..."
                />
              </div>
            </div>
          </div>

          <!-- AI Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">AI Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                <input
                  v-model="systemSettings.openaiApiKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Model</label>
                <select
                  v-model="systemSettings.ai.defaultModel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                <input
                  v-model.number="systemSettings.ai.temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                <input
                  v-model.number="systemSettings.ai.maxTokens"
                  type="number"
                  min="100"
                  max="8000"
                  step="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Backup Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Backup Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center">
                  <input
                    v-model="systemSettings.backup.enabled"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Enable Automatic Backups</label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  v-model="systemSettings.backup.frequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Retention (days)</label>
                <input
                  v-model.number="systemSettings.backup.retentionDays"
                  type="number"
                  min="1"
                  max="365"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div class="flex items-end">
                <button
                  type="button"
                  @click="triggerBackup"
                  :disabled="backupInProgress"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {{ backupInProgress ? 'Backing up...' : 'Trigger Manual Backup' }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingSettings"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingSettings ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '../stores/admin.ts';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const savingSettings = ref(false);
const backupInProgress = ref(false);

const systemSettings = reactive({
  stripeSecretKey: '',
  stripeWebhookSecret: '',
  openaiApiKey: '',
  ai: {
    defaultModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  backup: {
    enabled: true,
    frequency: 'daily',
    retentionDays: 30
  }
});

const refreshData = async () => {
  try {
    await adminStore.fetchSystemSettings();
    
    // Update local state with fetched settings
    Object.assign(systemSettings, adminStore.systemSettings);
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const saveSettings = async () => {
  savingSettings.value = true;
  try {
    await adminStore.saveSystemSettings(systemSettings);
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings');
  } finally {
    savingSettings.value = false;
  }
};

const triggerBackup = async () => {
  backupInProgress.value = true;
  try {
    await adminStore.triggerManualBackup();
    alert('Backup completed successfully');
  } catch (error) {
    console.error('Error triggering backup:', error);
    alert('Error triggering backup');
  } finally {
    backupInProgress.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});
</script>