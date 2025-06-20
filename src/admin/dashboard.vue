<template>
  <div class="space-y-6">
    <!-- Platform Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">${{ (analytics.totalRevenue / 100).toFixed(2) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-green-600 font-medium">+{{ analytics.revenueGrowth }}% from last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.activeUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-blue-600 font-medium">+{{ analytics.userGrowth }}% from last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.conversionRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ArrowTrendingUpIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-purple-600 font-medium">+{{ analytics.conversionGrowth }}% from last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Churn Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.churnRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <ArrowTrendingDownIcon class="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div class="mt-2">
          <span class="text-sm text-green-600 font-medium">{{ analytics.churnChange }}% from last month</span>
        </div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
      </div>
      <div class="p-6">
        <div class="h-64">
          <!-- Chart would go here -->
          <div class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Organizations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Recent Organizations</h3>
          <router-link
            to="/admin/organizations"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="org in organizations.slice(0, 5)" :key="org.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.planName || 'No plan' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.currentUserCount }} / {{ org.maxUsers }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ org.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(org.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Plan Distribution -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Subscription Plan Distribution</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(count, plan) in analytics.planDistribution" :key="plan" class="bg-gray-50 rounded-lg p-4">
            <div class="text-lg font-semibold text-gray-900">{{ plan }}</div>
            <div class="text-3xl font-bold text-primary-600 mt-2">{{ count }}</div>
            <div class="text-sm text-gray-500 mt-1">subscribers</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import type { Organization } from '../stores/admin';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const analytics = ref(adminStore.analytics);
const organizations = ref<Organization[]>([]);

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

onMounted(async () => {
  try {
    await Promise.all([
      adminStore.fetchAnalytics(),
      adminStore.fetchOrganizations()
    ]);
    
    analytics.value = adminStore.analytics;
    organizations.value = adminStore.organizations;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
});
</script>
```