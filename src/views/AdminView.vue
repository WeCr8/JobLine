<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Administration</h1>
        <p class="text-gray-600">Manage subscriptions, organizations, and system settings</p>
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
      <!-- Key Metrics -->
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
            <span 
              class="text-sm font-medium"
              :class="adminStore.analytics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ adminStore.analytics.revenueGrowth > 0 ? '+' : '' }}{{ adminStore.analytics.revenueGrowth }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
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
            <span 
              class="text-sm font-medium"
              :class="adminStore.analytics.userGrowth > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ adminStore.analytics.userGrowth > 0 ? '+' : '' }}{{ adminStore.analytics.userGrowth }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
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
            <span 
              class="text-sm font-medium"
              :class="adminStore.analytics.conversionGrowth > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ adminStore.analytics.conversionGrowth > 0 ? '+' : '' }}{{ adminStore.analytics.conversionGrowth }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
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
            <span 
              class="text-sm font-medium"
              :class="adminStore.analytics.churnChange < 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ adminStore.analytics.churnChange < 0 ? '' : '+' }}{{ adminStore.analytics.churnChange }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div class="h-64">
            <!-- Chart would go here -->
            <div class="h-full bg-gray-50 rounded flex items-end space-x-1 p-2">
              <div
                v-for="(revenue, index) in adminStore.analytics.monthlyRevenue"
                :key="index"
                class="flex-1 bg-green-500 rounded-t"
                :style="{ height: `${(revenue / Math.max(...adminStore.analytics.monthlyRevenue)) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div class="h-64">
            <!-- Chart would go here -->
            <div class="h-full flex items-center justify-center">
              <div class="space-y-4 w-full">
                <div
                  v-for="(count, plan) in adminStore.analytics.planDistribution"
                  :key="plan"
                  class="space-y-1"
                >
                  <div class="flex justify-between text-sm">
                    <span>{{ plan }}</span>
                    <span>{{ count }} users</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${(count / adminStore.analytics.activeUsers) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
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
              v-for="(log, index) in adminStore.systemLogs.slice(0, 5)"
              :key="index"
              class="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getLogLevelClass(log.level)"
                >
                  <component :is="getLogLevelIcon(log.level)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ log.message }}</p>
                  <span class="text-xs text-gray-500">{{ formatTime(log.timestamp) }}</span>
                </div>
                <div class="mt-1 text-xs text-gray-600">
                  <span v-if="log.user_id">User: {{ log.user_id }}</span>
                  <span v-if="log.ip_address" class="ml-2">IP: {{ log.ip_address }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriptions Tab -->
    <div v-if="activeTab === 'subscriptions'" class="space-y-6">
      <!-- Subscription Plans -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Subscription Plans</h3>
            <button
              @click="showPlanModal = true"
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
                    <div class="text-sm text-gray-500">{{ plan.description }}</div>
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
                      :class="plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
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

      <!-- Active Subscriptions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="subscription in adminStore.activeSubscriptions" :key="subscription.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ subscription.userName }}</div>
                    <div class="text-sm text-gray-500">{{ subscription.userEmail }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ subscription.planName }}</div>
                    <div class="text-sm text-gray-500">${{ (subscription.amount / 100).toFixed(2) }}/{{ subscription.interval }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getSubscriptionStatusClass(subscription.status)"
                    >
                      {{ subscription.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(subscription.startDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(subscription.nextBillingDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="viewSubscriptionDetails(subscription)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      v-if="subscription.status === 'active' && !subscription.cancelAtPeriodEnd"
                      @click="cancelSubscription(subscription)"
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
    </div>

    <!-- Organizations Tab -->
    <div v-if="activeTab === 'organizations'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Organizations</h3>
            <button
              @click="showOrgModal = true"
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="org in adminStore.organizations" :key="org.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                    <div class="text-sm text-gray-500">{{ org.primaryContactName || 'No primary contact' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ org.industry || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ org.currentUserCount }} / {{ org.maxUsers }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ org.planName || 'No plan' }}</div>
                    <div v-if="org.subscriptionStatus" class="text-sm text-gray-500">{{ org.subscriptionStatus }}</div>
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
                      @click="viewOrganizationUsers(org)"
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

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Platform Users</h3>
            <div class="flex space-x-2">
              <select
                v-model="userFilters.role"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Platform Admin</option>
                <option value="organization_admin">Organization Admin</option>
                <option value="manager">Manager</option>
                <option value="operator">Operator</option>
              </select>
              <input
                v-model="userFilters.search"
                type="text"
                placeholder="Search users..."
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
              />
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                    <div class="text-sm text-gray-900">{{ getUserOrganization(user) }}</div>
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
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">System Settings</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveSettings" class="space-y-6">
            <!-- Payment Settings -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Payment Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                  <input
                    v-model="settings.stripeSecretKey"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="sk_live_..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
                  <input
                    v-model="settings.stripeWebhookSecret"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="whsec_..."
                  />
                </div>
              </div>
            </div>

            <!-- AI Settings -->
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">AI Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                  <input
                    v-model="settings.openaiApiKey"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="sk-..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Model</label>
                  <select
                    v-model="settings.ai.defaultModel"
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
                    v-model.number="settings.ai.temperature"
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
                    v-model.number="settings.ai.maxTokens"
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
              <h4 class="text-md font-medium text-gray-900 mb-4">Backup Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Enable Automatic Backups</label>
                  <div class="flex items-center">
                    <input
                      v-model="settings.backup.enabled"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Enable</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    v-model="settings.backup.frequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                  <input
                    v-model.number="settings.backup.retentionDays"
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

    <!-- Logs Tab -->
    <div v-if="activeTab === 'logs'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">System Logs</h3>
            <div class="flex space-x-2">
              <select
                v-model="logFilters.level"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Levels</option>
                <option value="INFO">Info</option>
                <option value="WARN">Warning</option>
                <option value="ERROR">Error</option>
                <option value="DEBUG">Debug</option>
              </select>
              <input
                v-model="logFilters.search"
                type="text"
                placeholder="Search logs..."
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in filteredLogs" :key="log.id">
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
                    <div class="text-sm text-gray-900">{{ log.user_id || 'System' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ log.ip_address || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatTime(log.timestamp) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingPlan.id ? 'Edit Plan' : 'Add New Plan' }}
        </h3>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <input
                v-model.number="editingPlan.displayPrice"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="29.99"
              />
            </div>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {{ savingPlan ? 'Saving...' : 'Save Plan' }}
            </button>
            <button
              type="button"
              @click="showPlanModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Organization Modal -->
    <div v-if="showOrgModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingOrg.id ? 'Edit Organization' : 'Add New Organization' }}
        </h3>
        
        <form @submit.prevent="saveOrganization" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                v-model="editingOrg.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Acme Manufacturing"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                v-model="editingOrg.industry"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Manufacturing"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Name</label>
              <input
                v-model="editingOrg.primaryContactName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Email</label>
              <input
                v-model="editingOrg.primaryContactEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                v-model="editingOrg.phone"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                v-model="editingOrg.website"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
              <input
                v-model.number="editingOrg.maxUsers"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="10"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
              <select
                v-model="editingOrg.planId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No Plan</option>
                <option 
                  v-for="plan in adminStore.subscriptionPlans.filter(p => p.active)" 
                  :key="plan.id" 
                  :value="plan.id"
                >
                  {{ plan.name }}
                </option>
              </select>
            </div>
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
              @click="showOrgModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                v-model="editingUser.department"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Manufacturing"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <select
              v-model="editingUser.organization_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No Organization (Platform Admin)</option>
              <option 
                v-for="org in adminStore.organizations" 
                :key="org.id" 
                :value="org.id"
              >
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
              @click="showUserModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Organization Users Modal -->
    <div v-if="showOrgUsersModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedOrg?.name }} - Users</h3>
          <button
            @click="showOrgUsersModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-6">
          <button
            @click="showAddOrgUserModal = true"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
          >
            Add User
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in orgUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.userName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.userEmail }}</div>
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
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ user.isAdmin ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(user.joinedAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="editOrgUser(user)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="removeOrgUser(user)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Organization User Modal -->
    <div v-if="showAddOrgUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add User to {{ selectedOrg?.name }}</h3>
        
        <form @submit.prevent="addOrgUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="newOrgUser.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="newOrgUser.role"
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

          <div class="flex items-center">
            <input
              v-model="newOrgUser.isAdmin"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Organization Admin</label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingOrgUser"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingOrgUser ? 'Adding...' : 'Add User' }}
            </button>
            <button
              type="button"
              @click="showAddOrgUserModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Subscription Details Modal -->
    <div v-if="showSubscriptionDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Subscription Details</h3>
          <button
            @click="showSubscriptionDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="selectedSubscription" class="space-y-6">
          <!-- Customer Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 mb-2">Customer Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-500">Name:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.userName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Email:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.userEmail }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Customer Since:</span>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.customerSince) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Customer ID:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.customerId }}</p>
              </div>
            </div>
          </div>

          <!-- Subscription Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 mb-2">Subscription Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-500">Plan:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.planName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Status:</span>
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getSubscriptionStatusClass(selectedSubscription.status)"
                >
                  {{ selectedSubscription.status }}
                </span>
              </div>
              <div>
                <span class="text-sm text-gray-500">Start Date:</span>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.startDate) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Next Billing:</span>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.nextBillingDate) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Amount:</span>
                <p class="text-sm font-medium text-gray-900">${{ (selectedSubscription.amount / 100).toFixed(2) }}/{{ selectedSubscription.interval }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Payment Method:</span>
                <p class="text-sm font-medium text-gray-900">
                  {{ selectedSubscription.paymentMethodBrand || 'N/A' }} 
                  {{ selectedSubscription.paymentMethodLast4 ? `(**** ${selectedSubscription.paymentMethodLast4})` : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Invoices -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-2">Invoices</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="invoice in selectedSubscription.invoices" :key="invoice.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ invoice.id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(invoice.date) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">${{ (invoice.amount / 100).toFixed(2) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ invoice.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import type { SubscriptionPlan, Subscription, Organization, OrganizationUser, User, SystemSettings, SystemLog } from '../stores/admin';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  XMarkIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UserIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const activeTab = ref('dashboard');
const showPlanModal = ref(false);
const showOrgModal = ref(false);
const showUserModal = ref(false);
const showOrgUsersModal = ref(false);
const showAddOrgUserModal = ref(false);
const showSubscriptionDetailsModal = ref(false);
const savingPlan = ref(false);
const savingOrg = ref(false);
const savingUser = ref(false);
const addingOrgUser = ref(false);
const savingSettings = ref(false);
const backupInProgress = ref(false);

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: CreditCardIcon },
  { id: 'subscriptions', name: 'Subscriptions', icon: CreditCardIcon },
  { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon },
  { id: 'users', name: 'Users', icon: UserIcon },
  { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
  { id: 'logs', name: 'System Logs', icon: DocumentTextIcon }
];

const userFilters = reactive({
  role: '',
  search: ''
});

const logFilters = reactive({
  level: '',
  search: ''
});

const editingPlan = reactive<SubscriptionPlan & { displayPrice?: number }>({
  id: '',
  name: '',
  description: '',
  price: 0,
  displayPrice: 0,
  interval: 'monthly',
  stripePriceId: '',
  active: true,
  features: []
});

const editingOrg = reactive<Organization>({
  id: '',
  name: '',
  industry: '',
  address: '',
  phone: '',
  website: '',
  logoUrl: '',
  primaryContactName: '',
  primaryContactEmail: '',
  subscriptionId: '',
  subscriptionStatus: '',
  planId: '',
  planName: '',
  maxUsers: 10,
  currentUserCount: 0,
  isActive: true,
  createdAt: new Date().toISOString()
});

const editingUser = reactive<User>({
  id: '',
  name: '',
  email: '',
  role: '',
  department: '',
  is_active: true,
  created_at: new Date().toISOString()
});

const newOrgUser = reactive({
  email: '',
  role: 'operator',
  isAdmin: false
});

const settings = reactive<SystemSettings>({
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

const selectedOrg = ref<Organization | null>(null);
const selectedSubscription = ref<Subscription | null>(null);
const orgUsers = ref<OrganizationUser[]>([]);
const featuresText = ref('');

const filteredUsers = computed(() => {
  let filtered = adminStore.users;
  
  if (userFilters.role) {
    filtered = filtered.filter(user => user.role === userFilters.role);
  }
  
  if (userFilters.search) {
    const search = userFilters.search.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const filteredLogs = computed(() => {
  let filtered = adminStore.systemLogs;
  
  if (logFilters.level) {
    filtered = filtered.filter(log => log.level === logFilters.level);
  }
  
  if (logFilters.search) {
    const search = logFilters.search.toLowerCase();
    filtered = filtered.filter(log => 
      log.message.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const refreshData = async () => {
  await Promise.all([
    adminStore.fetchSubscriptionPlans(),
    adminStore.fetchActiveSubscriptions(),
    adminStore.fetchUsers(),
    adminStore.fetchOrganizations(),
    adminStore.fetchAnalytics(),
    adminStore.fetchSystemSettings(),
    adminStore.fetchSystemLogs()
  ]);
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatTime = (dateString: string) => {
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

const getLogLevelClass = (level: string) => {
  const classes = {
    'INFO': 'bg-blue-100 text-blue-600',
    'WARN': 'bg-yellow-100 text-yellow-600',
    'ERROR': 'bg-red-100 text-red-600',
    'DEBUG': 'bg-gray-100 text-gray-600'
  };
  return classes[level as keyof typeof classes] || classes.INFO;
};

const getLogLevelIcon = (level: string) => {
  const icons = {
    'INFO': InformationCircleIcon,
    'WARN': ExclamationTriangleIcon,
    'ERROR': ExclamationCircleIcon,
    'DEBUG': DocumentTextIcon
  };
  return icons[level as keyof typeof icons] || InformationCircleIcon;
};

const getUserOrganization = (user: User) => {
  if (!user.organization_id) return 'Platform Admin';
  const org = adminStore.organizations.find(o => o.id === user.organization_id);
  return org ? org.name : 'Unknown';
};

const editPlan = (plan: SubscriptionPlan) => {
  Object.assign(editingPlan, plan);
  editingPlan.displayPrice = plan.price / 100;
  featuresText.value = plan.features.join('\n');
  showPlanModal.value = true;
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
    // Convert display price to cents
    editingPlan.price = Math.round((editingPlan.displayPrice || 0) * 100);
    
    // Parse features from text
    editingPlan.features = featuresText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    await adminStore.saveSubscriptionPlan(editingPlan);
    showPlanModal.value = false;
    
    // Reset form
    Object.assign(editingPlan, {
      id: '',
      name: '',
      description: '',
      price: 0,
      displayPrice: 0,
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

const editOrganization = (org: Organization) => {
  Object.assign(editingOrg, org);
  showOrgModal.value = true;
};

const saveOrganization = async () => {
  savingOrg.value = true;
  try {
    await adminStore.saveOrganization(editingOrg);
    showOrgModal.value = false;
    
    // Reset form
    Object.assign(editingOrg, {
      id: '',
      name: '',
      industry: '',
      address: '',
      phone: '',
      website: '',
      logoUrl: '',
      primaryContactName: '',
      primaryContactEmail: '',
      subscriptionId: '',
      subscriptionStatus: '',
      planId: '',
      planName: '',
      maxUsers: 10,
      currentUserCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving organization:', error);
  } finally {
    savingOrg.value = false;
  }
};

const viewOrganizationUsers = (org: Organization) => {
  selectedOrg.value = org;
  // In a real app, you would fetch the users for this organization
  orgUsers.value = [
    {
      id: 'ou-1',
      organizationId: org.id,
      userId: 'user-1',
      userName: 'John Smith',
      userEmail: 'john@example.com',
      role: 'manager',
      isAdmin: true,
      isPrimary: true,
      joinedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'ou-2',
      organizationId: org.id,
      userId: 'user-2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      role: 'operator',
      isAdmin: false,
      isPrimary: false,
      joinedAt: '2024-01-05T00:00:00Z'
    }
  ];
  showOrgUsersModal.value = true;
};

const editOrgUser = (user: OrganizationUser) => {
  // In a real app, you would implement this
  console.log('Edit organization user:', user);
};

const removeOrgUser = (user: OrganizationUser) => {
  // In a real app, you would implement this
  console.log('Remove organization user:', user);
  orgUsers.value = orgUsers.value.filter(u => u.id !== user.id);
};

const addOrgUser = async () => {
  addingOrgUser.value = true;
  try {
    // In a real app, you would implement this
    console.log('Add organization user:', newOrgUser);
    
    // Simulate adding a user
    if (selectedOrg.value) {
      const newUser: OrganizationUser = {
        id: `ou-${Date.now()}`,
        organizationId: selectedOrg.value.id,
        userId: `user-${Date.now()}`,
        userName: newOrgUser.email.split('@')[0],
        userEmail: newOrgUser.email,
        role: newOrgUser.role,
        isAdmin: newOrgUser.isAdmin,
        isPrimary: false,
        joinedAt: new Date().toISOString()
      };
      orgUsers.value.push(newUser);
    }
    
    showAddOrgUserModal.value = false;
    
    // Reset form
    Object.assign(newOrgUser, {
      email: '',
      role: 'operator',
      isAdmin: false
    });
  } catch (error) {
    console.error('Error adding organization user:', error);
  } finally {
    addingOrgUser.value = false;
  }
};

const editUser = (user: User) => {
  Object.assign(editingUser, user);
  showUserModal.value = true;
};

const toggleUserStatus = async (user: User) => {
  try {
    const updatedUser = { ...user, is_active: !user.is_active };
    await adminStore.updateUser(updatedUser);
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

const saveUser = async () => {
  savingUser.value = true;
  try {
    await adminStore.updateUser(editingUser);
    showUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  } finally {
    savingUser.value = false;
  }
};

const viewSubscriptionDetails = (subscription: Subscription) => {
  selectedSubscription.value = subscription;
  showSubscriptionDetailsModal.value = true;
};

const cancelSubscription = async (subscription: Subscription) => {
  if (confirm(`Are you sure you want to cancel the subscription for ${subscription.userName}?`)) {
    try {
      await adminStore.cancelSubscription(subscription.subscriptionId);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  }
};

const saveSettings = async () => {
  savingSettings.value = true;
  try {
    await adminStore.saveSystemSettings(settings);
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
  
  // Initialize settings form with current values
  Object.assign(settings, adminStore.systemSettings);
});
</script>