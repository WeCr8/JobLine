<template>
  <div class="flex items-center justify-between py-2">
    <div>
      <h4 class="text-sm font-medium text-gray-900">{{ event.name }}</h4>
      <p class="text-sm text-gray-500">{{ event.description }}</p>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <input
          :id="`email-${event.id}`"
          v-model="event.email"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          :disabled="!emailEnabled"
        />
        <label :for="`email-${event.id}`" class="text-xs text-gray-700">Email</label>
      </div>
      <div class="flex items-center space-x-2">
        <input
          :id="`push-${event.id}`"
          v-model="event.push"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          :disabled="!pushEnabled"
        />
        <label :for="`push-${event.id}`" class="text-xs text-gray-700">Push</label>
      </div>
      <div class="flex items-center space-x-2">
        <input
          :id="`sms-${event.id}`"
          v-model="event.sms"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          :disabled="!smsEnabled"
        />
        <label :for="`sms-${event.id}`" class="text-xs text-gray-700">SMS</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

defineProps<{
  event: NotificationEvent;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}>();
</script>