<template>
  <div id="app" :class="getPlatformClass()">
    <OfflineIndicator />
    <InstallPrompt />
    <router-view v-if="!authStore.isAuthenticated" />
    <AppLayout v-else />
    <FloatingChatButton />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import AppLayout from './components/AppLayout.vue';
import FloatingChatButton from './components/FloatingChatButton.vue';
import OfflineIndicator from './components/OfflineIndicator.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import { getPlatformClass } from './utils/platform';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>