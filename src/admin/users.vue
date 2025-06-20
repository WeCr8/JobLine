<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Users</h1>
        <p class="text-gray-600">Manage all users across the platform</p>
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
          @click="showAddUserModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Platform Admin
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            v-model="roleFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Platform Admin</option>
            <option value="organization_admin">Organization Admin</option>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
            <option value="lead">Lead</option>
            <option value="operator">Operator</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getRoleClass(user.role)"
                  >
                    {{ formatRole(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="user.organization_id" class="text-sm text-gray-900">
                    {{ getOrgName(user.organization_id) }}
                  </div>
                  <div v-else class="text-sm text-gray-500">Platform Admin</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                  >
                    {{ user.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button
                    v-if="user.organization_id"
                    @click="impersonateUser(user)"
                    class="text-purple-600 hover:text-purple-900 ml-3"
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

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Platform Admin</h3>
        
        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Admin User"
            />
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-2">
              This user will be created as a platform admin with full access to all organizations and settings.
            </p>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingUser"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingUser ? 'Adding...' : 'Add Admin' }}
            </button>
            <button
              type="button"
              @click="showAddUserModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="editingUser.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="editingUser.email"
              type="email"
              required
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="editingUser.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="admin">Platform Admin</option>
              <option value="organization_admin">Organization Admin</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="lead">Lead</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <div v-if="editingUser.role !== 'admin'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <select
              v-model="editingUser.organization_id"
              :required="editingUser.role !== 'admin'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None (Platform Admin)</option>
              <option v-for="org in adminStore.organizations" :key="org.id" :value="org.id">
                {{ org.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="editingUser.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Active</label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="savingUser"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingUser ? 'Saving...' : 'Save User' }}
            </button>
            <button
              type="button"
              @click="showEditUserModal = false"
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
import type { User } from '../stores/admin';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const addingUser = ref(false);
const savingUser = ref(false);
const searchQuery = ref('');
const roleFilter = ref('all');
const statusFilter = ref('all');

const newUser = reactive({
  email: '',
  name: '',
  password: ''
});

const editingUser = reactive<User>({
  id: '',
  name: '',
  email: '',
  role: '',
  department: '',
  is_active: true,
  created_at: ''
});

const filteredUsers = computed(() => {
  let filtered = adminStore.users;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  // Apply role filter
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => 
      (statusFilter.value === 'active' && user.is_active) || 
      (statusFilter.value === 'inactive' && !user.is_active)
    );
  }
  
  return filtered;
});

const refreshData = async () => {
  try {
    await adminStore.fetchUsers();
    await adminStore.fetchOrganizations();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatRole = (role: string) => {
  if (role === 'organization_admin') return 'Org Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getRoleClass = (role: string) => {
  const classes = {
    'admin': 'bg-red-100 text-red-800',
    'organization_admin': 'bg-purple-100 text-purple-800',
    'manager': 'bg-blue-100 text-blue-800',
    'supervisor': 'bg-indigo-100 text-indigo-800',
    'lead': 'bg-green-100 text-green-800',
    'operator': 'bg-gray-100 text-gray-800'
  };
  return classes[role as keyof typeof classes] || classes.operator;
};

const getOrgName = (orgId: string) => {
  const org = adminStore.organizations.find(o => o.id === orgId);
  return org ? org.name : 'Unknown Organization';
};

const addUser = async () => {
  addingUser.value = true;
  try {
    // In a real app, you would call an API to create the user
    // For now, we'll just simulate it
    console.log('Adding platform admin:', newUser);
    
    // Reset form and close modal
    Object.assign(newUser, {
      email: '',
      name: '',
      password: ''
    });
    showAddUserModal.value = false;
    
    // Refresh data
    await refreshData();
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    addingUser.value = false;
  }
};

const editUser = (user: User) => {
  Object.assign(editingUser, user);
  showEditUserModal.value = true;
};

const saveUser = async () => {
  savingUser.value = true;
  try {
    await adminStore.updateUser(editingUser);
    showEditUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  } finally {
    savingUser.value = false;
  }
};

const toggleUserStatus = async (user: User) => {
  try {
    const updatedUser = { ...user, is_active: !user.is_active };
    await adminStore.updateUser(updatedUser);
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

const impersonateUser = (user: User) => {
  // Implement impersonation logic
  console.log('Impersonate user:', user);
};

onMounted(async () => {
  await refreshData();
});
</script>
```