<template>
  <SettingsSection title="Security Settings">
    <div class="space-y-6">
      <SettingsToggle
        label="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        :model-value="twoFactorEnabled"
        @update:model-value="$emit('update:twoFactorEnabled', $event)"
      />
      
      <div v-if="twoFactorEnabled" class="p-4 bg-gray-50 rounded-lg">
        <h5 class="text-sm font-medium text-gray-900 mb-2">Setup Two-Factor Authentication</h5>
        <div class="flex items-center justify-center mb-4">
          <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <QrCodeIcon class="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-2">Scan this QR code with your authenticator app</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
          <div class="flex space-x-2">
            <input
              v-model="verificationCode"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter code from your app"
            />
            <button
              @click="$emit('verify', verificationCode)"
              :disabled="!verificationCode"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900">Session Timeout</h4>
          <p class="text-sm text-gray-500">Automatically log out after inactivity</p>
        </div>
        <div>
          <select
            :value="sessionTimeout"
            @input="$emit('update:sessionTimeout', ($event.target as HTMLSelectElement).value)"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="240">4 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QrCodeIcon } from '@heroicons/vue/24/outline';
import SettingsSection from './SettingsSection.vue';
import SettingsToggle from './SettingsToggle.vue';

const verificationCode = ref('');

defineEmits<{
  'update:twoFactorEnabled': [value: boolean];
  'update:sessionTimeout': [value: string];
  'verify': [code: string];
}>();
</script>