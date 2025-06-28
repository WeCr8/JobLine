<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">System Logs</h1>
        <p class="text-gray-600">View and analyze system activity logs</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshLogs"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
          <select
            v-model="logLevel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="ERROR">Error</option>
            <option value="DEBUG">Debug</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            v-model="dateRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">System Logs</h3>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDateTime(log.timestamp) }}</div>
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
                  <div class="text-sm text-gray-900">{{ getUserName(log.userId) || 'System' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ log.ipAddress || '-' }}</div>
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
import { format, subDays } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import { adminService } from '../services/admin.service';
import { getDateRangeStart } from '../utils/date.utils';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const logLevel = ref('all');
const dateRange = ref('week');
const searchQuery = ref('');

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
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

const getUserName = (userId: string | undefined) => {
  if (!userId) return null;
  const user = adminStore.users.find(u => u.id === userId);
  return user ? user.name : null;
};

const filteredLogs = computed(() => {
  let filtered = adminStore.systemLogs;
  
  // Apply log level filter
  if (logLevel.value !== 'all') {
    filtered = filtered.filter(log => log.level === logLevel.value);
  }
  
  // Apply date range filter
  if (dateRange.value !== 'all') {
    const startDate = getDateRangeStart(dateRange.value);
    filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(log => 
      log.message.toLowerCase().includes(query) || 
      (log.userId && getUserName(log.userId)?.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const refreshLogs = async () => {
  try {
    await adminStore.fetchSystemLogs();
  } catch (error) {
    console.error('Error refreshing logs:', error);
  }
};

onMounted(async () => {
  await refreshLogs();
  await adminStore.fetchUsers(); // To get user names for logs
});
</script>