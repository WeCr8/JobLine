<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organization Administration</h1>
        <p class="text-gray-600">Manage your organization, users, and departments</p>
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

    <!-- Admin Navigation Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
        >
          <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Organization Overview Tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <!-- Organization Info -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Organization Information</h3>
            <button
              @click="editOrganization"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
            >
              Edit
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-gray-500">Name:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.name }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Industry:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.industry || 'Not specified' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Address:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.address || 'Not specified' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Phone:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.phone || 'Not specified' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Website:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.website || 'Not specified' }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Subscription Information</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-gray-500">Plan:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.planName || 'No plan' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Status:</span>
                  <span 
                    v-if="organization.subscriptionStatus"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getSubscriptionStatusClass(organization.subscriptionStatus)"
                  >
                    {{ organization.subscriptionStatus }}
                  </span>
                  <p v-else class="text-sm font-medium text-gray-900">No active subscription</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Users:</span>
                  <p class="text-sm font-medium text-gray-900">{{ organization.currentUserCount }} / {{ organization.maxUsers }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Created:</span>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(organization.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Organization Users</h3>
            <div class="flex space-x-2">
              <button
                @click="showAddUserModal = true"
                class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
              >
                Add User
              </button>
              <button
                @click="showInviteUserModal = true"
                class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
              >
                Invite User
              </button>
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id">
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
                    <div class="text-sm text-gray-900">{{ user.department || 'Not assigned' }}</div>
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
          <div v-if="isAdmin && pendingInvites.length" class="mt-10">
            <h4 class="text-md font-semibold text-gray-900 mb-2">Pending Invites</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited By</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="invite in pendingInvites" :key="invite.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ invite.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ invite.role_name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDistanceToNow(new Date(invite.created_at), { addSuffix: true }) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ invite.invited_by_name || '—' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="revokeInvite(invite)" :disabled="invite.loading" class="text-red-600 hover:text-red-900 mr-3">Revoke</button>
                      <button @click="resendInvite(invite)" :disabled="invite.loading" class="text-blue-600 hover:text-blue-900">Resend</button>
                      <button @click="copyInviteLink(invite)" class="text-gray-600 hover:text-gray-900 ml-2" title="Copy invite link">Copy Link</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="inviteListError" class="text-red-600 mt-2">{{ inviteListError }}</p>
              <p v-if="inviteListSuccess" class="text-green-600 mt-2">{{ inviteListSuccess }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Departments Tab -->
    <div v-if="activeTab === 'departments'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Departments</h3>
            <button
              @click="showAddDepartmentModal = true"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
            >
              Add Department
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="dept in departments" :key="dept.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ dept.name }}</div>
                    <div class="text-sm text-gray-500">{{ dept.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 capitalize">{{ dept.department_type }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dept.supervisor }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dept.operators?.length || 0 }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dept.active_jobs }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="editDepartment(dept)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="viewDepartmentUsers(dept)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Users
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Organization Settings</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveOrgSettings" class="space-y-6">
            <!-- General Settings -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">General Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
                  <select
                    v-model="orgSettings.defaultDepartment"
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
                    v-model="orgSettings.defaultRole"
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

            <!-- Feature Settings -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Feature Settings</h4>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    v-model="orgSettings.features.enableVoice"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Enable Voice Assistant</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="orgSettings.features.enableImageRecognition"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Enable Image Recognition</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="orgSettings.features.enablePerformanceModule"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Enable Performance Module</label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="orgSettings.features.enableOptimizationModule"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Enable Optimization Module</label>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingOrgSettings"
                class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
              >
                {{ savingOrgSettings ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add User</h3>
        
        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="newUser.role"
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
              v-model="newUser.department"
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
              :disabled="addingUser"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingUser ? 'Adding...' : 'Add User' }}
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
              placeholder="John Smith"
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
              placeholder="john@example.com"
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

    <!-- Add Department Modal -->
    <div v-if="showAddDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Department</h3>
        
        <form @submit.prevent="addDepartment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department ID</label>
            <input
              v-model="newDepartment.id"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="cnc-machining"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="newDepartment.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="CNC Machining"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newDepartment.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Computer-controlled precision machining operations"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              v-model="newDepartment.department_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="production">Production</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
            <select
              v-model="newDepartment.supervisor_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingDepartment"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingDepartment ? 'Adding...' : 'Add Department' }}
            </button>
            <button
              type="button"
              @click="showAddDepartmentModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Invite User Modal -->
    <div v-if="showInviteUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Invite User</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="inviteEmail" type="email" class="w-full border rounded px-3 py-2" placeholder="user@email.com" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="inviteRoleId" class="w-full border rounded px-3 py-2">
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="showInviteUserModal = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button @click="sendInvite" :disabled="inviteLoading" class="px-4 py-2 bg-primary-600 text-white rounded">Send Invite</button>
        </div>
        <p v-if="inviteError" class="text-red-600 mt-2">{{ inviteError }}</p>
        <p v-if="inviteSuccess" class="text-green-600 mt-2">Invite sent!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { format } from 'date-fns';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline';
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification'
import { formatDistanceToNow } from 'date-fns'

const activeTab = ref('overview');
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showAddDepartmentModal = ref(false);
const addingUser = ref(false);
const savingUser = ref(false);
const addingDepartment = ref(false);
const savingOrgSettings = ref(false);
const showInviteUserModal = ref(false)
const inviteEmail = ref('')
const inviteRoleId = ref('')
const inviteLoading = ref(false)
const inviteError = ref('')
const inviteSuccess = ref(false)
const availableRoles = ref<{ id: string; name: string }[]>([])

const tabs = [
  { id: 'overview', name: 'Overview', icon: BuildingOfficeIcon },
  { id: 'users', name: 'Users', icon: UserGroupIcon },
  { id: 'departments', name: 'Departments', icon: BuildingOfficeIcon },
  { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
];

// Mock data - in a real app, this would come from the database
const organization = reactive({
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

const users = ref([
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@acme-manufacturing.com',
    role: 'organization_admin',
    department: 'Administration',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@acme-manufacturing.com',
    role: 'manager',
    department: 'cnc-machining',
    is_active: true,
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Mike Wilson',
    email: 'mike@acme-manufacturing.com',
    role: 'operator',
    department: 'cnc-machining',
    is_active: true,
    created_at: '2024-01-10T00:00:00Z'
  }
]);

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining',
    description: 'Computer-controlled precision machining operations',
    department_type: 'production',
    supervisor: 'Sarah Johnson',
    supervisor_id: 'user-2',
    operators: ['user-3'],
    active_jobs: 5
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: 'Quality assurance and inspection',
    department_type: 'support',
    supervisor: 'John Smith',
    supervisor_id: 'user-1',
    operators: [],
    active_jobs: 0
  }
]);

const activeJobs = ref(5);

const newUser = reactive({
  email: '',
  name: '',
  role: 'operator',
  department: ''
});

const editingUser = reactive({
  id: '',
  name: '',
  email: '',
  role: 'operator',
  department: '',
  is_active: true,
  created_at: ''
});

const newDepartment = reactive({
  id: '',
  name: '',
  description: '',
  department_type: 'production',
  supervisor_id: ''
});

const orgSettings = reactive({
  defaultDepartment: '',
  defaultRole: 'operator',
  features: {
    enableVoice: true,
    enableImageRecognition: true,
    enablePerformanceModule: true,
    enableOptimizationModule: true
  }
});

const authStore = useAuthStore();

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
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

const editOrganization = () => {
  // In a real app, you would implement this
  console.log('Edit organization');
};

const addUser = async () => {
  addingUser.value = true;
  try {
    // In a real app, you would implement this
    console.log('Add user:', newUser);
    
    // Simulate adding a user
    const newUserObj = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      is_active: true,
      created_at: new Date().toISOString()
    };
    users.value.push(newUserObj);
    
    showAddUserModal.value = false;
    
    // Reset form
    Object.assign(newUser, {
      email: '',
      name: '',
      role: 'operator',
      department: ''
    });
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    addingUser.value = false;
  }
};

const editUser = (user: any) => {
  Object.assign(editingUser, user);
  showEditUserModal.value = true;
};

const toggleUserStatus = async (user: any) => {
  try {
    // In a real app, you would implement this
    console.log('Toggle user status:', user);
    
    // Simulate toggling user status
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index].is_active = !users.value[index].is_active;
    }
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

const saveUser = async () => {
  savingUser.value = true;
  try {
    // In a real app, you would implement this
    console.log('Save user:', editingUser);
    
    // Simulate saving user
    const index = users.value.findIndex(u => u.id === editingUser.id);
    if (index !== -1) {
      users.value[index] = { ...editingUser };
    }
    
    showEditUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  } finally {
    savingUser.value = false;
  }
};

const addDepartment = async () => {
  addingDepartment.value = true;
  try {
    // In a real app, you would implement this
    console.log('Add department:', newDepartment);
    
    // Simulate adding a department
    const supervisorUser = users.value.find(u => u.id === newDepartment.supervisor_id);
    const newDept = {
      id: newDepartment.id,
      name: newDepartment.name,
      description: newDepartment.description,
      department_type: newDepartment.department_type,
      supervisor: supervisorUser?.name || 'Not assigned',
      supervisor_id: newDepartment.supervisor_id,
      operators: [],
      active_jobs: 0
    };
    departments.value.push(newDept);
    
    showAddDepartmentModal.value = false;
    
    // Reset form
    Object.assign(newDepartment, {
      id: '',
      name: '',
      description: '',
      department_type: 'production',
      supervisor_id: ''
    });
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    addingDepartment.value = false;
  }
};

const editDepartment = (dept: any) => {
  // In a real app, you would implement this
  console.log('Edit department:', dept);
};

const viewDepartmentUsers = (dept: any) => {
  // In a real app, you would implement this
  console.log('View department users:', dept);
};

const saveOrgSettings = async () => {
  savingOrgSettings.value = true;
  try {
    // In a real app, you would implement this
    console.log('Save organization settings:', orgSettings);
    
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving organization settings:', error);
    alert('Error saving settings');
  } finally {
    savingOrgSettings.value = false;
  }
};

const isAdmin = computed(() =>
  authStore.user?.role === 'admin' || authStore.user?.role === 'organization_admin'
)
const pendingInvites = ref<any[]>([])
const inviteListError = ref('')
const inviteListSuccess = ref('')

async function fetchPendingInvites() {
  inviteListError.value = ''
  try {
    const { data, error } = await supabase
      .from('invites')
      .select('id, email, role_id, created_at, code, created_by, roles(name), users:created_by(name)')
      .eq('organization_id', organization.id)
      .is('accepted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw error
    pendingInvites.value = (data || []).map(invite => ({
      ...invite,
      role_name: invite.roles?.name || invite.role_id || '',
      invited_by_name: invite.users?.name || ''
    }))
  } catch (e: any) {
    inviteListError.value = e.message || 'Failed to load invites.'
  }
}
onMounted(fetchPendingInvites)

async function revokeInvite(invite: any) {
  invite.loading = true
  inviteListError.value = ''
  inviteListSuccess.value = ''
  try {
    const { error } = await supabase.from('invites').delete().eq('id', invite.id)
    if (error) throw error
    inviteListSuccess.value = 'Invite revoked.'
    await fetchPendingInvites()
  } catch (e: any) {
    inviteListError.value = e.message || 'Failed to revoke invite.'
  } finally {
    invite.loading = false
  }
}

const toast = useToast()

function copyInviteLink(invite: any) {
  const link = `${window.location.origin}/accept-invite?code=${invite.code}`
  navigator.clipboard.writeText(link)
  toast.success('Invite link copied!')
}

async function resendInvite(invite: any) {
  invite.loading = true
  inviteListError.value = ''
  inviteListSuccess.value = ''
  try {
    const { error } = await supabase.functions.invoke('resend-invite', {
      body: { inviteId: invite.id }
    })
    if (error) throw error
    toast.success('Invite resent!')
    inviteListSuccess.value = 'Invite resent.'
  } catch (e: any) {
    toast.error(e.message || 'Failed to resend invite.')
    inviteListError.value = e.message || 'Failed to resend invite.'
  } finally {
    invite.loading = false
  }
}

watch(inviteSuccess, (val) => { if (val) fetchPendingInvites() })

onMounted(async () => {
  await refreshData();
  // Fetch available roles for the dropdown
  const { data: roles } = await supabase.from('roles').select('id, name')
  if (roles && Array.isArray(roles)) {
    const typedRoles = roles as { id: string; name: string }[];
    availableRoles.value = typedRoles.map(r => ({ id: r.id, name: r.name }))
  }
})

const sendInvite = async () => {
  inviteLoading.value = true
  inviteError.value = ''
  inviteSuccess.value = false
  try {
    if (!inviteEmail.value || !inviteRoleId.value) {
      throw new Error('Please enter an email and select a role.')
    }
    // Generate a unique code for the invite
    const code = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    // Use the current org id (assume organization.id is available in this view)
    if (!organization || !organization.id) throw new Error('Organization context missing.')
    if (!authStore.user || !authStore.user.id) throw new Error('User context missing.')
    const { error } = await supabase.from('invites').insert({
      email: inviteEmail.value,
      organization_id: organization.id,
      role_id: inviteRoleId.value,
      code,
      created_by: authStore.user.id
    })
    if (error) throw error
    inviteSuccess.value = true
    inviteEmail.value = ''
    inviteRoleId.value = ''
    // Optionally refresh invites/users list here
  } catch (e: any) {
    inviteError.value = e.message || 'Failed to send invite.'
  } finally {
    inviteLoading.value = false
  }
}
</script>