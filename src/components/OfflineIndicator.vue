<template>
  <div 
    v-if="!isOnline"
    class="offline-indicator safe-area-top"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-center justify-center space-x-2 py-1">
      <WifiOffIcon class="w-4 h-4" />
      <span>You're offline. Some features may be unavailable.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { WifiOffIcon } from '@heroicons/vue/24/outline';
import { addConnectivityListeners } from '../utils/offline';

const isOnline = ref(navigator.onLine);

const handleOnline = () => {
  isOnline.value = true;
};

const handleOffline = () => {
  isOnline.value = false;
};

onMounted(() => {
  // Set initial state
  isOnline.value = navigator.onLine;
  
  // Add listeners
  const cleanup = addConnectivityListeners(handleOnline, handleOffline);
  
  onUnmounted(() => {
    cleanup();
  });
});
</script>

<style scoped>
.offline-indicator {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
</style>