<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Administration</h1>
        <p class="text-gray-600">Manage your SaaS platform, organizations, and global settings</p>
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

    <!-- Dashboard Tab -->
    <div v-if="activeTab === 'dashboard'" class="space-y-6">
      <!-- Platform Analytics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">${{ (adminStore.analytics.totalRevenue / 100).toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-green-600 font-medium">+{{ adminStore.analytics.revenueGrowth }}% from last month</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.analytics.activeUsers }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-blue-600 font-medium">+{{ adminStore.analytics.userGrowth }}% from last month</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.analytics.conversionRate }}%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-purple-600 font-medium">+{{ adminStore.analytics.conversionGrowth }}% from last month</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Churn Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.analytics.churnRate }}%</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingDownIcon class="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div class="mt-2">
            <span class="text-sm text-green-600 font-medium">{{ adminStore.analytics.churnChange }}% from last month</span>
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
                <tr v-for="org in adminStore.organizations.slice(0, 5)" :key="org.id">
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
    </div>

    <!-- Organizations Tab -->
    <div v-if="activeTab === 'organizations'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Organizations</h3>
            <button
              @click="showAddOrgModal = true"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
            >
              Add Organization
            </button>
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="org in adminStore.organizations" :key="org.id">
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
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Platform Users</h3>
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in adminStore.users" :key="user.id">
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
                    <button
                      @click="editUser(user)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="impersonateUser(user)"
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
    </div>

    <!-- Subscription Plans Tab -->
    <div v-if="activeTab === 'plans'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Subscription Plans</h3>
            <button
              @click="showAddPlanModal = true"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
            >
              Add Plan
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="plan in adminStore.subscriptionPlans" :key="plan.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ plan.name }}</div>
                    <div class="text-xs text-gray-500">{{ plan.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${{ (plan.price / 100).toFixed(2) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 capitalize">{{ plan.interval }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ plan.subscriberCount || 0 }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="plan.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ plan.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="editPlan(plan)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="togglePlanStatus(plan)"
                      :class="plan.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    >
                      {{ plan.active ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- System Settings Tab -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
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

    <!-- System Logs Tab -->
    <div v-if="activeTab === 'logs'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">System Logs</h3>
            <div class="flex space-x-2">
              <select
                v-model="logLevel"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Levels</option>
                <option value="INFO">Info</option>
                <option value="WARN">Warning</option>
                <option value="ERROR">Error</option>
                <option value="DEBUG">Debug</option>
              </select>
              <button
                @click="refreshLogs"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowPathIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
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
                    <div class="text-sm text-gray-900">{{ getUserName(log.user_id) || 'System' }}</div>
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

    <!-- Add Plan Modal -->
    <div v-if="showAddPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ editingPlan.id ? 'Edit' : 'Add' }} Subscription Plan</h3>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
            <input
              v-model="editingPlan.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Basic Plan"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="editingPlan.description"
              rows="2"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Essential features for small teams"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price (in cents)</label>
            <input
              v-model.number="editingPlan.price"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="2999"
            />
            <p class="text-xs text-gray-500 mt-1">Example: 2999 for $29.99</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Billing Interval</label>
            <select
              v-model="editingPlan.interval"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Price ID</label>
            <input
              v-model="editingPlan.stripePriceId"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="price_1RbnOfE7qtcuEIptjDemZiVn"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
            <textarea
              v-model="featuresText"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="AI-powered job tracking
Real-time machine monitoring
Performance analytics"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="editingPlan.active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Active</label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="savingPlan"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ savingPlan ? 'Saving...' : (editingPlan.id ? 'Update Plan' : 'Add Plan') }}
            </button>
            <button
              type="button"
              @click="showAddPlanModal = false"
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
import { useAdminStore } from '../stores/admin.ts';
import type { SubscriptionPlan, Organization, User } from '../stores/admin';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const activeTab = ref('dashboard');
const showAddOrgModal = ref(false);
const showAddPlanModal = ref(false);
const addingOrg = ref(false);
const savingPlan = ref(false);
const savingSettings = ref(false);
const backupInProgress = ref(false);
const logLevel = ref('all');

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: ArrowTrendingUpIcon },
  { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon },
  { id: 'users', name: 'Users', icon: UserGroupIcon },
  { id: 'jobs', name: 'Jobs', icon: BriefcaseIcon },
  { id: 'analytics', name: 'Analytics', icon: CurrencyDollarIcon },
  { id: 'subscriptions', name: 'Subscriptions', icon: ArrowTrendingDownIcon },
  { id: 'ai', name: 'AI Configuration', icon: CurrencyDollarIcon },
  { id: 'backups', name: 'Backups', icon: CurrencyDollarIcon },
  { id: 'plans', name: 'Subscription Plans', icon: CreditCardIcon },
  { id: 'settings', name: 'System Settings', icon: Cog6ToothIcon },
  { id: 'logs', name: 'System Logs', icon: DocumentTextIcon }
];

const newOrg = reactive({
  name: '',
  industry: '',
  primaryContactName: '',
  primaryContactEmail: '',
  planId: '',
  maxUsers: 10
});

const editingPlan = reactive<SubscriptionPlan>({
  id: '',
  name: '',
  description: '',
  price: 0,
  interval: 'monthly',
  stripePriceId: '',
  active: true,
  features: []
});

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

const featuresText = ref('');

const filteredLogs = computed(() => {
  if (logLevel.value === 'all') {
    return adminStore.systemLogs;
  }
  return adminStore.systemLogs.filter(log => log.level === logLevel.value);
});

const refreshData = async () => {
  try {
    await Promise.all([
      adminStore.fetchAnalytics(),
      adminStore.fetchOrganizations(),
      adminStore.fetchUsers(),
      adminStore.fetchSubscriptionPlans(),
      adminStore.fetchActiveSubscriptions(),
      adminStore.fetchSystemSettings()
    ]);
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const refreshLogs = async () => {
  try {
    await adminStore.fetchSystemLogs();
  } catch (error) {
    console.error('Error refreshing logs:', error);
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
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

const getLogLevelClass = (level: string) => {
  const classes = {
    'INFO': 'bg-blue-100 text-blue-800',
    'WARN': 'bg-yellow-100 text-yellow-800',
    'ERROR': 'bg-red-100 text-red-800',
    'DEBUG': 'bg-gray-100 text-gray-800'
  };
  return classes[level as keyof typeof classes] || classes.INFO;
};

const getOrgName = (orgId: string) => {
  const org = adminStore.organizations.find(o => o.id === orgId);
  return org ? org.name : 'Unknown Organization';
};

const getUserName = (userId: string | undefined) => {
  if (!userId) return null;
  const user = adminStore.users.find(u => u.id === userId);
  return user ? user.name : null;
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
  // In a real app, you would implement this
  console.log('Edit organization:', org);
};

const viewOrgUsers = (org: Organization) => {
  // In a real app, you would implement this
  console.log('View organization users:', org);
};

const impersonateOrg = (org: Organization) => {
  // In a real app, you would implement this
  console.log('Impersonate organization:', org);
};

const editUser = (user: User) => {
  // In a real app, you would implement this
  console.log('Edit user:', user);
};

const impersonateUser = (user: User) => {
  // In a real app, you would implement this
  console.log('Impersonate user:', user);
};

const editPlan = (plan: SubscriptionPlan) => {
  Object.assign(editingPlan, plan);
  featuresText.value = plan.features.join('\n');
  showAddPlanModal.value = true;
};

const togglePlanStatus = async (plan: SubscriptionPlan) => {
  try {
    const updatedPlan = { ...plan, active: !plan.active };
    await adminStore.saveSubscriptionPlan(updatedPlan);
  } catch (error) {
    console.error('Error toggling plan status:', error);
  }
};

const savePlan = async () => {
  savingPlan.value = true;
  try {
    // Parse features from text
    editingPlan.features = featuresText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    await adminStore.saveSubscriptionPlan(editingPlan);
    showAddPlanModal.value = false;
    
    // Reset form
    Object.assign(editingPlan, {
      id: '',
      name: '',
      description: '',
      price: 0,
      interval: 'monthly',
      stripePriceId: '',
      active: true,
      features: []
    });
    featuresText.value = '';
  } catch (error) {
    console.error('Error saving plan:', error);
  } finally {
    savingPlan.value = false;
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
  await refreshLogs();
  
  // Initialize system settings
  Object.assign(systemSettings, adminStore.systemSettings);
});
</script>
```