<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p class="text-gray-600">Manage subscription plans and pricing</p>
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
          @click="showAddPlanModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Plan
        </button>
      </div>
    </div>

    <!-- Plans List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">All Plans</h3>
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

    <!-- Add/Edit Plan Modal -->
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
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '../stores/admin';
import type { SubscriptionPlan } from '../stores/admin';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const adminStore = useAdminStore();
const showAddPlanModal = ref(false);
const savingPlan = ref(false);

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

const featuresText = ref('');

const refreshData = async () => {
  try {
    await adminStore.fetchSubscriptionPlans();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
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

onMounted(async () => {
  await refreshData();
});
</script>