<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">SaaS Administration</h1>
        <p class="text-gray-600">Platform management for JobLine.ai owners</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Refresh Data
        </button>
        <button
          @click="triggerBackup"
          :disabled="adminStore.loading"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          {{ adminStore.loading ? 'Processing...' : 'Backup Database' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
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
              <p class="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
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
              <p class="text-sm font-medium text-gray-600">Active Subscribers</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.analytics.activeUsers }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-blue-600" />
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
              {{ adminStore.analytics.churnChange > 0 ? '+' : '' }}{{ adminStore.analytics.churnChange }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
          <div class="h-64">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div class="h-64">
            <canvas ref="userChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Plan Distribution -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Subscription Plan Distribution</h3>
        <div class="h-64">
          <canvas ref="planDistributionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Subscription Plans Tab -->
    <div v-if="activeTab === 'plans'" class="space-y-6">
      <div class="flex justify-end">
        <button
          @click="showPlanModal = true; editingPlan = null"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add New Plan
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Subscription Plans</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
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
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ plan.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ plan.subscriberCount || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editPlan(plan)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="togglePlanStatus(plan)"
                    class="text-gray-600 hover:text-gray-900"
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

    <!-- Subscriptions Tab -->
    <div v-if="activeTab === 'subscriptions'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
            <div class="flex space-x-2">
              <input
                v-model="subscriptionSearch"
                type="text"
                placeholder="Search by name or email"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="subscription in filteredSubscriptions" :key="subscription.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ subscription.userName }}</div>
                  <div class="text-sm text-gray-500">{{ subscription.userEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ subscription.planName }}</div>
                  <div class="text-sm text-gray-500">Since {{ formatDate(subscription.startDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(subscription.status)"
                  >
                    {{ subscription.status.toUpperCase() }}
                  </span>
                  <div v-if="subscription.cancelAtPeriodEnd" class="text-xs text-red-600 mt-1">
                    Cancels at period end
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${{ (subscription.amount / 100).toFixed(2) }}</div>
                  <div class="text-sm text-gray-500 capitalize">{{ subscription.interval }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(subscription.nextBillingDate) }}</div>
                  <div v-if="subscription.paymentMethodLast4" class="text-sm text-gray-500">
                    {{ subscription.paymentMethodBrand?.toUpperCase() }} •••• {{ subscription.paymentMethodLast4 }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewSubscription(subscription)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    v-if="subscription.status === 'active' && !subscription.cancelAtPeriodEnd"
                    @click="confirmCancelSubscription(subscription)"
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

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">User Management</h3>
            <div class="flex space-x-2">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Search by name or email"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <select
                v-model="userRoleFilter"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Roles</option>
                <option value="operator">Operator</option>
                <option value="lead">Lead</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="organization_admin">Organization Admin</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
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
                  <div class="text-sm text-gray-900 capitalize">{{ user.role }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.department || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(user.created_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    class="text-gray-600 hover:text-gray-900"
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

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">API Keys</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveSettings" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
              <div class="flex">
                <input
                  v-if="showStripeKey"
                  v-model="settings.stripeSecretKey"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk_live_..."
                />
                <input
                  v-else
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk_live_..."
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
                <button
                  type="button"
                  @click="showStripeKey = !showStripeKey"
                  class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                >
                  <EyeIcon v-if="showStripeKey" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
              <div class="flex">
                <input
                  v-if="showWebhookSecret"
                  v-model="settings.stripeWebhookSecret"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="whsec_..."
                />
                <input
                  v-else
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="whsec_..."
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
                <button
                  type="button"
                  @click="showWebhookSecret = !showWebhookSecret"
                  class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                >
                  <EyeIcon v-if="showWebhookSecret" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
              <div class="flex">
                <input
                  v-if="showOpenAIKey"
                  v-model="settings.openaiApiKey"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk-..."
                />
                <input
                  v-else
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk-..."
                  value="••••••••••••••••••••••••••••••"
                  disabled
                />
                <button
                  type="button"
                  @click="showOpenAIKey = !showOpenAIKey"
                  class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                >
                  <EyeIcon v-if="showOpenAIKey" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <h4 class="text-md font-medium text-gray-900 mb-4">AI Configuration</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (ms)</label>
                  <input
                    v-model.number="settings.ai.timeout"
                    type="number"
                    min="5000"
                    max="120000"
                    step="1000"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <h4 class="text-md font-medium text-gray-900 mb-4">Database Backup</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Automatic Backups</label>
                  <div class="flex items-center">
                    <input
                      v-model="settings.backup.enabled"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Enable automatic backups</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    v-model="settings.backup.frequency"
                    :disabled="!settings.backup.enabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Retention (days)</label>
                  <input
                    v-model.number="settings.backup.retentionDays"
                    type="number"
                    min="1"
                    max="365"
                    :disabled="!settings.backup.enabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">System Information</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Application</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Version:</span>
                  <span class="text-sm font-medium text-gray-900">1.0.0</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Environment:</span>
                  <span class="text-sm font-medium text-gray-900">Production</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Last Updated:</span>
                  <span class="text-sm font-medium text-gray-900">Jan 15, 2024</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Database</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Status:</span>
                  <span class="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Size:</span>
                  <span class="text-sm font-medium text-gray-900">256 MB</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Last Backup:</span>
                  <span class="text-sm font-medium text-gray-900">Jan 12, 2024 14:30</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">System Logs</h4>
            <div class="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
              <div class="text-green-600">
                [INFO] 2024-01-12 14:30:00 - Database backup completed successfully
              </div>
              <div class="text-blue-600">
                [DEBUG] 2024-01-12 14:29:58 - Starting database backup process
              </div>
              <div class="text-yellow-600">
                [WARN] 2024-01-12 10:15:22 - High CPU usage detected (85%)
              </div>
              <div class="text-green-600">
                [INFO] 2024-01-12 08:00:00 - System startup completed
              </div>
              <div class="text-red-600">
                [ERROR] 2024-01-11 23:45:12 - Failed to connect to Stripe API: timeout
              </div>
              <div class="text-green-600">
                [INFO] 2024-01-11 23:46:05 - Reconnected to Stripe API successfully
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Organization Management Tab -->
    <div v-if="activeTab === 'organizations'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Customer Organizations</h3>
            <div class="flex space-x-2">
              <input
                v-model="organizationSearch"
                type="text"
                placeholder="Search organizations"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                @click="showOrgModal = true"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Add Organization
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="org in organizations" :key="org.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                  <div class="text-sm text-gray-500">{{ org.industry }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ org.adminName }}</div>
                  <div class="text-sm text-gray-500">{{ org.adminEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ org.userCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="org.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ org.subscriptionStatus.toUpperCase() }}
                  </span>
                  <div class="text-sm text-gray-500 mt-1">{{ org.planName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(org.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewOrganization(org)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="toggleOrgStatus(org)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    {{ org.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Plan Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan' }}
        </h3>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
            <input
              v-model="planForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Basic Plan"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              v-model="planForm.description"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Essential features for small teams"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  v-model="planForm.displayPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="29.99"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Billing Interval</label>
              <select
                v-model="planForm.interval"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Price ID</label>
            <input
              v-model="planForm.stripePriceId"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="price_1RbnOfE7qtcuEIptjDemZiVn"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
            <textarea
              v-model="planFeaturesText"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="AI-powered job tracking
Real-time machine monitoring
Performance analytics"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="planForm.active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Plan is active and available for purchase
            </label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              {{ editingPlan ? 'Update Plan' : 'Create Plan' }}
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

    <!-- User Edit Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="userForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="userForm.email"
              type="email"
              required
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="userForm.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="operator">Operator</option>
              <option value="lead">Lead</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="organization_admin">Organization Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              v-model="userForm.department"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="userForm.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              User is active
            </label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save Changes
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

    <!-- Subscription View Modal -->
    <div v-if="showSubscriptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Subscription Details</h3>
          <button
            @click="showSubscriptionModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="selectedSubscription" class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Customer</h4>
                <p class="text-lg font-medium text-gray-900">{{ selectedSubscription.userName }}</p>
                <p class="text-sm text-gray-600">{{ selectedSubscription.userEmail }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Subscription</h4>
                <p class="text-lg font-medium text-gray-900">{{ selectedSubscription.planName }}</p>
                <div class="flex items-center space-x-2">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(selectedSubscription.status)"
                  >
                    {{ selectedSubscription.status.toUpperCase() }}
                  </span>
                  <span class="text-sm text-gray-600">
                    ${{ (selectedSubscription.amount / 100).toFixed(2) }}/{{ selectedSubscription.interval }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Subscription Timeline</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Started:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.startDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Next billing:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.nextBillingDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Customer since:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedSubscription.customerSince) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Payment Method</h4>
            <div v-if="selectedSubscription.paymentMethodLast4" class="flex items-center space-x-2">
              <CreditCardIcon class="w-5 h-5 text-gray-400" />
              <span class="text-sm text-gray-900">
                {{ selectedSubscription.paymentMethodBrand?.toUpperCase() }} •••• {{ selectedSubscription.paymentMethodLast4 }}
              </span>
            </div>
            <div v-else class="text-sm text-gray-500">
              No payment method on file
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Invoice History</h4>
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ invoice.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(invoice.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ (invoice.amount / 100).toFixed(2) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ invoice.status.toUpperCase() }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              v-if="selectedSubscription.status === 'active' && !selectedSubscription.cancelAtPeriodEnd"
              @click="confirmCancelSubscription(selectedSubscription)"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Cancel Subscription
            </button>
            <button
              @click="showSubscriptionModal = false"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ confirmTitle }}</h3>
        <p class="text-gray-700 mb-6">{{ confirmMessage }}</p>
        
        <div class="flex space-x-3">
          <button
            @click="confirmAction"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Confirm
          </button>
          <button
            @click="showConfirmModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import type { SubscriptionPlan, Subscription, User, SystemSettings } from '../types/admin';
import {
  CurrencyDollarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import Chart from 'chart.js/auto';

const adminStore = useAdminStore();
const activeTab = ref('dashboard');
const showPlanModal = ref(false);
const showUserModal = ref(false);
const showSubscriptionModal = ref(false);
const showConfirmModal = ref(false);
const showOrgModal = ref(false);
const editingPlan = ref<SubscriptionPlan | null>(null);
const selectedSubscription = ref<Subscription | null>(null);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmCallback = ref<() => void>(() => {});
const subscriptionSearch = ref('');
const userSearch = ref('');
const userRoleFilter = ref('');
const organizationSearch = ref('');

// Chart references
const revenueChart = ref<HTMLCanvasElement | null>(null);
const userChart = ref<HTMLCanvasElement | null>(null);
const planDistributionChart = ref<HTMLCanvasElement | null>(null);

// Form states
const planForm = ref<SubscriptionPlan>({
  id: '',
  name: '',
  description: '',
  price: 0,
  interval: 'monthly',
  stripePriceId: '',
  active: true,
  features: []
});

const planFeaturesText = ref('');

const userForm = ref<User>({
  id: '',
  name: '',
  email: '',
  role: 'operator',
  department: '',
  is_active: true,
  created_at: ''
});

const settings = ref<SystemSettings>({
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

// Security toggles
const showStripeKey = ref(false);
const showWebhookSecret = ref(false);
const showOpenAIKey = ref(false);

// Mock organizations data
const organizations = ref([
  {
    id: '1',
    name: 'Acme Manufacturing',
    industry: 'Aerospace',
    adminName: 'John Smith',
    adminEmail: 'john@acme.com',
    userCount: 25,
    subscriptionStatus: 'active',
    planName: 'Enterprise Plan',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'TechCorp Industries',
    industry: 'Automotive',
    adminName: 'Sarah Johnson',
    adminEmail: 'sarah@techcorp.com',
    userCount: 18,
    subscriptionStatus: 'active',
    planName: 'Pro Plan',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Precision Machining Co',
    industry: 'Medical Devices',
    adminName: 'Mike Wilson',
    adminEmail: 'mike@precision.com',
    userCount: 12,
    subscriptionStatus: 'past_due',
    planName: 'Basic Plan',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  }
]);

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
  { id: 'plans', name: 'Subscription Plans', icon: CreditCardIcon },
  { id: 'subscriptions', name: 'Active Subscriptions', icon: CurrencyDollarIcon },
  { id: 'users', name: 'User Management', icon: UsersIcon },
  { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon },
  { id: 'settings', name: 'System Settings', icon: Cog6ToothIcon }
];

// Computed properties
const filteredSubscriptions = computed(() => {
  if (!subscriptionSearch.value) return adminStore.activeSubscriptions;
  
  const search = subscriptionSearch.value.toLowerCase();
  return adminStore.activeSubscriptions.filter(sub => 
    sub.userName.toLowerCase().includes(search) || 
    sub.userEmail.toLowerCase().includes(search)
  );
});

const filteredUsers = computed(() => {
  let filtered = adminStore.users;
  
  if (userSearch.value) {
    const search = userSearch.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search)
    );
  }
  
  if (userRoleFilter.value) {
    filtered = filtered.filter(user => user.role === userRoleFilter.value);
  }
  
  return filtered;
});

// Methods
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const getStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'trialing': 'bg-blue-100 text-blue-800',
    'past_due': 'bg-yellow-100 text-yellow-800',
    'canceled': 'bg-red-100 text-red-800',
    'incomplete': 'bg-orange-100 text-orange-800',
    'incomplete_expired': 'bg-gray-100 text-gray-800',
    'unpaid': 'bg-red-100 text-red-800',
    'paused': 'bg-purple-100 text-purple-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const editPlan = (plan: SubscriptionPlan) => {
  editingPlan.value = plan;
  planForm.value = { ...plan };
  planFeaturesText.value = plan.features.join('\n');
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
  try {
    // Convert display price to cents
    planForm.value.price = Math.round(parseFloat(planForm.value.displayPrice as unknown as string) * 100);
    
    // Convert features from text to array
    planForm.value.features = planFeaturesText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    await adminStore.saveSubscriptionPlan(planForm.value);
    showPlanModal.value = false;
  } catch (error) {
    console.error('Error saving plan:', error);
  }
};

const editUser = (user: User) => {
  userForm.value = { ...user };
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
  try {
    await adminStore.updateUser(userForm.value);
    showUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const viewSubscription = (subscription: Subscription) => {
  selectedSubscription.value = subscription;
  showSubscriptionModal.value = true;
};

const confirmCancelSubscription = (subscription: Subscription) => {
  confirmTitle.value = 'Cancel Subscription';
  confirmMessage.value = `Are you sure you want to cancel the subscription for ${subscription.userName}? This will stop billing at the end of the current period.`;
  confirmCallback.value = () => cancelSubscription(subscription.subscriptionId);
  showConfirmModal.value = true;
};

const cancelSubscription = async (subscriptionId: string) => {
  try {
    await adminStore.cancelSubscription(subscriptionId);
    showConfirmModal.value = false;
    
    // If we're in the subscription modal, update the selected subscription
    if (showSubscriptionModal.value && selectedSubscription.value) {
      selectedSubscription.value.status = 'canceled';
      selectedSubscription.value.cancelAtPeriodEnd = true;
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
};

const confirmAction = () => {
  confirmCallback.value();
  showConfirmModal.value = false;
};

const saveSettings = async () => {
  try {
    await adminStore.saveSystemSettings(settings.value);
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

const triggerBackup = async () => {
  try {
    await adminStore.triggerManualBackup();
    alert('Backup triggered successfully');
  } catch (error) {
    console.error('Error triggering backup:', error);
  }
};

const refreshData = async () => {
  await Promise.all([
    adminStore.fetchAnalytics(),
    adminStore.fetchSubscriptionPlans(),
    adminStore.fetchActiveSubscriptions(),
    adminStore.fetchUsers()
  ]);
  initCharts();
};

const viewOrganization = (org: any) => {
  console.log('View organization:', org);
  // Would implement organization details view
};

const toggleOrgStatus = (org: any) => {
  org.isActive = !org.isActive;
  console.log('Toggle organization status:', org);
  // Would implement organization status toggle
};

// Initialize charts
const initCharts = () => {
  // Revenue chart
  if (revenueChart.value) {
    const ctx = revenueChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Revenue ($)',
            data: adminStore.analytics.monthlyRevenue.map(rev => rev / 100),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
    }
  }

  // User chart
  if (userChart.value) {
    const ctx = userChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Active Users',
            data: adminStore.analytics.monthlyUsers,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Plan distribution chart
  if (planDistributionChart.value) {
    const ctx = planDistributionChart.value.getContext('2d');
    if (ctx) {
      const planNames = Object.keys(adminStore.analytics.planDistribution);
      const planCounts = Object.values(adminStore.analytics.planDistribution);
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: planNames,
          datasets: [{
            data: planCounts,
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }
};

// Watch for plan form changes
watch(() => editingPlan.value, (newPlan) => {
  if (newPlan) {
    planForm.value = { ...newPlan };
    planForm.value.displayPrice = (newPlan.price / 100).toFixed(2) as unknown as number;
    planFeaturesText.value = newPlan.features.join('\n');
  } else {
    planForm.value = {
      id: '',
      name: '',
      description: '',
      price: 0,
      displayPrice: 0,
      interval: 'monthly',
      stripePriceId: '',
      active: true,
      features: []
    };
    planFeaturesText.value = '';
  }
});

// Initialize data
onMounted(async () => {
  await Promise.all([
    adminStore.fetchAnalytics(),
    adminStore.fetchSubscriptionPlans(),
    adminStore.fetchActiveSubscriptions(),
    adminStore.fetchUsers(),
    adminStore.fetchSystemSettings()
  ]);
  
  settings.value = { ...adminStore.systemSettings };
  
  // Initialize charts after data is loaded
  setTimeout(initCharts, 100);
});
</script>
```