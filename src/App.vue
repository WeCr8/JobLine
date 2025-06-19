<template>
  <div id="app">
    <router-view v-if="!authStore.isAuthenticated" />
    <AppLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import AppLayout from './components/AppLayout.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>