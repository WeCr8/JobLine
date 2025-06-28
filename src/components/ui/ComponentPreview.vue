<template>
  <div class="component-preview">
    <div class="component-preview-header">
      <h2 class="component-preview-title">{{ title }}</h2>
      <div class="component-preview-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="component-preview-tab"
          :class="{ 'component-preview-tab-active': activeTab === tab.id }"
          @click="activeTab = tab.id"
          :aria-selected="activeTab === tab.id"
          role="tab"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="component-preview-content">
      <!-- Preview tab -->
      <div v-if="activeTab === 'preview'" class="component-preview-preview">
        <Preview
          :states="previewStates"
          :initial-state="initialState"
          :loading="loading"
          :error="error"
          :error-message="errorMessage"
          :retry-enabled="true"
          @retry="$emit('retry')"
        >
          <template #default="{ state }">
            <slot :state="state"></slot>
          </template>
        </Preview>
      </div>
      
      <!-- Code tab -->
      <div v-else-if="activeTab === 'code'" class="component-preview-code">
        <pre><code>{{ code }}</code></pre>
      </div>
      
      <!-- Props tab -->
      <div v-else-if="activeTab === 'props'" class="component-preview-props">
        <table class="component-preview-props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in props" :key="prop.name">
              <td>{{ prop.name }}</td>
              <td><code>{{ prop.type }}</code></td>
              <td><code>{{ prop.default }}</code></td>
              <td>{{ prop.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Preview from './Preview.vue';

interface Prop {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface Props {
  title: string;
  code?: string;
  props?: Prop[];
  states?: { id: string; name: string; data?: any }[];
  initialState?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  props: () => [],
  states: () => [],
  initialState: '',
  loading: false,
  error: false,
  errorMessage: ''
});

defineEmits<{
  'retry': [];
}>();

const activeTab = ref('preview');

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
  { id: 'props', label: 'Props' }
];

const previewStates = computed(() => {
  if (props.states.length === 0) {
    return [{ id: 'default', name: 'Default' }];
  }
  return props.states;
});
</script>

<style scoped>
.component-preview {
  border: 1px solid var(--preview-border-color, #e5e7eb);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--preview-bg-color, #ffffff);
}

.component-preview-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--preview-border-color, #e5e7eb);
  background-color: var(--preview-header-bg, #f9fafb);
}

.component-preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--preview-title-color, #111827);
  margin: 0;
}

.component-preview-tabs {
  display: flex;
  gap: 0.5rem;
}

.component-preview-tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--preview-tab-color, #6b7280);
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.component-preview-tab:hover {
  background-color: var(--preview-tab-hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--preview-tab-hover-color, #374151);
}

.component-preview-tab-active {
  background-color: var(--preview-tab-active-bg, #e5e7eb);
  color: var(--preview-tab-active-color, #111827);
}

.component-preview-content {
  padding: 1rem;
}

.component-preview-code {
  background-color: var(--preview-code-bg, #1f2937);
  color: var(--preview-code-color, #f9fafb);
  padding: 1rem;
  border-radius: 0.375rem;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.component-preview-props-table {
  width: 100%;
  border-collapse: collapse;
}

.component-preview-props-table th,
.component-preview-props-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--preview-table-border, #e5e7eb);
}

.component-preview-props-table th {
  font-weight: 600;
  color: var(--preview-table-header, #374151);
  background-color: var(--preview-table-header-bg, #f9fafb);
}

.component-preview-props-table td {
  color: var(--preview-table-cell, #4b5563);
}

.component-preview-props-table code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  padding: 0.125rem 0.25rem;
  background-color: var(--preview-code-inline-bg, #f3f4f6);
  border-radius: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .component-preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .component-preview-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .component-preview {
    border: 2px solid #000000;
  }
  
  .component-preview-header {
    border-bottom: 2px solid #000000;
  }
  
  .component-preview-tab {
    border: 1px solid #000000;
  }
  
  .component-preview-tab-active {
    background-color: #000000;
    color: #ffffff;
  }
  
  .component-preview-props-table th,
  .component-preview-props-table td {
    border-bottom: 1px solid #000000;
  }
  
  .component-preview-props-table code {
    border: 1px solid #000000;
  }
}
</style>