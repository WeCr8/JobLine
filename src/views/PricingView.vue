<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p class="text-xl text-gray-600">
          Get started with JobLine.ai and transform your manufacturing operations
        </p>
      </div>

      <!-- Current Subscription Status -->
      <div v-if="authStore.isAuthenticated && subscriptionStore.currentPlan" class="mb-8">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Current Plan: {{ subscriptionStore.currentPlan.name }}
              </h3>
              <div class="mt-1 text-sm text-green-700">
                You're subscribed to {{ subscriptionStore.currentPlan.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="subscriptionStore.error" class="mb-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error
              </h3>
              <div class="mt-1 text-sm text-red-700">
                {{ subscriptionStore.error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ product.description }}
            </p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">$29.99</span>
              <span class="text-gray-600">/month</span>
            </div>

            <ul class="space-y-3 mb-6">
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">AI-powered job tracking</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">Real-time machine monitoring</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">Performance analytics</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">Voice-enabled assistant</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">Quality management</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700">Unlimited users</span>
              </li>
            </ul>

            <button
              v-if="!authStore.isAuthenticated"
              @click="$router.push('/signup')"
              class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Get Started
            </button>
            
            <button
              v-else-if="!subscriptionStore.isSubscribed"
              @click="handleSubscribe(product)"
              :disabled="subscriptionStore.loading"
              class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="subscriptionStore.loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Subscribe Now</span>
            </button>
            
            <div
              v-else-if="subscriptionStore.currentPlan?.id === product.id"
              class="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg font-medium text-center"
            >
              Current Plan
            </div>
            
            <button
              v-else
              @click="handleSubscribe(product)"
              :disabled="subscriptionStore.loading"
              class="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Switch Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to optimize manufacturing
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Job Management</h3>
            <p class="text-gray-600">Track jobs from start to finish with real-time updates and progress monitoring.</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
            <p class="text-gray-600">Voice-enabled AI that understands manufacturing and helps optimize operations.</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p class="text-gray-600">Comprehensive performance analytics and insights to drive continuous improvement.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSubscriptionStore } from '../stores/subscription';
import { products } from '../stripe-config';
import type { Product } from '../stripe-config';
import {
  CheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const subscriptionStore = useSubscriptionStore();

const handleSubscribe = async (product: Product) => {
  try {
    await subscriptionStore.createCheckoutSession(product);
  } catch (error) {
    console.error('Subscription error:', error);
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    subscriptionStore.fetchSubscription();
  }
});
</script>