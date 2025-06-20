<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organization Users</h1>
        <p class="text-gray-600">Manage users and permissions within your organization</p>
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
          @click="showInviteModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Invite User
        </button>
      </div>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
          <div class="flex space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <select
              v-model="roleFilter"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="organization_admin">Organization Admin</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="lead">Lead</option>
              <option value="operator">Operator</option>
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
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
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
                  <div class="text-sm text-gray-900">{{ getDepartmentName(user.department) }}</div>
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pending Invitations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Pending Invitations</h3>
      </div>
      <div class="p-6">
        <div v-if="pendingInvites.length === 0" class="text-center py-8">
          <EnvelopeIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No pending invitations</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="invite in pendingInvites" :key="invite.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ invite.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getRoleClass(invite.role)"
                  >
                    {{ formatRole(invite.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getDepartmentName(invite.department) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(invite.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="resendInvite(invite)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Resend
                  </button>
                  <button
                    @click="cancelInvite(invite)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Invite User Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Invite User</h3>
        
        <form @submit.prevent="sendInvite" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="newInvite.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="newInvite.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="organization_admin">Organization Admin</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="lead">Lead</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              v-model="newInvite.department"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="sendingInvite"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ sendingInvite ? 'Sending...' : 'Send Invitation' }}
            </button>
            <button
              type="button"
              @click="showInviteModal = false"
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
              <option value="organization_admin">Organization Admin</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="lead">Lead</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              v-model="editingUser.department"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
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
import { useOrganizationStore } from '../stores/organization';
import type { User, Invite } from '../types';
import { ArrowPathIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';

const organizationStore = useOrganizationStore();
const users = ref<User[]>([]);
const pendingInvites = ref<Invite[]>([]);
const departments = ref<any[]>([]);

const searchQuery = ref('');
const roleFilter = ref('all');
const showInviteModal = ref(false);
const showEditUserModal = ref(false);
const sendingInvite = ref(false);
const savingUser = ref(false);

const newInvite = reactive({
  email: '',
  role: 'operator',
  department: ''
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
  let filtered = users.value;
  
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
  
  return filtered;
});

const refreshData = async () => {
  try {
    await organizationStore.fetchUsers();
    await organizationStore.fetchInvites();
    await organizationStore.fetchDepartments();
    
    users.value = organizationStore.users;
    pendingInvites.value = organizationStore.invites;
    departments.value = organizationStore.departments;
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
    'organization_admin': 'bg-purple-100 text-purple-800',
    'manager': 'bg-blue-100 text-blue-800',
    'supervisor': 'bg-indigo-100 text-indigo-800',
    'lead': 'bg-green-100 text-green-800',
    'operator': 'bg-gray-100 text-gray-800'
  };
  return classes[role as keyof typeof classes] || classes.operator;
};

const getDepartmentName = (departmentId: string | undefined) => {
  if (!departmentId) return 'None';
  const dept = departments.value.find(d => d.id === departmentId);
  return dept ? dept.name : departmentId;
};

const sendInvite = async () => {
  sendingInvite.value = true;
  try {
    await organizationStore.inviteUser(
      newInvite.email,
      newInvite.role,
      newInvite.department
    );
    
    showInviteModal.value = false;
    
    // Reset form
    Object.assign(newInvite, {
      email: '',
      role: 'operator',
      department: ''
    });
    
    // Refresh invites
    await organizationStore.fetchInvites();
    pendingInvites.value = organizationStore.invites;
  } catch (error) {
    console.error('Error sending invitation:', error);
  } finally {
    sendingInvite.value = false;
  }
};

const resendInvite = async (invite: Invite) => {
  try {
    // In a real app, you would implement this
    console.log('Resending invitation:', invite);
    
    // This would typically involve:
    // 1. Updating the invite's expiration date
    // 2. Sending a new email
  } catch (error) {
    console.error('Error resending invitation:', error);
  }
};

const cancelInvite = async (invite: Invite) => {
  try {
    await organizationStore.cancelInvite(invite.id);
  } catch (error) {
    console.error('Error cancelling invitation:', error);
  }
};

const editUser = (user: User) => {
  Object.assign(editingUser, user);
  showEditUserModal.value = true;
};

const saveUser = async () => {
  savingUser.value = true;
  try {
    await organizationStore.updateUser(editingUser.id, {
      name: editingUser.name,
      role: editingUser.role,
      department: editingUser.department,
      is_active: editingUser.is_active
    });
    
    showEditUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  } finally {
    savingUser.value = false;
  }
};

const toggleUserStatus = async (user: User) => {
  try {
    await organizationStore.updateUser(user.id, {
      is_active: !user.is_active
    });
    
    // Update local state
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index].is_active = !users.value[index].is_active;
    }
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

onMounted(async () => {
  await refreshData();
});
</script>