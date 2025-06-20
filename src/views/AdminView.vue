<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">SaaS Administration</h1>
        <p class="text-gray-600">Manage your SaaS platform, subscriptions, and global settings</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh Data
        </button>
        <button
          @click="showSettingsModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          <Cog6ToothIcon class="w-4 h-4 inline mr-1" />
          Global Settings
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

    <!-- Main Content Area -->
    <div>
      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(adminStore.analytics.totalRevenue) }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div class="mt-2">
              <span 
                class="text-sm font-medium"
                :class="adminStore.analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ adminStore.analytics.revenueGrowth >= 0 ? '+' : '' }}{{ adminStore.analytics.revenueGrowth }}%
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
                <UserGroupIcon class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div class="mt-2">
              <span 
                class="text-sm font-medium"
                :class="adminStore.analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ adminStore.analytics.userGrowth >= 0 ? '+' : '' }}{{ adminStore.analytics.userGrowth }}%
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
                :class="adminStore.analytics.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ adminStore.analytics.conversionGrowth >= 0 ? '+' : '' }}{{ adminStore.analytics.conversionGrowth }}%
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
                :class="adminStore.analytics.churnChange <= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ adminStore.analytics.churnChange <= 0 ? '' : '+' }}{{ adminStore.analytics.churnChange }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div class="h-64">
              <!-- Revenue Chart would go here -->
              <div class="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">Revenue chart visualization</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div class="h-64">
              <!-- User Growth Chart would go here -->
              <div class="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">User growth visualization</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscription Distribution -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Subscription Plan Distribution</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="(count, plan) in adminStore.analytics.planDistribution" 
              :key="plan"
              class="bg-gray-50 rounded-lg p-4"
            >
              <h4 class="font-medium text-gray-900">{{ plan }}</h4>
              <div class="flex items-center justify-between mt-2">
                <span class="text-2xl font-bold text-gray-900">{{ count }}</span>
                <span class="text-sm text-gray-500">subscribers</span>
              </div>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full"
                    :style="{ width: `${(count / adminStore.analytics.activeUsers) * 100}%` }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ Math.round((count / adminStore.analytics.activeUsers) * 100) }}% of total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Plans Tab -->
      <div v-if="activeTab === 'plans'" class="space-y-6">
        <div class="flex justify-end">
          <button
            @click="showPlanModal()"
            class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 inline mr-1" />
            New Plan
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interval
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribers
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="plan in adminStore.subscriptionPlans" :key="plan.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ plan.name }}</div>
                    <div class="text-sm text-gray-500">{{ plan.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${{ formatCurrency(plan.price / 100) }}</div>
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
                      @click="showPlanModal(plan)"
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
            <div class="flex space-x-2">
              <input
                v-model="subscriptionSearch"
                type="text"
                placeholder="Search by name or email"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <select
                v-model="subscriptionFilter"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Plans</option>
                <option v-for="plan in adminStore.subscriptionPlans" :key="plan.id" :value="plan.name">
                  {{ plan.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                    <div class="text-sm text-gray-900">{{ formatDate(subscription.startDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(subscription.nextBillingDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${{ formatCurrency(subscription.amount / 100) }}/{{ subscription.interval }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="showSubscriptionDetails(subscription)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Details
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
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
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="showUserModal(user)"
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

      <!-- System Tab -->
      <div v-if="activeTab === 'system'" class="space-y-6">
        <!-- API Keys -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">API Keys & Integrations</h3>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                <div class="flex">
                  <input
                    type="password"
                    :value="adminStore.systemSettings.stripeSecretKey"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    @click="toggleShowKey('stripe')"
                    class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                  >
                    <EyeIcon v-if="!showKeys.stripe" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
                <div class="flex">
                  <input
                    type="password"
                    :value="adminStore.systemSettings.stripeWebhookSecret"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    @click="toggleShowKey('webhook')"
                    class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                  >
                    <EyeIcon v-if="!showKeys.webhook" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                <div class="flex">
                  <input
                    type="password"
                    :value="adminStore.systemSettings.openaiApiKey"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    @click="toggleShowKey('openai')"
                    class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                  >
                    <EyeIcon v-if="!showKeys.openai" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                @click="showAPIKeysModal = true"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Update API Keys
              </button>
            </div>
          </div>
        </div>
        
        <!-- AI Configuration -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default AI Model</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.ai.defaultModel }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.ai.temperature }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.ai.maxTokens }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (ms)</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.ai.timeout }}</div>
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
            <button
              @click="showAIConfigModal = true"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Configure AI Settings
            </button>
          </div>
        </div>
        
        <!-- Database Backup -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Database Backup</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Automatic Backup</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.backup.enabled ? 'Enabled' : 'Disabled' }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <div class="text-sm text-gray-900 capitalize">{{ adminStore.systemSettings.backup.frequency }}</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
              <div class="text-sm text-gray-900">{{ adminStore.systemSettings.backup.retentionDays }} days</div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showBackupConfigModal = true"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Configure Backup
            </button>
            
            <button
              @click="triggerManualBackup"
              :disabled="backupInProgress"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ backupInProgress ? 'Backup in Progress...' : 'Trigger Manual Backup' }}
            </button>
          </div>
        </div>
        
        <!-- System Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Application Version</label>
              <div class="text-sm text-gray-900">v1.0.0</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <div class="text-sm text-gray-900">Production</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <div class="text-sm text-gray-900">January 15, 2025</div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Database Status</label>
              <div class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-900">Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingPlan.id ? 'Edit Subscription Plan' : 'Create New Subscription Plan' }}
        </h3>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
            <input
              v-model="editingPlan.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Basic Plan"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              v-model="editingPlan.description"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Essential features for small teams"
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
                  v-model="priceInput"
                  type="text"
                  required
                  class="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="29.99"
                />
              </div>
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
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Price ID</label>
            <input
              v-model="editingPlan.stripePriceId"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. price_1RbnOfE7qtcuEIptjDemZiVn"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
            <textarea
              v-model="featuresInput"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="AI-powered job tracking
Real-time machine monitoring
Performance analytics"
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              id="active"
              v-model="editingPlan.active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="active" class="ml-2 block text-sm text-gray-900">
              Plan is active and available for purchase
            </label>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              {{ editingPlan.id ? 'Update Plan' : 'Create Plan' }}
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="editingUser.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="operator">Operator</option>
              <option value="lead">Lead</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              v-model="editingUser.department"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div class="flex items-center">
            <input
              id="is_active"
              v-model="editingUser.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-900">
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

    <!-- Subscription Details Modal -->
    <div v-if="showSubscriptionDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
            <h4 class="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.userName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.userEmail }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer Since</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubscription.customerSince) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.customerId }}</p>
              </div>
            </div>
          </div>
          
          <!-- Subscription Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 mb-3">Subscription Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.planName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(selectedSubscription.status)"
                >
                  {{ selectedSubscription.status.toUpperCase() }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubscription.startDate) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(selectedSubscription.nextBillingDate) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p class="text-sm text-gray-900">${{ formatCurrency(selectedSubscription.amount / 100) }}/{{ selectedSubscription.interval }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subscription ID</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.subscriptionId }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p class="text-sm text-gray-900 capitalize">
                  {{ selectedSubscription.paymentMethodBrand || 'N/A' }}
                  {{ selectedSubscription.paymentMethodLast4 ? `(**** ${selectedSubscription.paymentMethodLast4})` : '' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Auto Renew</label>
                <p class="text-sm text-gray-900">{{ selectedSubscription.cancelAtPeriodEnd ? 'No' : 'Yes' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Invoice History -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 mb-3">Invoice History</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-white">
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="invoice in selectedSubscription.invoices" :key="invoice.id">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ invoice.id }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatDate(invoice.date) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${{ formatCurrency(invoice.amount / 100) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap">
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
          
          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              v-if="selectedSubscription.status === 'active' && !selectedSubscription.cancelAtPeriodEnd"
              @click="confirmCancelSubscription(selectedSubscription)"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Cancel Subscription
            </button>
            <button
              @click="showSubscriptionDetailsModal = false"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- API Keys Modal -->
    <div v-if="showAPIKeysModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Update API Keys</h3>
        
        <form @submit.prevent="saveAPIKeys" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
            <input
              v-model="editingSettings.stripeSecretKey"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="sk_live_..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
            <input
              v-model="editingSettings.stripeWebhookSecret"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="whsec_..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
            <input
              v-model="editingSettings.openaiApiKey"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="sk-..."
            />
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save Keys
            </button>
            <button
              type="button"
              @click="showAPIKeysModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Config Modal -->
    <div v-if="showAIConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
        
        <form @submit.prevent="saveAIConfig" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Default Model</label>
            <select
              v-model="editingSettings.ai.defaultModel"
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
              v-model.number="editingSettings.ai.temperature"
              type="number"
              min="0"
              max="1"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <p class="text-xs text-gray-500 mt-1">0 = deterministic, 1 = creative</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
            <input
              v-model.number="editingSettings.ai.maxTokens"
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
              v-model.number="editingSettings.ai.timeout"
              type="number"
              min="5000"
              step="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save Configuration
            </button>
            <button
              type="button"
              @click="showAIConfigModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Backup Config Modal -->
    <div v-if="showBackupConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Backup Configuration</h3>
        
        <form @submit.prevent="saveBackupConfig" class="space-y-4">
          <div class="flex items-center">
            <input
              id="backup-enabled"
              v-model="editingSettings.backup.enabled"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="backup-enabled" class="ml-2 block text-sm text-gray-900">
              Enable automatic backups
            </label>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
            <select
              v-model="editingSettings.backup.frequency"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              :disabled="!editingSettings.backup.enabled"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
            <input
              v-model.number="editingSettings.backup.retentionDays"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              :disabled="!editingSettings.backup.enabled"
            />
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save Configuration
            </button>
            <button
              type="button"
              @click="showBackupConfigModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Global System Settings</h3>
          <button
            @click="showSettingsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveGlobalSettings" class="space-y-6">
          <!-- Application Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Application Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
                <input
                  v-model="globalSettings.appName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  v-model="globalSettings.supportEmail"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                  <select
                    v-model="globalSettings.defaultRole"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="operator">Operator</option>
                    <option value="lead">Lead</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
                  <input
                    v-model="globalSettings.defaultDepartment"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Feature Flags -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Feature Flags</h4>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  id="enable-voice"
                  v-model="globalSettings.features.enableVoice"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="enable-voice" class="ml-2 block text-sm text-gray-900">
                  Enable Voice Assistant
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="enable-image"
                  v-model="globalSettings.features.enableImageRecognition"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="enable-image" class="ml-2 block text-sm text-gray-900">
                  Enable Image Recognition
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="enable-performance"
                  v-model="globalSettings.features.enablePerformanceModule"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="enable-performance" class="ml-2 block text-sm text-gray-900">
                  Enable Performance Module
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="enable-optimization"
                  v-model="globalSettings.features.enableOptimizationModule"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="enable-optimization" class="ml-2 block text-sm text-gray-900">
                  Enable Optimization Module
                </label>
              </div>
            </div>
          </div>
          
          <!-- Email Configuration -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Email Configuration</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    v-model="globalSettings.email.smtpHost"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    v-model.number="globalSettings.email.smtpPort"
                    type="number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                  <input
                    v-model="globalSettings.email.smtpUsername"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                  <input
                    v-model="globalSettings.email.smtpPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save Settings
            </button>
            <button
              type="button"
              @click="showSettingsModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ confirmationTitle }}</h3>
        <p class="text-gray-700 mb-6">{{ confirmationMessage }}</p>
        
        <div class="flex space-x-3">
          <button
            @click="confirmAction"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
          >
            {{ confirmationButtonText }}
          </button>
          <button
            @click="showConfirmationModal = false"
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
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useAdminStore } from '../stores/admin';
import type { SubscriptionPlan, Subscription, User, SystemSettings } from '../stores/admin';
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  UsersIcon,
  ServerIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();

// Tabs
const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: ArrowTrendingUpIcon },
  { id: 'plans', name: 'Subscription Plans', icon: CreditCardIcon },
  { id: 'subscriptions', name: 'Active Subscriptions', icon: CurrencyDollarIcon },
  { id: 'users', name: 'User Management', icon: UsersIcon },
  { id: 'system', name: 'System Settings', icon: ServerIcon }
];
const activeTab = ref('dashboard');

// Filters and search
const subscriptionSearch = ref('');
const subscriptionFilter = ref('');
const userSearch = ref('');
const userRoleFilter = ref('');

// Modals
const showPlanModal = ref(false);
const showUserModal = ref(false);
const showSubscriptionDetailsModal = ref(false);
const showAPIKeysModal = ref(false);
const showAIConfigModal = ref(false);
const showBackupConfigModal = ref(false);
const showSettingsModal = ref(false);
const showConfirmationModal = ref(false);

// Editing states
const editingPlan = ref<SubscriptionPlan>({
  id: '',
  name: '',
  description: '',
  price: 0,
  interval: 'monthly',
  stripePriceId: '',
  active: true,
  features: []
});
const priceInput = ref('');
const featuresInput = ref('');

const editingUser = ref<User>({
  id: '',
  name: '',
  email: '',
  role: 'operator',
  department: '',
  is_active: true,
  created_at: ''
});

const editingSettings = ref<SystemSettings>({
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

const globalSettings = ref({
  appName: 'JobLine.ai',
  supportEmail: 'support@jobline.ai',
  defaultRole: 'operator',
  defaultDepartment: 'Manufacturing',
  features: {
    enableVoice: true,
    enableImageRecognition: true,
    enablePerformanceModule: true,
    enableOptimizationModule: true
  },
  email: {
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'notifications@jobline.ai',
    smtpPassword: '********'
  }
});

// Selected items
const selectedSubscription = ref<Subscription | null>(null);

// Confirmation modal
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const confirmationButtonText = ref('Confirm');
const confirmationCallback = ref<() => void>(() => {});

// Other states
const backupInProgress = ref(false);
const showKeys = ref({
  stripe: false,
  webhook: false,
  openai: false
});

// Computed properties
const filteredSubscriptions = computed(() => {
  let filtered = adminStore.activeSubscriptions;
  
  if (subscriptionSearch.value) {
    const search = subscriptionSearch.value.toLowerCase();
    filtered = filtered.filter(sub => 
      sub.userName.toLowerCase().includes(search) || 
      sub.userEmail.toLowerCase().includes(search)
    );
  }
  
  if (subscriptionFilter.value) {
    filtered = filtered.filter(sub => sub.planName === subscriptionFilter.value);
  }
  
  return filtered;
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
const refreshData = async () => {
  await Promise.all([
    adminStore.fetchSubscriptionPlans(),
    adminStore.fetchActiveSubscriptions(),
    adminStore.fetchUsers(),
    adminStore.fetchAnalytics(),
    adminStore.fetchSystemSettings()
  ]);
};

const showPlanModalFn = (plan?: SubscriptionPlan) => {
  if (plan) {
    editingPlan.value = { ...plan };
    priceInput.value = (plan.price / 100).toString();
    featuresInput.value = plan.features.join('\n');
  } else {
    editingPlan.value = {
      id: '',
      name: '',
      description: '',
      price: 0,
      interval: 'monthly',
      stripePriceId: '',
      active: true,
      features: []
    };
    priceInput.value = '';
    featuresInput.value = '';
  }
  showPlanModal.value = true;
};

const savePlan = async () => {
  try {
    // Convert price from dollars to cents
    editingPlan.value.price = Math.round(parseFloat(priceInput.value) * 100);
    
    // Convert features from text to array
    editingPlan.value.features = featuresInput.value
      .split('\n')
      .map(feature => feature.trim())
      .filter(feature => feature);
    
    await adminStore.saveSubscriptionPlan(editingPlan.value);
    showPlanModal.value = false;
  } catch (error) {
    console.error('Error saving plan:', error);
  }
};

const togglePlanStatus = async (plan: SubscriptionPlan) => {
  try {
    const updatedPlan = { ...plan, active: !plan.active };
    await adminStore.saveSubscriptionPlan(updatedPlan);
  } catch (error) {
    console.error('Error toggling plan status:', error);
  }
};

const showUserModal = (user: User) => {
  editingUser.value = { ...user };
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    await adminStore.updateUser(editingUser.value);
    showUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
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

const showSubscriptionDetails = (subscription: Subscription) => {
  selectedSubscription.value = subscription;
  showSubscriptionDetailsModal.value = true;
};

const confirmCancelSubscription = (subscription: Subscription) => {
  confirmationTitle.value = 'Cancel Subscription';
  confirmationMessage.value = `Are you sure you want to cancel the subscription for ${subscription.userName}? The subscription will remain active until the end of the current billing period.`;
  confirmationButtonText.value = 'Cancel Subscription';
  confirmationCallback.value = () => cancelSubscription(subscription.subscriptionId);
  showConfirmationModal.value = true;
};

const cancelSubscription = async (subscriptionId: string) => {
  try {
    await adminStore.cancelSubscription(subscriptionId);
    showConfirmationModal.value = false;
    
    // If we're in the subscription details modal, update the selected subscription
    if (showSubscriptionDetailsModal.value && selectedSubscription.value) {
      selectedSubscription.value.status = 'canceled';
      selectedSubscription.value.cancelAtPeriodEnd = true;
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
};

const toggleShowKey = (key: 'stripe' | 'webhook' | 'openai') => {
  showKeys.value[key] = !showKeys.value[key];
};

const saveAPIKeys = async () => {
  try {
    await adminStore.saveSystemSettings({
      ...adminStore.systemSettings,
      stripeSecretKey: editingSettings.value.stripeSecretKey,
      stripeWebhookSecret: editingSettings.value.stripeWebhookSecret,
      openaiApiKey: editingSettings.value.openaiApiKey
    });
    showAPIKeysModal.value = false;
  } catch (error) {
    console.error('Error saving API keys:', error);
  }
};

const saveAIConfig = async () => {
  try {
    await adminStore.saveSystemSettings({
      ...adminStore.systemSettings,
      ai: editingSettings.value.ai
    });
    showAIConfigModal.value = false;
  } catch (error) {
    console.error('Error saving AI config:', error);
  }
};

const saveBackupConfig = async () => {
  try {
    await adminStore.saveSystemSettings({
      ...adminStore.systemSettings,
      backup: editingSettings.value.backup
    });
    showBackupConfigModal.value = false;
  } catch (error) {
    console.error('Error saving backup config:', error);
  }
};

const saveGlobalSettings = async () => {
  // In a real app, you would save these settings to the database
  console.log('Saving global settings:', globalSettings.value);
  showSettingsModal.value = false;
};

const triggerManualBackup = async () => {
  backupInProgress.value = true;
  try {
    await adminStore.triggerManualBackup();
  } catch (error) {
    console.error('Error triggering backup:', error);
  } finally {
    backupInProgress.value = false;
  }
};

const confirmAction = () => {
  confirmationCallback.value();
};

// Utility functions
const formatCurrency = (amount: number) => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

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

// Lifecycle hooks
onMounted(async () => {
  await refreshData();
  
  // Initialize editing settings
  editingSettings.value = { ...adminStore.systemSettings };
});
</script>