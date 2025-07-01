<template>
  <SettingsSection title="Data Management">
    <div class="space-y-6">
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-2">Export Your Data</h4>
        <p class="text-sm text-gray-600 mb-4">Download a copy of your personal data</p>
        <button
          @click="$emit('export-data')"
          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Export Data
        </button>
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <h4 class="text-sm font-medium text-red-600 mb-2">Delete Account</h4>
        <p class="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data</p>
        <button
          @click="$emit('delete-account')"
          class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
import SettingsSection from './SettingsSection.vue';

defineEmits<{
  'export-data': [];
  'delete-account': [];
}>();
</script>