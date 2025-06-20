<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
        <p class="text-gray-600">Overview of your organization's performance and activity</p>
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

    <!-- Organization Info Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ organization.name }}</h2>
            <p class="text-gray-600">{{ organization.industry }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">Subscription</div>
            <div class="text-lg font-semibold text-gray-900">{{ organization.planName || 'No Plan' }}</div>
            <span 
              v-if="organization.subscriptionStatus"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getSubscriptionStatusClass(organization.subscriptionStatus)"
            >
              {{ organization.subscriptionStatus.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ organization.currentUserCount }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-gray-600">{{ organization.maxUsers - organization.currentUserCount }} seats available</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Departments</p>
            <p class="text-2xl font-bold text-gray-900">{{ departments.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeJobs }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BriefcaseIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Machines</p>
            <p class="text-2xl font-bold text-gray-900">{{ machines.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CogIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="getActivityIconClass(activity.type)"
            >
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <span class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <div v-if="activity.user" class="text-xs text-gray-500 mt-1">
                By {{ activity.user }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Department Performance -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Department Performance</h3>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="dept in departments" :key="dept.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ dept.name }}</div>
                  <div class="text-xs text-gray-500 capitalize">{{ dept.department_type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ dept.active_jobs }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full"
                        :style="{ width: `${dept.efficiency}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-900">{{ dept.efficiency }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-blue-500 h-2 rounded-full"
                        :style="{ width: `${dept.utilization_rate}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-900">{{ dept.utilization_rate }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ dept.supervisor }}</div>
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
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CogIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/vue/24/outline';

// Mock data - in a real app, this would come from the database
const organization = ref({
  id: 'org-1',
  name: 'Acme Manufacturing',
  industry: 'Manufacturing',
  address: '123 Main St, Anytown, USA',
  phone: '(555) 123-4567',
  website: 'https://acme-manufacturing.com',
  logoUrl: '',
  primaryContactName: 'John Smith',
  primaryContactEmail: 'john@acme-manufacturing.com',
  subscriptionId: 'sub_123456',
  subscriptionStatus: 'active',
  planId: 'plan-1',
  planName: 'Pro Plan',
  maxUsers: 25,
  currentUserCount: 12,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-12T00:00:00Z'
});

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining',
    description: 'Computer-controlled precision machining operations',
    department_type: 'production',
    supervisor: 'Sarah Johnson',
    supervisor_id: 'user-2',
    operators: ['user-3'],
    active_jobs: 5,
    efficiency: 87,
    utilization_rate: 92
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: 'Quality assurance and inspection',
    department_type: 'support',
    supervisor: 'John Smith',
    supervisor_id: 'user-1',
    operators: [],
    active_jobs: 0,
    efficiency: 95,
    utilization_rate: 78
  }
]);

const activeJobs = ref(5);
const machines = ref([
  { id: 'machine-1', name: 'CNC-001', status: 'running' },
  { id: 'machine-2', name: 'CNC-002', status: 'idle' },
  { id: 'machine-3', name: 'CNC-003', status: 'maintenance' }
]);

const recentActivity = ref([
  {
    type: 'user',
    title: 'New User Added',
    description: 'Mike Wilson was added to the CNC Machining department',
    user: 'John Smith',
    timestamp: '2024-01-12T14:30:00Z'
  },
  {
    type: 'job',
    title: 'Job Status Updated',
    description: 'Job J2024-001 status changed from setup to running',
    user: 'Sarah Johnson',
    timestamp: '2024-01-12T13:15:00Z'
  },
  {
    type: 'alert',
    title: 'Machine Maintenance Alert',
    description: 'CNC-003 scheduled for maintenance tomorrow',
    user: 'System',
    timestamp: '2024-01-12T10:45:00Z'
  }
]);

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
};

const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, HH:mm');
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

const getActivityIcon = (type: string) => {
  const icons = {
    'user': UserIcon,
    'job': BriefcaseIcon,
    'alert': BellIcon,
    'document': DocumentTextIcon
  };
  return icons[type as keyof typeof icons] || BellIcon;
};

const getActivityIconClass = (type: string) => {
  const classes = {
    'user': 'bg-blue-100 text-blue-600',
    'job': 'bg-green-100 text-green-600',
    'alert': 'bg-red-100 text-red-600',
    'document': 'bg-purple-100 text-purple-600'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600';
};

onMounted(async () => {
  await refreshData();
});
</script>
```