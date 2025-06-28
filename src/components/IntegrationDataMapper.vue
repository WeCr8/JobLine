<template>
  <div class="data-mapper">
    <div class="data-mapper-header">
      <h3 class="data-mapper-title">{{ title || 'Data Field Mapping' }}</h3>
      <p v-if="description" class="data-mapper-description">{{ description }}</p>
    </div>
    
    <div class="data-mapper-content">
      <div class="data-mapper-table-container">
        <table class="data-mapper-table">
          <thead>
            <tr>
              <th>Source Field</th>
              <th>Target Field</th>
              <th>Required</th>
              <th v-if="showCompliance">Compliance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mapping, index) in mappings" :key="index">
              <td>
                <div class="data-mapper-field">
                  <input
                    v-model="mapping.sourceField"
                    type="text"
                    class="data-mapper-input"
                    placeholder="Source field"
                    :disabled="disabled"
                  />
                  <div v-if="sourceFields.length > 0" class="data-mapper-dropdown">
                    <button
                      type="button"
                      class="data-mapper-dropdown-button"
                      @click="toggleSourceDropdown(index)"
                      :disabled="disabled"
                    >
                      <ChevronDownIcon class="w-4 h-4" />
                    </button>
                    <div
                      v-if="activeSourceDropdown === index"
                      class="data-mapper-dropdown-menu"
                    >
                      <button
                        v-for="field in sourceFields"
                        :key="field"
                        type="button"
                        class="data-mapper-dropdown-item"
                        @click="selectSourceField(index, field)"
                      >
                        {{ field }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="data-mapper-field">
                  <input
                    v-model="mapping.targetField"
                    type="text"
                    class="data-mapper-input"
                    placeholder="Target field"
                    :disabled="disabled"
                  />
                  <div v-if="targetFields.length > 0" class="data-mapper-dropdown">
                    <button
                      type="button"
                      class="data-mapper-dropdown-button"
                      @click="toggleTargetDropdown(index)"
                      :disabled="disabled"
                    >
                      <ChevronDownIcon class="w-4 h-4" />
                    </button>
                    <div
                      v-if="activeTargetDropdown === index"
                      class="data-mapper-dropdown-menu"
                    >
                      <button
                        v-for="field in targetFields"
                        :key="field"
                        type="button"
                        class="data-mapper-dropdown-item"
                        @click="selectTargetField(index, field)"
                      >
                        {{ field }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="data-mapper-checkbox">
                  <input
                    :id="`required-${index}`"
                    v-model="mapping.required"
                    type="checkbox"
                    :disabled="disabled"
                  />
                  <label :for="`required-${index}`" class="sr-only">Required</label>
                </div>
              </td>
              <td v-if="showCompliance">
                <div class="data-mapper-checkbox">
                  <input
                    :id="`compliance-${index}`"
                    v-model="mapping.complianceFlag"
                    type="checkbox"
                    :disabled="disabled"
                  />
                  <label :for="`compliance-${index}`" class="sr-only">Compliance Flag</label>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  class="data-mapper-action-button"
                  @click="removeMapping(index)"
                  :disabled="disabled"
                  aria-label="Remove mapping"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="data-mapper-actions">
        <button
          type="button"
          class="data-mapper-add-button"
          @click="addMapping"
          :disabled="disabled"
        >
          <PlusIcon class="w-4 h-4 mr-1" />
          Add Field
        </button>
        
        <button
          v-if="showAutoMap"
          type="button"
          class="data-mapper-auto-button"
          @click="autoMap"
          :disabled="disabled || !canAutoMap"
        >
          <BoltIcon class="w-4 h-4 mr-1" />
          Auto Map
        </button>
      </div>
      
      <div v-if="showSampleData && sampleData.length > 0" class="data-mapper-sample">
        <h4 class="data-mapper-sample-title">Sample Data</h4>
        <div class="data-mapper-sample-container">
          <table class="data-mapper-sample-table">
            <thead>
              <tr>
                <th v-for="field in sampleDataFields" :key="field">{{ field }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in sampleData.slice(0, 3)" :key="rowIndex">
                <td v-for="field in sampleDataFields" :key="field">{{ row[field] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ImportMapping } from '../types/integration';
import {
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
  BoltIcon
} from '@heroicons/vue/24/outline';

interface Props {
  modelValue: ImportMapping[];
  sourceFields?: string[];
  targetFields?: string[];
  sampleData?: any[];
  title?: string;
  description?: string;
  showCompliance?: boolean;
  showAutoMap?: boolean;
  showSampleData?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sourceFields: () => [],
  targetFields: () => [],
  sampleData: () => [],
  title: '',
  description: '',
  showCompliance: true,
  showAutoMap: true,
  showSampleData: true,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: ImportMapping[]];
  'change': [value: ImportMapping[]];
}>();

// Internal state
const mappings = ref<ImportMapping[]>([...props.modelValue]);
const activeSourceDropdown = ref<number | null>(null);
const activeTargetDropdown = ref<number | null>(null);

// Computed
const sampleDataFields = computed(() => {
  if (props.sampleData.length === 0) return [];
  return Object.keys(props.sampleData[0] || {});
});

const canAutoMap = computed(() => {
  return props.sourceFields.length > 0 && props.targetFields.length > 0;
});

// Methods
const addMapping = () => {
  mappings.value.push({
    sourceField: '',
    targetField: '',
    required: false,
    complianceFlag: false
  });
  
  updateModelValue();
};

const removeMapping = (index: number) => {
  mappings.value.splice(index, 1);
  updateModelValue();
};

const toggleSourceDropdown = (index: number) => {
  activeSourceDropdown.value = activeSourceDropdown.value === index ? null : index;
  activeTargetDropdown.value = null;
};

const toggleTargetDropdown = (index: number) => {
  activeTargetDropdown.value = activeTargetDropdown.value === index ? null : index;
  activeSourceDropdown.value = null;
};

const selectSourceField = (index: number, field: string) => {
  mappings.value[index].sourceField = field;
  activeSourceDropdown.value = null;
  updateModelValue();
};

const selectTargetField = (index: number, field: string) => {
  mappings.value[index].targetField = field;
  activeTargetDropdown.value = null;
  updateModelValue();
};

const updateModelValue = () => {
  emit('update:modelValue', [...mappings.value]);
  emit('change', [...mappings.value]);
};

const autoMap = () => {
  // Simple auto-mapping based on field name similarity
  const newMappings: ImportMapping[] = [];
  
  // First, try exact matches
  props.sourceFields.forEach(sourceField => {
    const normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Look for exact match in target fields
    const exactMatch = props.targetFields.find(targetField => {
      const normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedSourceField === normalizedTargetField;
    });
    
    if (exactMatch) {
      newMappings.push({
        sourceField,
        targetField: exactMatch,
        required: false,
        complianceFlag: false
      });
    }
  });
  
  // Then, try partial matches for remaining fields
  props.sourceFields.forEach(sourceField => {
    // Skip if already mapped
    if (newMappings.some(m => m.sourceField === sourceField)) {
      return;
    }
    
    const normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Look for partial match in target fields
    const partialMatches = props.targetFields
      .filter(targetField => {
        // Skip if already used
        if (newMappings.some(m => m.targetField === targetField)) {
          return false;
        }
        
        const normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSourceField.includes(normalizedTargetField) || 
               normalizedTargetField.includes(normalizedSourceField);
      })
      .sort((a, b) => {
        // Prioritize by similarity
        const aSimilarity = calculateSimilarity(sourceField, a);
        const bSimilarity = calculateSimilarity(sourceField, b);
        return bSimilarity - aSimilarity;
      });
    
    if (partialMatches.length > 0) {
      newMappings.push({
        sourceField,
        targetField: partialMatches[0],
        required: false,
        complianceFlag: false
      });
    }
  });
  
  // Set the new mappings
  mappings.value = newMappings;
  updateModelValue();
};

const calculateSimilarity = (a: string, b: string): number => {
  const normalizedA = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedB = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Simple Levenshtein distance
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= normalizedA.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= normalizedB.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= normalizedA.length; i++) {
    for (let j = 1; j <= normalizedB.length; j++) {
      if (normalizedA[i - 1] === normalizedB[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  // Calculate similarity (0-1)
  const maxLength = Math.max(normalizedA.length, normalizedB.length);
  if (maxLength === 0) return 1; // Both strings are empty
  
  const distance = matrix[normalizedA.length][normalizedB.length];
  return 1 - distance / maxLength;
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  mappings.value = [...newValue];
}, { deep: true });

// Initialize with at least one mapping
if (mappings.value.length === 0) {
  addMapping();
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (activeSourceDropdown.value !== null || activeTargetDropdown.value !== null) {
    activeSourceDropdown.value = null;
    activeTargetDropdown.value = null;
  }
};

// Add event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

import { onUnmounted } from 'vue';
</script>

<style scoped>
.data-mapper {
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.data-mapper-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-mapper-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.data-mapper-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
}

.data-mapper-content {
  padding: 1rem;
}

.data-mapper-table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.data-mapper-table {
  width: 100%;
  border-collapse: collapse;
}

.data-mapper-table th {
  padding: 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.data-mapper-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-mapper-field {
  position: relative;
  display: flex;
}

.data-mapper-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #111827;
}

.data-mapper-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.data-mapper-dropdown {
  position: relative;
}

.data-mapper-dropdown-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-left: none;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  cursor: pointer;
}

.data-mapper-dropdown-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-mapper-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 12rem;
  max-height: 12rem;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.data-mapper-dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  color: #111827;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.data-mapper-dropdown-item:hover {
  background-color: #f3f4f6;
}

.data-mapper-checkbox {
  display: flex;
  justify-content: center;
}

.data-mapper-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.data-mapper-checkbox input[type="checkbox"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-mapper-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.data-mapper-action-button:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.data-mapper-action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-mapper-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.data-mapper-add-button,
.data-mapper-auto-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.data-mapper-add-button {
  color: #3b82f6;
  background-color: white;
  border: 1px solid #3b82f6;
}

.data-mapper-add-button:hover {
  background-color: #eff6ff;
}

.data-mapper-auto-button {
  color: white;
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
}

.data-mapper-auto-button:hover {
  background-color: #2563eb;
}

.data-mapper-add-button:disabled,
.data-mapper-auto-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-mapper-sample {
  margin-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.data-mapper-sample-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem;
}

.data-mapper-sample-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.data-mapper-sample-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.data-mapper-sample-table th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.data-mapper-sample-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.data-mapper-sample-table tr:last-child td {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .data-mapper-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .data-mapper-add-button,
  .data-mapper-auto-button {
    width: 100%;
    justify-content: center;
  }
}

/* iOS optimizations */
:global(.ios-device) .data-mapper-input,
:global(.ios-device) .data-mapper-dropdown-button,
:global(.ios-device) .data-mapper-add-button,
:global(.ios-device) .data-mapper-auto-button {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

/* Android optimizations */
:global(.android-device) .data-mapper-checkbox input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
}
</style>