<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organizations</h1>
        <p class="text-gray-600">Manage all customer organizations on the platform</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
        <button
          @click="showAddOrgModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Organization
        </button>
      </div>
    </div>

    <!-- Organizations List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">All Organizations</h3>
          <div class="flex space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search organizations..."
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <select
              v-model="statusFilter"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="org in filteredOrganizations" :key="org.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                  <div class="text-xs text-gray-500">{{ org.primaryContactEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.industry || 'Not specified' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.planName || 'No plan' }}</div>
                  <div v-if="org.subscriptionStatus" class="text-xs text-gray-500">{{ org.subscriptionStatus }}</div>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="editOrganization(org)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="viewOrgUsers(org)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Users
                  </button>
                  <button
                    @click="impersonateOrg(org)"
                    class="text-purple-600 hover:text-purple-900"
                  >
                    Impersonate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Organization Modal -->
    <div v-if="showAddOrgModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Organization</h3>
        
        <form @submit.prevent="addOrganization" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
            <input
              v-model="newOrg.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Acme Manufacturing"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              v-model="newOrg.industry"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Manufacturing"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Name</label>
            <input
              v-model="newOrg.primaryContactName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Email</label>
            <input
              v-model="newOrg.primaryContactEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
            <select
              v-model="newOrg.planId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No Plan</option>
              <option v-for="plan in adminStore.subscriptionPlans" :key="plan.id" :value="plan.id">
                {{ plan.name }} ({{ plan.interval }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
            <input
              v-model.number="newOrg.maxUsers"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingOrg"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingOrg ? 'Adding...' : 'Add Organization' }}
            </button>
            <button
              type="button"
              @click="showAddOrgModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Organization Modal -->
    <div v-if="showEditOrgModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Organization</h3>
        
        <form @submit.prevent="saveOrganization" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
            <input
              v-model="editingOrg.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              v-model="editingOrg.industry"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Name</label>
            <input
              v-model="editingOrg.primaryContactName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Email</label>
            <input
              v-model="editingOrg.primaryContactEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
            <select
              v-model="editingOrg.planId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No Plan</option>
              <option v-for="plan in adminStore.subscriptionPlans" :key="plan.id" :value="plan.id">
                {{ plan.name }} ({{ plan.interval }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
            <input
              v-model.number="editingOrg.maxUsers"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="editingOrg.isActive"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Active</label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="savingOrg"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingOrg ? 'Saving...' : 'Save Organization' }}
            </button>
            <button
              type="button"
              @click="showEditOrgModal = false"
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
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import type { Organization } from '../stores/admin';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const showAddOrgModal = ref(false);
const showEditOrgModal = ref(false);
const addingOrg = ref(false);
const savingOrg = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');

const newOrg = reactive({
  name: '',
  industry: '',
  primaryContactName: '',
  primaryContactEmail: '',
  planId: '',
  maxUsers: 10
});

const editingOrg = reactive<Organization>({
  id: '',
  name: '',
  industry: '',
  primaryContactName: '',
  primaryContactEmail: '',
  planId: '',
  maxUsers: 10,
  currentUserCount: 0,
  isActive: true,
  createdAt: ''
});

const filteredOrganizations = computed(() => {
  let filtered = adminStore.organizations;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(org => 
      org.name.toLowerCase().includes(query) || 
      org.industry?.toLowerCase().includes(query) ||
      org.primaryContactName?.toLowerCase().includes(query) ||
      org.primaryContactEmail?.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(org => 
      (statusFilter.value === 'active' && org.isActive) || 
      (statusFilter.value === 'inactive' && !org.isActive)
    );
  }
  
  return filtered;
});

const refreshData = async () => {
  try {
    await adminStore.fetchOrganizations();
    await adminStore.fetchSubscriptionPlans();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const addOrganization = async () => {
  addingOrg.value = true;
  try {
    const newOrgObj: Organization = {
      id: '',
      name: newOrg.name,
      industry: newOrg.industry,
      primaryContactName: newOrg.primaryContactName,
      primaryContactEmail: newOrg.primaryContactEmail,
      planId: newOrg.planId,
      maxUsers: newOrg.maxUsers,
      currentUserCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    await adminStore.saveOrganization(newOrgObj);
    showAddOrgModal.value = false;
    
    // Reset form
    Object.assign(newOrg, {
      name: '',
      industry: '',
      primaryContactName: '',
      primaryContactEmail: '',
      planId: '',
      maxUsers: 10
    });
  } catch (error) {
    console.error('Error adding organization:', error);
  } finally {
    addingOrg.value = false;
  }
};

const editOrganization = (org: Organization) => {
  Object.assign(editingOrg, org);
  showEditOrgModal.value = true;
};

const saveOrganization = async () => {
  savingOrg.value = true;
  try {
    await adminStore.saveOrganization(editingOrg);
    showEditOrgModal.value = false;
  } catch (error) {
    console.error('Error saving organization:', error);
  } finally {
    savingOrg.value = false;
  }
};

const viewOrgUsers = (org: Organization) => {
  // Navigate to organization users page
  console.log('View organization users:', org);
};

const impersonateOrg = (org: Organization) => {
  // Implement impersonation logic
  console.log('Impersonate organization:', org);
};

onMounted(async () => {
  await refreshData();
});
</script>
```