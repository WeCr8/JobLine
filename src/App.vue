<template>
  <div id="app">
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

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>