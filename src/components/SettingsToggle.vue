<template>
  <div class="flex items-center justify-between">
    <div>
      <h4 class="text-sm font-medium text-gray-900">{{ label }}</h4>
      <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
    </div>
    <div>
      <ToggleSwitch :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue';

defineProps<{
  label: string;
  description?: string;
  modelValue: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>