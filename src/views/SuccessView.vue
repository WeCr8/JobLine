<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon class="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h2>
        <p class="mt-2 text-gray-600">
          Thank you for subscribing to JobLine.ai
        </p>
      </div>

      <div v-if="subscriptionStore.loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="subscriptionStore.currentPlan" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Your Subscription
        </h3>
        <p class="text-gray-600 mb-4">
          You're now subscribed to {{ subscriptionStore.currentPlan.name }}
        </p>
        <div class="text-sm text-gray-500">
          <p>Plan: {{ subscriptionStore.currentPlan.description }}</p>
          <p v-if="subscriptionStore.subscription?.current_period_end">
            Next billing: {{ formatDate(subscriptionStore.subscription.current_period_end * 1000) }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <router-link
          to="/dashboard"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 inline-block"
        >
          Go to Dashboard
        </router-link>
        
        <router-link
          to="/pricing"
          class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 inline-block"
        >
          View Subscription Details
        </router-link>
      </div>

      <div class="bg-blue-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">
          What's Next?
        </h4>
        <ul class="text-sm text-blue-800 space-y-1 text-left">
          <li>• Explore the dashboard and job management features</li>
          <li>• Try the AI assistant for voice-enabled operations</li>
          <li>• Set up your team and manufacturing processes</li>
          <li>• Configure integrations with your existing systems</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSubscriptionStore } from '../stores/subscription';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const subscriptionStore = useSubscriptionStore();

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};

onMounted(async () => {
  // Refresh subscription data to get the latest status
  await subscriptionStore.fetchSubscription();
  
  // Optional: You could also verify the session_id from the URL
  const sessionId = route.query.session_id;
  if (sessionId) {
    console.log('Checkout session ID:', sessionId);
  }
});
</script>