<template>
  <div class="flex items-center justify-between py-3">
    <div class="flex items-center space-x-3">
      <div 
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="service.bgColor"
      >
        <component :is="service.icon" class="w-5 h-5" />
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-900">{{ service.name }}</h4>
        <p class="text-xs text-gray-500">{{ service.status === 'connected' ? 'Connected' : 'Not connected' }}</p>
      </div>
    </div>
    <button
      @click="$emit('toggle', service)"
      :class="service.status === 'connected' ? 'bg-red-100 text-red-700' : 'bg-primary-600 text-white'"
      class="px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
    >
      {{ service.status === 'connected' ? 'Disconnect' : 'Connect' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface ConnectedService {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  icon: any;
  bgColor: string;
}

defineProps<{
  service: ConnectedService;
}>();

defineEmits<{
  'toggle': [service: ConnectedService];
}>();
</script>