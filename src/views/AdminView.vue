<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Administration Panel</h1>
        <p class="text-gray-600">Manage subscriptions, users, and system settings</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Refresh Data
        </button>
        <button
          @click="showSettingsModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          System Settings
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
      <!-- Subscriptions Tab -->
      <div v-if="activeTab === 'subscriptions'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Subscription Plans</h2>
            <button
              @click="showPlanModal = true"
              class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
            >
              Add Plan
            </button>
          </div>
          
          <div class="p-6">
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <div v-else-if="subscriptionPlans.length === 0" class="text-center py-8">
              <CreditCardIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No subscription plans defined</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="plan in subscriptionPlans" :key="plan.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ plan.name }}</div>
                      <div class="text-sm text-gray-500">{{ plan.description }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">${{ (plan.price / 100).toFixed(2) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ plan.interval }}</div>
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
                      {{ plan.subscriberCount }}
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

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
          </div>
          
          <div class="p-6">
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <div v-else-if="activeSubscriptions.length === 0" class="text-center py-8">
              <UserIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No active subscriptions</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="sub in activeSubscriptions" :key="sub.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ sub.userName }}</div>
                      <div class="text-sm text-gray-500">{{ sub.userEmail }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ sub.planName }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getSubscriptionStatusClass(sub.status)"
                      >
                        {{ formatSubscriptionStatus(sub.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(sub.startDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(sub.nextBillingDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="viewSubscriptionDetails(sub)"
                        class="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Details
                      </button>
                      <button 
                        @click="cancelSubscription(sub)"
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

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">User Management</h2>
            <div class="flex space-x-2">
              <div class="relative">
                <input
                  v-model="userSearchQuery"
                  type="text"
                  placeholder="Search users..."
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
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
          
          <div class="p-6">
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
              <UserIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No users found</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span class="text-primary-600 font-medium text-sm">{{ user.name.charAt(0) }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getRoleClass(user.role)"
                      >
                        {{ user.role.toUpperCase() }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.department || 'Not assigned' }}
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
                      {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
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

      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(analytics.totalRevenue) }}</p>
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
              <span class="text-sm text-red-600 font-medium">{{ analytics.churnChange > 0 ? '+' : '' }}{{ analytics.churnChange }}% from last month</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
            </div>
            <div class="p-6 h-80">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">User Growth</h2>
            </div>
            <div class="p-6 h-80">
              <canvas ref="userChart"></canvas>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Subscription Distribution</h2>
          </div>
          <div class="p-6 h-80">
            <canvas ref="subscriptionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Application Settings</h2>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="saveSettings" class="space-y-6">
              <!-- General Settings -->
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">General Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
                    <input
                      v-model="settings.appName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input
                      v-model="settings.supportEmail"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                    <select
                      v-model="settings.defaultRole"
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
                    <input
                      v-model="settings.defaultDepartment"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Feature Flags -->
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">Feature Flags</h3>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      id="enableVoice"
                      v-model="settings.features.enableVoice"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label for="enableVoice" class="ml-2 block text-sm text-gray-900">
                      Enable Voice Assistant
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="enableImageRecognition"
                      v-model="settings.features.enableImageRecognition"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label for="enableImageRecognition" class="ml-2 block text-sm text-gray-900">
                      Enable Image Recognition
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="enablePerformanceModule"
                      v-model="settings.features.enablePerformanceModule"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label for="enablePerformanceModule" class="ml-2 block text-sm text-gray-900">
                      Enable Performance Module
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="enableOptimizationModule"
                      v-model="settings.features.enableOptimizationModule"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label for="enableOptimizationModule" class="ml-2 block text-sm text-gray-900">
                      Enable AI Optimization Module
                    </label>
                  </div>
                </div>
              </div>

              <!-- Email Settings -->
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">Email Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                      v-model="settings.email.smtpHost"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                      v-model="settings.email.smtpPort"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                    <input
                      v-model="settings.email.smtpUsername"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                    <input
                      v-model="settings.email.smtpPassword"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end">
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
            <h2 class="text-lg font-semibold text-gray-900">System Information</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">Application</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Version:</span>
                    <span class="text-sm font-medium text-gray-900">{{ systemInfo.version }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Environment:</span>
                    <span class="text-sm font-medium text-gray-900">{{ systemInfo.environment }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Last Updated:</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatDate(systemInfo.lastUpdated) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">Database</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Status:</span>
                    <span 
                      class="text-sm font-medium"
                      :class="systemInfo.database.status === 'Connected' ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ systemInfo.database.status }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Size:</span>
                    <span class="text-sm font-medium text-gray-900">{{ systemInfo.database.size }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Last Backup:</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatDate(systemInfo.database.lastBackup) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">System Logs</h3>
              <div class="bg-gray-100 p-4 rounded-md h-40 overflow-y-auto font-mono text-xs">
                <div v-for="(log, index) in systemInfo.logs" :key="index" class="mb-1">
                  <span 
                    class="mr-2"
                    :class="{
                      'text-red-600': log.level === 'ERROR',
                      'text-yellow-600': log.level === 'WARN',
                      'text-blue-600': log.level === 'INFO',
                      'text-gray-600': log.level === 'DEBUG'
                    }"
                  >
                    [{{ log.level }}]
                  </span>
                  <span class="text-gray-500">{{ log.timestamp }} - </span>
                  <span>{{ log.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Plan Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingPlan ? 'Edit Plan' : 'Add New Plan' }}
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
              placeholder="Basic features for small teams"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                v-model="planForm.price"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Price ID</label>
            <input
              v-model="planForm.stripePriceId"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="price_1234567890"
            />
          </div>

          <div class="flex items-center">
            <input
              id="planActive"
              v-model="planForm.active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="planActive" class="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              {{ editingPlan ? 'Update Plan' : 'Add Plan' }}
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

    <!-- Edit User Modal -->
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
              id="userActive"
              v-model="userForm.is_active"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="userActive" class="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Update User
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
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Subscription Details</h3>
          <button
            @click="showSubscriptionDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="selectedSubscription" class="space-y-6">
          <!-- User Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
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
                <span class="text-sm text-gray-500">Stripe Customer ID:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.customerId }}</p>
              </div>
            </div>
          </div>

          <!-- Subscription Info -->
          <div>
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
                  {{ formatSubscriptionStatus(selectedSubscription.status) }}
                </span>
              </div>
              <div>
                <span class="text-sm text-gray-500">Subscription ID:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.subscriptionId }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Price ID:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.priceId }}</p>
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
                <p class="text-sm font-medium text-gray-900">${{ (selectedSubscription.amount / 100).toFixed(2) }} / {{ selectedSubscription.interval }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Cancel at Period End:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.cancelAtPeriodEnd ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-2">Payment Method</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-500">Card Brand:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.paymentMethodBrand || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Last 4:</span>
                <p class="text-sm font-medium text-gray-900">{{ selectedSubscription.paymentMethodLast4 ? '••••' + selectedSubscription.paymentMethodLast4 : 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Invoice History -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-2">Invoice History</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="invoice in selectedSubscription.invoices" :key="invoice.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(invoice.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ (invoice.amount / 100).toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getInvoiceStatusClass(invoice.status)"
                      >
                        {{ invoice.status.toUpperCase() }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ invoice.id }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="updateSubscription(selectedSubscription)"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Update Subscription
            </button>
            <button
              @click="cancelSubscription(selectedSubscription)"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- System Settings Modal -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">System Settings</h3>
          <button
            @click="showSettingsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveSystemSettings" class="space-y-6">
          <!-- API Keys -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">API Keys</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                <input
                  v-model="systemSettings.stripeSecretKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stripe Webhook Secret</label>
                <input
                  v-model="systemSettings.stripeWebhookSecret"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                <input
                  v-model="systemSettings.openaiApiKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- AI Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">AI Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Model</label>
                <select
                  v-model="systemSettings.ai.defaultModel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Request Timeout (ms)</label>
                <input
                  v-model.number="systemSettings.ai.timeout"
                  type="number"
                  min="1000"
                  step="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Backup Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Backup Settings</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Automatic Backups</label>
                <div class="flex items-center">
                  <input
                    id="enableBackups"
                    v-model="systemSettings.backup.enabled"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="enableBackups" class="ml-2 block text-sm text-gray-900">
                    Enable automatic database backups
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  v-model="systemSettings.backup.frequency"
                  :disabled="!systemSettings.backup.enabled"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                <input
                  v-model.number="systemSettings.backup.retentionDays"
                  type="number"
                  min="1"
                  :disabled="!systemSettings.backup.enabled"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="triggerManualBackup"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Trigger Manual Backup
            </button>
            <button
              type="submit"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Save System Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { format } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import Chart from 'chart.js/auto';
import {
  CreditCardIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// State variables
const activeTab = ref('subscriptions');
const loading = ref(false);
const showPlanModal = ref(false);
const showUserModal = ref(false);
const showSubscriptionDetailsModal = ref(false);
const showSettingsModal = ref(false);
const editingPlan = ref(false);
const userSearchQuery = ref('');
const userRoleFilter = ref('');

// Chart references
const revenueChart = ref<HTMLCanvasElement | null>(null);
const userChart = ref<HTMLCanvasElement | null>(null);
const subscriptionChart = ref<HTMLCanvasElement | null>(null);

// Data models
const subscriptionPlans = ref([
  {
    id: '1',
    name: 'Basic Plan',
    description: 'Essential features for small teams',
    price: 2999, // in cents
    interval: 'monthly',
    stripePriceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
    active: true,
    subscriberCount: 45,
    features: [
      'AI-powered job tracking',
      'Real-time machine monitoring',
      'Performance analytics',
      'Voice-enabled assistant',
      'Quality management',
      'Unlimited users'
    ]
  },
  {
    id: '2',
    name: 'Pro Plan',
    description: 'Advanced features for growing teams',
    price: 4999, // in cents
    interval: 'monthly',
    stripePriceId: 'price_2RbnOfE7qtcuEIptjDemZiVn',
    active: true,
    subscriberCount: 28,
    features: [
      'All Basic features',
      'Advanced AI optimization',
      'Custom integrations',
      'Priority support',
      'Advanced reporting',
      'API access'
    ]
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'Complete solution for large organizations',
    price: 9999, // in cents
    interval: 'monthly',
    stripePriceId: 'price_3RbnOfE7qtcuEIptjDemZiVn',
    active: true,
    subscriberCount: 12,
    features: [
      'All Pro features',
      'Dedicated account manager',
      'Custom AI training',
      'On-premise deployment option',
      'SSO integration',
      'SLA guarantees'
    ]
  }
]);

const activeSubscriptions = ref([
  {
    id: '1',
    userId: 'user-1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    customerId: 'cus_123456',
    subscriptionId: 'sub_123456',
    planName: 'Basic Plan',
    priceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    nextBillingDate: '2024-02-01T00:00:00Z',
    amount: 2999,
    interval: 'monthly',
    cancelAtPeriodEnd: false,
    paymentMethodBrand: 'visa',
    paymentMethodLast4: '4242',
    customerSince: '2024-01-01T00:00:00Z',
    invoices: [
      {
        id: 'in_123456',
        date: '2024-01-01T00:00:00Z',
        amount: 2999,
        status: 'paid'
      }
    ]
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    customerId: 'cus_234567',
    subscriptionId: 'sub_234567',
    planName: 'Pro Plan',
    priceId: 'price_2RbnOfE7qtcuEIptjDemZiVn',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    nextBillingDate: '2024-02-15T00:00:00Z',
    amount: 4999,
    interval: 'monthly',
    cancelAtPeriodEnd: false,
    paymentMethodBrand: 'mastercard',
    paymentMethodLast4: '5678',
    customerSince: '2024-01-15T00:00:00Z',
    invoices: [
      {
        id: 'in_234567',
        date: '2024-01-15T00:00:00Z',
        amount: 4999,
        status: 'paid'
      }
    ]
  }
]);

const users = ref([
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'operator',
    department: 'Manufacturing',
    is_active: true,
    last_login: '2024-01-12T14:30:00Z',
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'manager',
    department: 'Quality Control',
    is_active: true,
    last_login: '2024-01-12T10:15:00Z',
    created_at: '2024-01-05T09:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'admin',
    department: 'Administration',
    is_active: true,
    last_login: '2024-01-12T16:45:00Z',
    created_at: '2024-01-01T08:00:00Z'
  }
]);

const analytics = ref({
  totalRevenue: 12500,
  revenueGrowth: 15,
  activeUsers: 85,
  userGrowth: 12,
  conversionRate: 8.5,
  conversionGrowth: 2.3,
  churnRate: 3.2,
  churnChange: -0.5,
  monthlyRevenue: [8500, 9200, 10100, 9800, 11200, 12500],
  monthlyUsers: [65, 70, 72, 78, 80, 85],
  planDistribution: {
    'Basic Plan': 45,
    'Pro Plan': 28,
    'Enterprise Plan': 12
  }
});

const systemInfo = ref({
  version: '1.0.0',
  environment: 'Production',
  lastUpdated: '2024-01-10T12:00:00Z',
  database: {
    status: 'Connected',
    size: '256 MB',
    lastBackup: '2024-01-12T00:00:00Z'
  },
  logs: [
    { level: 'INFO', timestamp: '2024-01-12T16:45:23Z', message: 'System started successfully' },
    { level: 'INFO', timestamp: '2024-01-12T16:45:24Z', message: 'Database connection established' },
    { level: 'INFO', timestamp: '2024-01-12T16:46:12Z', message: 'User mike@example.com logged in' },
    { level: 'WARN', timestamp: '2024-01-12T17:12:45Z', message: 'High CPU usage detected (85%)' },
    { level: 'ERROR', timestamp: '2024-01-12T17:30:22Z', message: 'Failed to process webhook: timeout' },
    { level: 'INFO', timestamp: '2024-01-12T17:35:10Z', message: 'Automatic backup completed' }
  ]
});

const settings = ref({
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

const systemSettings = ref({
  stripeSecretKey: '********',
  stripeWebhookSecret: '********',
  openaiApiKey: '********',
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

// Form models
const planForm = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  interval: 'monthly',
  stripePriceId: '',
  active: true,
  features: []
});

const userForm = ref({
  id: '',
  name: '',
  email: '',
  role: 'operator',
  department: '',
  is_active: true
});

// Selected items
const selectedSubscription = ref(null);

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query)
    );
  }
  
  if (userRoleFilter.value) {
    filtered = filtered.filter(user => user.role === userRoleFilter.value);
  }
  
  return filtered;
});

// Tab configuration
const tabs = [
  { id: 'subscriptions', name: 'Subscriptions', icon: CreditCardIcon },
  { id: 'users', name: 'Users', icon: UserIcon },
  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon }
];

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US');
};

const formatSubscriptionStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getSubscriptionStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'trialing': 'bg-blue-100 text-blue-800',
    'past_due': 'bg-yellow-100 text-yellow-800',
    'canceled': 'bg-red-100 text-red-800',
    'unpaid': 'bg-red-100 text-red-800',
    'incomplete': 'bg-orange-100 text-orange-800',
    'incomplete_expired': 'bg-gray-100 text-gray-800',
    'paused': 'bg-purple-100 text-purple-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const getInvoiceStatusClass = (status: string) => {
  const classes = {
    'paid': 'bg-green-100 text-green-800',
    'open': 'bg-blue-100 text-blue-800',
    'uncollectible': 'bg-red-100 text-red-800',
    'void': 'bg-gray-100 text-gray-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const getRoleClass = (role: string) => {
  const classes = {
    'admin': 'bg-red-100 text-red-800',
    'manager': 'bg-purple-100 text-purple-800',
    'supervisor': 'bg-blue-100 text-blue-800',
    'lead': 'bg-green-100 text-green-800',
    'operator': 'bg-yellow-100 text-yellow-800',
    'customer': 'bg-gray-100 text-gray-800'
  };
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const refreshData = async () => {
  loading.value = true;
  
  try {
    // Fetch subscription plans
    // const { data: plans, error: plansError } = await supabase
    //   .from('subscription_plans')
    //   .select('*');
    
    // if (plansError) throw plansError;
    // subscriptionPlans.value = plans;
    
    // Fetch active subscriptions
    // const { data: subscriptions, error: subscriptionsError } = await supabase
    //   .from('stripe_subscriptions')
    //   .select(`
    //     *,
    //     customers:stripe_customers(user_id)
    //   `)
    //   .eq('status', 'active');
    
    // if (subscriptionsError) throw subscriptionsError;
    // activeSubscriptions.value = subscriptions;
    
    // Fetch users
    // const { data: usersData, error: usersError } = await supabase
    //   .from('users')
    //   .select('*');
    
    // if (usersError) throw usersError;
    // users.value = usersData;
    
    // For now, we'll use the mock data
    console.log('Data refreshed');
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    loading.value = false;
  }
};

const editPlan = (plan: any) => {
  editingPlan.value = true;
  planForm.value = { ...plan };
  showPlanModal.value = true;
};

const savePlan = async () => {
  try {
    if (editingPlan.value) {
      // Update existing plan
      const index = subscriptionPlans.value.findIndex(p => p.id === planForm.value.id);
      if (index !== -1) {
        subscriptionPlans.value[index] = { ...planForm.value };
      }
      
      // In a real app, you would update the plan in the database
      // await supabase
      //   .from('subscription_plans')
      //   .update(planForm.value)
      //   .eq('id', planForm.value.id);
    } else {
      // Create new plan
      const newPlan = {
        ...planForm.value,
        id: Date.now().toString(),
        subscriberCount: 0
      };
      subscriptionPlans.value.push(newPlan);
      
      // In a real app, you would insert the plan in the database
      // await supabase
      //   .from('subscription_plans')
      //   .insert(newPlan);
    }
    
    showPlanModal.value = false;
    editingPlan.value = false;
    resetPlanForm();
  } catch (error) {
    console.error('Error saving plan:', error);
  }
};

const resetPlanForm = () => {
  planForm.value = {
    id: '',
    name: '',
    description: '',
    price: 0,
    interval: 'monthly',
    stripePriceId: '',
    active: true,
    features: []
  };
};

const togglePlanStatus = async (plan: any) => {
  try {
    plan.active = !plan.active;
    
    // In a real app, you would update the plan status in the database
    // await supabase
    //   .from('subscription_plans')
    //   .update({ active: plan.active })
    //   .eq('id', plan.id);
  } catch (error) {
    console.error('Error toggling plan status:', error);
  }
};

const editUser = (user: any) => {
  userForm.value = { ...user };
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    const index = users.value.findIndex(u => u.id === userForm.value.id);
    if (index !== -1) {
      users.value[index] = { ...userForm.value };
    }
    
    // In a real app, you would update the user in the database
    // await supabase
    //   .from('users')
    //   .update(userForm.value)
    //   .eq('id', userForm.value.id);
    
    showUserModal.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const toggleUserStatus = async (user: any) => {
  try {
    user.is_active = !user.is_active;
    
    // In a real app, you would update the user status in the database
    // await supabase
    //   .from('users')
    //   .update({ is_active: user.is_active })
    //   .eq('id', user.id);
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

const viewSubscriptionDetails = (subscription: any) => {
  selectedSubscription.value = subscription;
  showSubscriptionDetailsModal.value = true;
};

const updateSubscription = (subscription: any) => {
  console.log('Update subscription:', subscription);
  // This would open a modal to update the subscription
};

const cancelSubscription = async (subscription: any) => {
  if (confirm(`Are you sure you want to cancel the subscription for ${subscription.userName}?`)) {
    try {
      // In a real app, you would call the Stripe API to cancel the subscription
      console.log('Cancelling subscription:', subscription.subscriptionId);
      
      // Update the subscription status
      subscription.status = 'canceled';
      subscription.cancelAtPeriodEnd = true;
      
      // In a real app, you would update the subscription in the database
      // await supabase
      //   .from('stripe_subscriptions')
      //   .update({ 
      //     status: 'canceled',
      //     cancel_at_period_end: true
      //   })
      //   .eq('subscription_id', subscription.subscriptionId);
      
      // Close the modal if it's open
      if (showSubscriptionDetailsModal.value) {
        showSubscriptionDetailsModal.value = false;
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  }
};

const saveSettings = async () => {
  try {
    // In a real app, you would save the settings to the database
    console.log('Saving settings:', settings.value);
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

const saveSystemSettings = async () => {
  try {
    // In a real app, you would save the system settings to the database
    console.log('Saving system settings:', systemSettings.value);
    showSettingsModal.value = false;
    alert('System settings saved successfully!');
  } catch (error) {
    console.error('Error saving system settings:', error);
  }
};

const triggerManualBackup = async () => {
  try {
    // In a real app, you would trigger a manual backup
    console.log('Triggering manual backup');
    alert('Manual backup initiated. This may take a few minutes.');
  } catch (error) {
    console.error('Error triggering manual backup:', error);
  }
};

// Initialize charts
const initCharts = () => {
  // Revenue Chart
  if (revenueChart.value) {
    const ctx = revenueChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Revenue ($)',
            data: analytics.value.monthlyRevenue,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

  // User Growth Chart
  if (userChart.value) {
    const ctx = userChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Active Users',
            data: analytics.value.monthlyUsers,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Subscription Distribution Chart
  if (subscriptionChart.value) {
    const ctx = subscriptionChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(analytics.value.planDistribution),
          datasets: [{
            data: Object.values(analytics.value.planDistribution),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(139, 92, 246, 1)'
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

// Watch for tab changes to initialize charts
watch(activeTab, (newTab) => {
  if (newTab === 'analytics') {
    // Use nextTick to ensure the DOM is updated before initializing charts
    setTimeout(() => {
      initCharts();
    }, 100);
  }
});

// Lifecycle hooks
onMounted(() => {
  refreshData();
});
</script>