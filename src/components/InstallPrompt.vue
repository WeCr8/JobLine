<template>
  <div 
    v-if="showInstallPrompt"
    class="fixed top-4 left-4 right-4 bg-primary-600 text-white p-3 rounded-lg z-40 safe-area-top"
    role="alert"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Install JobLine.ai</p>
        <p class="text-xs opacity-90">Add to home screen for better experience</p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="installApp"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs transition-colors duration-200"
          aria-label="Install app"
        >
          Install
        </button>
        <button
          @click="dismissInstallPrompt"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs transition-colors duration-200"
          aria-label="Dismiss installation prompt"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { isIOS, isAndroid, isStandalone } from '../utils/platform';

const showInstallPrompt = ref(false);

// Check if the app is already installed
const isAppInstalled = () => {
  return isStandalone();
};

// Check if the install prompt was previously dismissed
const wasPromptDismissed = () => {
  return localStorage.getItem('installPromptDismissed') === 'true';
};

// Show iOS specific install instructions
const showIOSInstructions = () => {
  // For iOS, we need to show custom instructions since there's no install API
  if (isIOS() && !isAppInstalled() && !wasPromptDismissed()) {
    showInstallPrompt.value = true;
  }
};

// Handle install button click
const installApp = () => {
  if (isIOS()) {
    // Show iOS-specific instructions
    alert('To install this app on your iPhone:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top-right corner');
  } else {
    // For Android/Chrome, use the Web App Install API
    window.installPWA();
  }
  
  showInstallPrompt.value = false;
};

// Dismiss the install prompt
const dismissInstallPrompt = () => {
  showInstallPrompt.value = false;
  localStorage.setItem('installPromptDismissed', 'true');
};

// Handle the beforeinstallprompt event
const handleBeforeInstallPrompt = () => {
  // Only show for Android, as iOS uses different mechanism
  if (isAndroid() && !isAppInstalled() && !wasPromptDismissed()) {
    showInstallPrompt.value = true;
  }
};

onMounted(() => {
  // Don't show if already installed
  if (isAppInstalled()) {
    return;
  }
  
  // Don't show if previously dismissed
  if (wasPromptDismissed()) {
    return;
  }
  
  // For iOS, show custom instructions
  if (isIOS()) {
    // Delay showing the prompt to avoid overwhelming the user
    setTimeout(showIOSInstructions, 3000);
  }
  
  // For Android/Chrome, listen for the beforeinstallprompt event
  window.addEventListener('pwaInstallable', handleBeforeInstallPrompt);
  
  // Hide prompt if app gets installed
  window.addEventListener('pwaInstalled', () => {
    showInstallPrompt.value = false;
  });
});

onUnmounted(() => {
  window.removeEventListener('pwaInstallable', handleBeforeInstallPrompt);
});
</script>

<style scoped>
/* Animation for the install prompt */
div[role="alert"] {
  animation: slideInDown 0.5s ease-out;
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* iOS-specific styling */
:global(.ios-device) div[role="alert"] {
  /* Add extra padding for the notch */
  padding-top: calc(0.75rem + env(safe-area-inset-top, 0));
}
</style>