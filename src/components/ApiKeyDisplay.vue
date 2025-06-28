<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h4 class="text-sm font-medium text-gray-900">{{ label }}</h4>
      <button
        v-if="canRegenerate"
        @click="$emit('regenerate')"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        Regenerate
      </button>
    </div>
    <div class="flex">
      <input
        type="text"
        readonly
        :value="value"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm"
      />
      <button
        @click="copyToClipboard"
        class="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200"
      >
        <ClipboardIcon class="w-4 h-4" />
      </button>
    </div>
    <p v-if="helpText" class="text-xs text-gray-500 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ClipboardIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  label: string;
  value: string;
  helpText?: string;
  canRegenerate?: boolean;
}>();

const emit = defineEmits<{
  'regenerate': [];
  'copied': [];
}>();

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.value);
  emit('copied');
};
</script>