<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p class="text-gray-600">Configure your organization's preferences and settings</p>
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

    <!-- Organization Profile -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Organization Profile</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                v-model="profile.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                v-model="profile.industry"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                v-model="profile.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                v-model="profile.phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                v-model="profile.website"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                v-model="profile.logoUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Primary Contact</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  v-model="profile.primaryContactName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profile.primaryContactEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  v-model="profile.primaryContactPhone"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingProfile"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingProfile ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Application Settings -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Application Settings</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveAppSettings" class="space-y-6">
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Default Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
                <select
                  v-model="appSettings.defaultDepartment"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">None</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                <select
                  v-model="appSettings.defaultRole"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="operator">Operator</option>
                  <option value="lead">Lead</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Feature Settings</h4>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  v-model="appSettings.features.enableVoice"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Enable Voice Assistant</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="appSettings.features.enableImageRecognition"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Enable Image Recognition</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="appSettings.features.enablePerformanceModule"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Enable Performance Module</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="appSettings.features.enableOptimizationModule"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Enable Optimization Module</label>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Notification Settings</h4>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  v-model="appSettings.notifications.emailAlerts"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Email Alerts</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="appSettings.notifications.smsAlerts"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">SMS Alerts</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="appSettings.notifications.pushNotifications"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Push Notifications</label>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingAppSettings"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingAppSettings ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Subscription Information -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Subscription</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Current Plan</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-lg font-semibold text-gray-900">{{ subscription.planName }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ subscription.description }}</div>
              <div class="mt-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getSubscriptionStatusClass(subscription.status)"
                >
                  {{ subscription.status.toUpperCase() }}
                </span>
              </div>
              <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-gray-500">Price:</span>
                  <span class="font-medium text-gray-900">${{ (subscription.price / 100).toFixed(2) }}/{{ subscription.interval }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Next Billing:</span>
                  <span class="font-medium text-gray-900">{{ formatDate(subscription.nextBillingDate) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">User Limit:</span>
                  <span class="font-medium text-gray-900">{{ subscription.maxUsers }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Current Users:</span>
                  <span class="font-medium text-gray-900">{{ subscription.currentUsers }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                @click="manageBilling"
                class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Manage Billing
              </button>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Plan Features</h4>
            <ul class="space-y-2">
              <li v-for="feature in subscription.features" :key="feature" class="flex items-start space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { format } from 'date-fns';
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

// Mock data - in a real app, this would come from the database
const profile = reactive({
  name: 'Acme Manufacturing',
  industry: 'Manufacturing',
  address: '123 Main St, Anytown, USA',
  phone: '(555) 123-4567',
  website: 'https://acme-manufacturing.com',
  logoUrl: '',
  primaryContactName: 'John Smith',
  primaryContactEmail: 'john@acme-manufacturing.com',
  primaryContactPhone: '(555) 987-6543'
});

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining'
  },
  {
    id: 'quality-control',
    name: 'Quality Control'
  },
  {
    id: 'administration',
    name: 'Administration'
  }
]);

const appSettings = reactive({
  defaultDepartment: 'cnc-machining',
  defaultRole: 'operator',
  features: {
    enableVoice: true,
    enableImageRecognition: true,
    enablePerformanceModule: true,
    enableOptimizationModule: true
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true
  }
});

const subscription = reactive({
  planName: 'Pro Plan',
  description: 'Advanced features for growing teams',
  status: 'active',
  price: 4999,
  interval: 'month',
  nextBillingDate: '2024-02-15T00:00:00Z',
  maxUsers: 25,
  currentUsers: 12,
  features: [
    'All Basic features',
    'Advanced AI optimization',
    'Custom integrations',
    'Priority support',
    'Advanced reporting',
    'API access'
  ]
});

const savingProfile = ref(false);
const savingAppSettings = ref(false);

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const getSubscriptionStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'trialing': 'bg-blue-100 text-blue-800',
    'past_due': 'bg-yellow-100 text-yellow-800',
    'canceled': 'bg-red-100 text-red-800',
    'incomplete': 'bg-orange-100 text-orange-800',
    'incomplete_expired': 'bg-gray-100 text-gray-800',
    'unpaid': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const saveProfile = async () => {
  savingProfile.value = true;
  try {
    // In a real app, you would implement this
    console.log('Saving profile:', profile);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Profile saved successfully');
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  } finally {
    savingProfile.value = false;
  }
};

const saveAppSettings = async () => {
  savingAppSettings.value = true;
  try {
    // In a real app, you would implement this
    console.log('Saving app settings:', appSettings);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving app settings:', error);
    alert('Error saving settings');
  } finally {
    savingAppSettings.value = false;
  }
};

const manageBilling = () => {
  // In a real app, you would redirect to a billing management page
  console.log('Manage billing');
  alert('Redirecting to billing management...');
};

onMounted(async () => {
  await refreshData();
});
</script>
```