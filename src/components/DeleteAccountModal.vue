<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
      <p class="text-gray-700 mb-4">
        Are you sure you want to delete your account? This action is permanent and cannot be undone.
      </p>
      
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <p class="text-sm text-red-700">
              All your data will be permanently deleted, including jobs, settings, and preferences.
            </p>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Type "DELETE" to confirm</label>
        <input
          v-model="confirmText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div class="flex space-x-3">
        <button
          @click="$emit('confirm')"
          :disabled="confirmText !== 'DELETE'"
          class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
        >
          Delete Account
        </button>
        <button
          @click="$emit('cancel')"
          class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const confirmText = ref('');

defineEmits<{
  'confirm': [];
  'cancel': [];
}>();
</script>