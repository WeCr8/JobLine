<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-600">Configure your JobLine.ai experience</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="saveAllSettings"
          :disabled="saving"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
        >
          {{ saving ? 'Saving...' : 'Save All Settings' }}
        </button>
      </div>
    </div>

    <!-- Settings Tabs -->
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

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <SettingsCard title="Profile Settings">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="userSettings.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="userSettings.email"
              type="email"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              v-model="userSettings.department"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              v-model="userSettings.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Password">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              v-model="passwordSettings.currentPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              v-model="passwordSettings.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              v-model="passwordSettings.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div class="flex justify-end">
            <button
              @click="updatePassword"
              :disabled="!canUpdatePassword || updatingPassword"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ updatingPassword ? 'Updating...' : 'Update Password' }}
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <SettingsCard title="Notification Preferences">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p class="text-sm text-gray-500">Receive important updates via email</p>
            </div>
            <div>
              <ToggleSwitch v-model="notificationSettings.emailEnabled" />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">Push Notifications</h4>
              <p class="text-sm text-gray-500">Receive notifications in your browser</p>
            </div>
            <div>
              <ToggleSwitch v-model="notificationSettings.pushEnabled" />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">SMS Notifications</h4>
              <p class="text-sm text-gray-500">Receive urgent alerts via text message</p>
            </div>
            <div>
              <ToggleSwitch v-model="notificationSettings.smsEnabled" />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Notification Events">
        <div class="space-y-4">
          <NotificationEventSetting
            v-for="event in notificationEvents"
            :key="event.id"
            :event="event"
            :email-enabled="notificationSettings.emailEnabled"
            :push-enabled="notificationSettings.pushEnabled"
            :sms-enabled="notificationSettings.smsEnabled"
          />
        </div>
      </SettingsCard>
    </div>

    <!-- Appearance Tab -->
    <div v-if="activeTab === 'appearance'" class="space-y-6">
      <SettingsCard title="Theme Settings">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="theme in themes"
                :key="theme.id"
                @click="appearanceSettings.theme = theme.id"
                class="border rounded-lg p-4 cursor-pointer"
                :class="appearanceSettings.theme === theme.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="h-12 rounded-md mb-2" :class="theme.previewClass"></div>
                <div class="text-sm font-medium text-center">{{ theme.name }}</div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Density</label>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="density in densities"
                :key="density.id"
                @click="appearanceSettings.density = density.id"
                class="border rounded-lg p-4 cursor-pointer"
                :class="appearanceSettings.density === density.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="flex flex-col items-center justify-center h-12 mb-2">
                  <div class="w-full h-2 bg-gray-200 rounded mb-1" v-if="density.id === 'compact'"></div>
                  <div class="w-full h-2 bg-gray-200 rounded mb-1"></div>
                  <div class="w-full h-2 bg-gray-200 rounded mb-1"></div>
                  <div class="w-full h-2 bg-gray-200 rounded" v-if="density.id === 'comfortable'"></div>
                </div>
                <div class="text-sm font-medium text-center">{{ density.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Dashboard Layout">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Default View</label>
            <select
              v-model="appearanceSettings.defaultView"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="dashboard">Dashboard</option>
              <option value="jobs">Jobs</option>
              <option value="machines">Machines</option>
              <option value="chat">Chat</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Widget Visibility</label>
            <div class="space-y-2">
              <div v-for="widget in dashboardWidgets" :key="widget.id" class="flex items-center justify-between">
                <div class="text-sm text-gray-900">{{ widget.name }}</div>
                <ToggleSwitch v-model="widget.visible" />
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>

    <!-- Integrations Tab -->
    <div v-if="activeTab === 'integrations'" class="space-y-6">
      <SettingsCard title="Connected Services">
        <div class="space-y-4">
          <ConnectedServiceCard
            v-for="service in connectedServices"
            :key="service.id"
            :service="service"
            @toggle="toggleServiceConnection"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="API Access">
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-900">API Key</h4>
              <button
                @click="regenerateApiKey"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Regenerate
              </button>
            </div>
            <div class="flex">
              <input
                type="text"
                readonly
                :value="integrationSettings.apiKey"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm"
              />
              <button
                @click="copyApiKey"
                class="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200"
              >
                <ClipboardIcon class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Use this key to authenticate API requests</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">API Permissions</h4>
            <div class="space-y-2">
              <div v-for="permission in apiPermissions" :key="permission.id" class="flex items-center justify-between">
                <div class="text-sm text-gray-900">{{ permission.name }}</div>
                <ToggleSwitch v-model="permission.enabled" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Webhook URL</h4>
            <div class="flex">
              <input
                type="text"
                readonly
                :value="webhookUrl"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm"
              />
              <button
                @click="copyWebhookUrl"
                class="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200"
              >
                <ClipboardIcon class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Use this URL to receive webhook notifications</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Chat Provider Integration">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Chat Provider</label>
            <select v-model="chatProviderSettings.provider" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
              <option value="dummy">Dummy (Echo Bot)</option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="custom">Custom API</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Choose your chat provider. Dummy is for testing only.</p>
          </div>
          <div v-if="chatProviderSettings.provider === 'openai'">
            <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
            <input v-model="chatProviderSettings.apiKey" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="sk-..." />
            <p class="text-xs text-gray-500 mt-1">Find your API key at <a href='https://platform.openai.com/account/api-keys' target='_blank' class='text-primary-600 underline'>OpenAI Dashboard</a>.</p>
          </div>
          <div v-if="chatProviderSettings.provider === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
            <input v-model="chatProviderSettings.endpoint" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="https://api.example.com/chat" />
            <label class="block text-sm font-medium text-gray-700 mb-2 mt-4">API Key</label>
            <input v-model="chatProviderSettings.apiKey" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="Your API Key" />
            <p class="text-xs text-gray-500 mt-1">Enter your custom chat API endpoint and key.</p>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="testChatProvider" :disabled="testingChatProvider" class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200">
              {{ testingChatProvider ? 'Testing...' : 'Test Connection' }}
            </button>
            <span v-if="chatProviderTestResult" :class="chatProviderTestResult === 'success' ? 'text-green-600' : 'text-red-600'">
              {{ chatProviderTestResult === 'success' ? 'Success!' : 'Failed to connect' }}
            </span>
          </div>
        </div>
      </SettingsCard>
    </div>

    <!-- Privacy & Security Tab -->
    <div v-if="activeTab === 'privacy'" class="space-y-6">
      <SecuritySettingsCard
        :two-factor-enabled="securitySettings.twoFactorEnabled"
        :session-timeout="securitySettings.sessionTimeout"
        @update:two-factor-enabled="securitySettings.twoFactorEnabled = $event"
        @update:session-timeout="securitySettings.sessionTimeout = $event"
        @verify="verifyTwoFactor"
      />

      <PrivacySettingsCard
        :analytics-enabled="privacySettings.analyticsEnabled"
        :error-reporting-enabled="privacySettings.errorReportingEnabled"
        :marketing-enabled="privacySettings.marketingEnabled"
        @update:analytics-enabled="privacySettings.analyticsEnabled = $event"
        @update:error-reporting-enabled="privacySettings.errorReportingEnabled = $event"
        @update:marketing-enabled="privacySettings.marketingEnabled = $event"
      />

      <DataManagementCard
        @export-data="exportUserData"
        @delete-account="showDeleteAccountModal = true"
      />
    </div>

    <!-- Delete Account Modal -->
    <DeleteAccountModal
      v-if="showDeleteAccountModal"
      @confirm="deleteAccount"
      @cancel="showDeleteAccountModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
import { useSettingsStore } from '../stores/settings.ts';
import SettingsCard from '../components/SettingsCard.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import SecuritySettingsCard from '../components/SecuritySettingsCard.vue';
import PrivacySettingsCard from '../components/PrivacySettingsCard.vue';
import DataManagementCard from '../components/DataManagementCard.vue';
import DeleteAccountModal from '../components/DeleteAccountModal.vue';
import NotificationEventSetting from '../components/NotificationEventSetting.vue';
import ConnectedServiceCard from '../components/ConnectedServiceCard.vue';
import { settingsService } from '../services/settings.service';
import {
  UserIcon,
  BellIcon,
  PaintBrushIcon,
  LinkIcon,
  ShieldCheckIcon,
  ClipboardIcon,
  CloudIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const activeTab = ref('general');
const saving = ref(false);
const updatingPassword = ref(false);
const showDeleteAccountModal = ref(false);

const tabs = [
  { id: 'general', name: 'General', icon: UserIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  { id: 'integrations', name: 'Integrations', icon: LinkIcon },
  { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon }
];

// Mock departments data
const departments = ref([
  { id: 'cnc-machining', name: 'CNC Machining' },
  { id: 'quality-control', name: 'Quality Control' },
  { id: 'assembly', name: 'Assembly' },
  { id: 'shipping', name: 'Shipping & Receiving' }
]);

// User settings
const userSettings = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  department: authStore.user?.department || '',
  phone: ''
});

// Password settings
const passwordSettings = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Notification settings
const notificationSettings = reactive({
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: false
});

// Notification events
const notificationEvents = reactive([
  {
    id: 'job-status',
    name: 'Job Status Changes',
    description: 'Notify when job status changes',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'machine-status',
    name: 'Machine Status Changes',
    description: 'Notify when machine status changes',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'quality-issues',
    name: 'Quality Issues',
    description: 'Notify when quality issues are detected',
    email: true,
    push: true,
    sms: true
  },
  {
    id: 'due-dates',
    name: 'Upcoming Due Dates',
    description: 'Notify about upcoming job due dates',
    email: true,
    push: false,
    sms: false
  },
  {
    id: 'mentions',
    name: 'Mentions',
    description: 'Notify when you are mentioned in comments',
    email: false,
    push: true,
    sms: false
  }
]);

// Appearance settings
const appearanceSettings = reactive({
  theme: 'light',
  density: 'comfortable',
  defaultView: 'dashboard'
});

// Themes
const themes = [
  { id: 'light', name: 'Light', previewClass: 'bg-white' },
  { id: 'dark', name: 'Dark', previewClass: 'bg-gray-800' },
  { id: 'system', name: 'System', previewClass: 'bg-gradient-to-r from-white to-gray-800' }
];

// Densities
const densities = [
  { id: 'compact', name: 'Compact' },
  { id: 'comfortable', name: 'Comfortable' },
  { id: 'spacious', name: 'Spacious' }
];

// Dashboard widgets
const dashboardWidgets = reactive([
  { id: 'job-status', name: 'Job Status', visible: true },
  { id: 'machine-status', name: 'Machine Status', visible: true },
  { id: 'performance', name: 'Performance Metrics', visible: true },
  { id: 'recent-passdown', name: 'Recent Passdown Notes', visible: true },
  { id: 'quick-chat', name: 'Quick Chat', visible: true }
]);

// Integration settings
const integrationSettings = reactive({
  apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
  webhookSecret: Math.random().toString(36).substring(2, 15)
});

interface ConnectedService {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  icon: any;
  bgColor: string;
}

// Connected services
const connectedServices = reactive<ConnectedService[]>([
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    status: 'connected',
    icon: CloudIcon,
    bgColor: 'bg-green-100 text-green-600'
  },
  {
    id: 'slack',
    name: 'Slack',
    status: 'connected',
    icon: ChatBubbleLeftRightIcon,
    bgColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'erp',
    name: 'ERP System',
    status: 'disconnected',
    icon: GlobeAltIcon,
    bgColor: 'bg-blue-100 text-blue-600'
  }
]);

// API permissions
const apiPermissions = reactive([
  { id: 'read-jobs', name: 'Read Jobs', enabled: true },
  { id: 'write-jobs', name: 'Write Jobs', enabled: false },
  { id: 'read-machines', name: 'Read Machines', enabled: true },
  { id: 'write-machines', name: 'Write Machines', enabled: false },
  { id: 'read-users', name: 'Read Users', enabled: false }
]);

// Security settings
const securitySettings = reactive({
  twoFactorEnabled: false,
  verificationCode: '',
  sessionTimeout: '60'
});

// Privacy settings
const privacySettings = reactive({
  analyticsEnabled: true,
  errorReportingEnabled: true,
  marketingEnabled: false
});

// Chat Provider Integration state
const chatProviderSettings = reactive({
  provider: 'dummy',
  apiKey: '',
  endpoint: ''
});
const testingChatProvider = ref(false);
const chatProviderTestResult = ref('');

// Computed properties
const canUpdatePassword = computed(() => {
  return (
    passwordSettings.currentPassword.length > 0 &&
    passwordSettings.newPassword.length >= 8 &&
    passwordSettings.newPassword === passwordSettings.confirmPassword
  );
});

const webhookUrl = computed(() => {
  return `${window.location.origin}/api/webhook/${authStore.user?.id || 'user-id'}`;
});

// Methods
const saveAllSettings = async () => {
  saving.value = true;
  try {
    // Save user profile
    await settingsService.updateUserProfile({
      name: userSettings.name,
      department: userSettings.department,
      phone: userSettings.phone
    });
    
    // Save notification settings
    await settingsService.updateNotificationSettings({
      emailEnabled: notificationSettings.emailEnabled,
      pushEnabled: notificationSettings.pushEnabled,
      smsEnabled: notificationSettings.smsEnabled,
      events: notificationEvents
    });
    
    // Save appearance settings
    await settingsService.updateAppearanceSettings({
      theme: appearanceSettings.theme,
      density: appearanceSettings.density,
      defaultView: appearanceSettings.defaultView,
      dashboardWidgets: dashboardWidgets
    });
    
    // Save security settings
    await settingsService.updateSecuritySettings({
      sessionTimeout: parseInt(securitySettings.sessionTimeout)
    });
    
    // Save privacy settings
    await settingsService.updatePrivacySettings({
      analyticsEnabled: privacySettings.analyticsEnabled,
      errorReportingEnabled: privacySettings.errorReportingEnabled,
      marketingEnabled: privacySettings.marketingEnabled
    });
    
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings');
  } finally {
    saving.value = false;
  }
};

const updatePassword = async () => {
  if (!canUpdatePassword.value) return;
  
  updatingPassword.value = true;
  try {
    await settingsService.updatePassword(
      passwordSettings.currentPassword,
      passwordSettings.newPassword
    );
    
    // Reset password fields
    passwordSettings.currentPassword = '';
    passwordSettings.newPassword = '';
    passwordSettings.confirmPassword = '';
    
    alert('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
    alert('Failed to update password');
  } finally {
    updatingPassword.value = false;
  }
};

const toggleServiceConnection = async (service: any) => {
  try {
    if (service.status === 'connected') {
      await settingsService.disconnectService(service.id);
      service.status = 'disconnected';
    } else {
      // In demo mode, simulate a successful connection
      if (import.meta.env.VITE_DEMO_MODE === 'true') {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        service.status = 'connected';
        return;
      }
      
      await settingsService.connectService(service.id);
      service.status = 'connected';
    }
  } catch (error) {
    console.error(`Error toggling service ${service.id}:`, error);
    alert(`Failed to ${service.status === 'connected' ? 'disconnect' : 'connect'} service`);
  }
};

const regenerateApiKey = async () => {
  try {
    const newApiKey = await settingsService.regenerateApiKey();
    integrationSettings.apiKey = newApiKey || '';
    alert('API key regenerated successfully');
  } catch (error) {
    console.error('Error regenerating API key:', error);
    alert('Failed to regenerate API key');
  }
};

const copyApiKey = () => {
  navigator.clipboard.writeText(integrationSettings.apiKey);
  alert('API key copied to clipboard');
};

const copyWebhookUrl = () => {
  navigator.clipboard.writeText(webhookUrl.value);
  alert('Webhook URL copied to clipboard');
};

const verifyTwoFactor = async (code: string) => {
  try {
    const success = await settingsService.verifyTwoFactor(code);
    if (success) {
      alert('Two-factor authentication enabled successfully');
    } else {
      alert('Invalid verification code');
    }
  } catch (error) {
    console.error('Error verifying two-factor code:', error);
    alert('Failed to verify two-factor code');
  }
};

const exportUserData = async () => {
  try {
    await settingsService.exportUserData();
    alert('Data export initiated. You will receive an email with your data shortly.');
  } catch (error) {
    console.error('Error exporting user data:', error);
    alert('Failed to export user data');
  }
};

const deleteAccount = async () => {
  try {
    await settingsService.deleteAccount();
    alert('Account deleted successfully');
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error deleting account:', error);
    alert('Failed to delete account');
  } finally {
    showDeleteAccountModal.value = false;
  }
};

const testChatProvider = async () => {
  testingChatProvider.value = true;
  chatProviderTestResult.value = '';
  try {
    // Simulate a test connection (replace with real API call as needed)
    await new Promise(resolve => setTimeout(resolve, 800));
    if (chatProviderSettings.provider === 'dummy') {
      chatProviderTestResult.value = 'success';
    } else if (chatProviderSettings.provider === 'openai' && chatProviderSettings.apiKey.startsWith('sk-')) {
      chatProviderTestResult.value = 'success';
    } else if (chatProviderSettings.provider === 'custom' && chatProviderSettings.endpoint && chatProviderSettings.apiKey) {
      chatProviderTestResult.value = 'success';
    } else {
      chatProviderTestResult.value = 'error';
    }
  } catch (e) {
    chatProviderTestResult.value = 'error';
  } finally {
    testingChatProvider.value = false;
  }
};

onMounted(async () => {
  try {
    // Load user settings
    const settings = await settingsStore.fetchUserSettings();
    if (settings) {
      // Update reactive objects with fetched settings
      Object.assign(userSettings, settings.profile);
      Object.assign(notificationSettings, settings.notifications);
      Object.assign(appearanceSettings, settings.appearance);
      
      // Update notification events
      if (settings.notifications.events) {
        settings.notifications.events.forEach((event: any) => {
          const existingEvent = notificationEvents.find(e => e.id === event.id);
          if (existingEvent) {
            Object.assign(existingEvent, event);
          }
        });
      }
      
      // Update dashboard widgets
      if (settings.appearance.dashboardWidgets) {
        settings.appearance.dashboardWidgets.forEach((widget: any) => {
          const existingWidget = dashboardWidgets.find(w => w.id === widget.id);
          if (existingWidget) {
            existingWidget.visible = widget.visible;
          }
        });
      }
      
      // Update security settings
      if (settings.security) {
        securitySettings.twoFactorEnabled = settings.security.twoFactorEnabled || false;
        securitySettings.sessionTimeout = settings.security.sessionTimeout?.toString() || '60';
      }
      
      // Update privacy settings
      if (settings.privacy) {
        Object.assign(privacySettings, settings.privacy);
      }
      
      // Update integration settings
      if (settings.integrations) {
        integrationSettings.apiKey = settings.integrations.apiKey || integrationSettings.apiKey;
        integrationSettings.webhookSecret = settings.integrations.webhookSecret || integrationSettings.webhookSecret;
        
        // Update connected services
        if (settings.integrations.connectedServices) {
          settings.integrations.connectedServices.forEach((serviceId: string) => {
            const service = connectedServices.find(s => s.id === serviceId);
            if (service) {
              service.status = 'connected';
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
});
</script>