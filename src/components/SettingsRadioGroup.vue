<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="option in options"
        :key="option.value"
        @click="$emit('update:modelValue', option.value)"
        class="border rounded-lg p-4 cursor-pointer"
        :class="modelValue === option.value ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'"
      >
        <div v-if="option.icon" class="flex justify-center mb-2">
          <component :is="option.icon" class="w-6 h-6 text-gray-500" />
        </div>
        <div v-else-if="option.preview" class="h-12 rounded-md mb-2" :class="option.preview"></div>
        <div class="text-sm font-medium text-center">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string;
  options: Array<{
    value: string;
    label: string;
    icon?: any;
    preview?: string;
  }>;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>