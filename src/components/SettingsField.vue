<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <slot></slot>
    <p v-if="helpText" class="mt-1 text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  helpText?: string;
}>();
</script>