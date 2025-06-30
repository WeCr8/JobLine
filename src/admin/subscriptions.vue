<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p class="text-gray-600">Manage customer subscriptions and payment history</p>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Plan</label>
          <select
            v-model="planFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Plans</option>
            <option v-for="plan in adminStore.subscriptionPlans" :key="plan.id" :value="plan.stripePriceId">
              {{ plan.name }}
            </option>
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
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Subscriptions List -->
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
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sub in filteredSubscriptions" :key="sub.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ sub.userName }}</div>
                  <div class="text-xs text-gray-500">{{ sub.userEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ sub.planName }}</div>
                  <div class="text-xs text-gray-500 capitalize">{{ sub.interval }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${{ (sub.amount / 100).toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getSubscriptionStatusClass(sub.status)"
                  >
                    {{ sub.status.toUpperCase() }}
                  </span>
                  <div v-if="sub.cancelAtPeriodEnd" class="text-xs text-red-500 mt-1">Cancels at period end</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sub.startDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sub.nextBillingDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="viewInvoices(sub)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Invoices
                  </button>
                  <button
                    v-if="sub.status === 'active' && !sub.cancelAtPeriodEnd"
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

    <!-- View Invoices Modal -->
    <div v-if="showInvoicesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Invoices for {{ selectedSubscription?.userName }}</h3>
          <button
            @click="showInvoicesModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="invoice in selectedSubscription?.invoices" :key="invoice.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900">{{ invoice.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${{ (invoice.amount / 100).toFixed(2) }}</div>
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
                  <button
                    @click="downloadInvoice(invoice)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Cancel Subscription Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cancel Subscription</h3>
        
        <p class="text-gray-700 mb-4">
          Are you sure you want to cancel the subscription for <span class="font-medium">{{ selectedSubscription?.userName }}</span>?
        </p>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                The subscription will remain active until the end of the current billing period on {{ formatDate(selectedSubscription?.nextBillingDate || '') }}.
              </p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="confirmCancelSubscription"
            :disabled="cancelling"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ cancelling ? 'Cancelling...' : 'Confirm Cancellation' }}
          </button>
          <button
            type="button"
            @click="showCancelModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Keep Subscription
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
import type { Subscription, Invoice } from '../types/admin';
import { ArrowPathIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const searchQuery = ref('');
const planFilter = ref('all');
const statusFilter = ref('all');
const showInvoicesModal = ref(false);
const showCancelModal = ref(false);
const selectedSubscription = ref<Subscription | null>(null);
const cancelling = ref(false);

const filteredSubscriptions = computed(() => {
  let filtered = adminStore.activeSubscriptions;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(sub => 
      sub.userName.toLowerCase().includes(query) || 
      sub.userEmail.toLowerCase().includes(query)
    );
  }
  
  // Apply plan filter
  if (planFilter.value !== 'all') {
    filtered = filtered.filter(sub => sub.priceId === planFilter.value);
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(sub => sub.status === statusFilter.value);
  }
  
  return filtered;
});

const refreshData = async () => {
  try {
    await adminStore.fetchActiveSubscriptions();
    await adminStore.fetchSubscriptionPlans();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
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

const getInvoiceStatusClass = (status: string) => {
  const classes = {
    'paid': 'bg-green-100 text-green-800',
    'open': 'bg-blue-100 text-blue-800',
    'uncollectible': 'bg-red-100 text-red-800',
    'void': 'bg-gray-100 text-gray-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const viewInvoices = (subscription: Subscription) => {
  selectedSubscription.value = subscription;
  showInvoicesModal.value = true;
};

const downloadInvoice = (invoice: Invoice) => {
  // In a real app, you would implement this
  console.log('Download invoice:', invoice);
};

const cancelSubscription = (subscription: Subscription) => {
  selectedSubscription.value = subscription;
  showCancelModal.value = true;
};

const confirmCancelSubscription = async () => {
  if (!selectedSubscription.value) return;
  
  cancelling.value = true;
  try {
    await adminStore.cancelSubscription(selectedSubscription.value.subscriptionId);
    showCancelModal.value = false;
    await refreshData();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  } finally {
    cancelling.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});
</script>