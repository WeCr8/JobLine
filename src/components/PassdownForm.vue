<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Operator Passdown Note</h3>
      <p class="text-sm text-gray-600">Record shift details and machine condition</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Work Order</label>
          <input
            v-model="form.workOrder"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="J2024-001"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Shift</label>
          <select
            v-model="form.shift"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="day">Day (6AM - 2PM)</option>
            <option value="evening">Evening (2PM - 10PM)</option>
            <option value="night">Night (10PM - 6AM)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Machine</label>
          <select
            v-model="form.machine"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="CNC-001">CNC-001</option>
            <option value="CNC-002">CNC-002</option>
            <option value="CNC-003">CNC-003</option>
            <option value="CNC-004">CNC-004</option>
            <option value="CNC-005">CNC-005</option>
          </select>
        </div>
      </div>

      <!-- Labor and Machine Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Labor Type</label>
          <select
            v-model="form.laborType"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="setup">Setup</option>
            <option value="run">Run</option>
            <option value="teardown">Teardown</option>
            <option value="maintenance">Maintenance</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Machine Condition</label>
          <select
            v-model="form.machineCondition"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="in-setup">In Setup</option>
            <option value="running">Running</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
            <option value="down">Down</option>
          </select>
        </div>
      </div>

      <!-- Production Data -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
          <input
            v-model.number="form.hoursWorked"
            type="number"
            step="0.5"
            min="0"
            max="12"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Parts Completed</label>
          <input
            v-model.number="form.partsCompleted"
            type="number"
            min="0"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <!-- Issues -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Quality Issues</label>
          <textarea
            v-model="form.qualityIssues"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe any quality issues or enter 'None'"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Machine Issues</label>
          <textarea
            v-model="form.machineIssues"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe any machine issues or enter 'None'"
          ></textarea>
        </div>
      </div>

      <!-- 5S Checklist -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h4 class="text-md font-semibold text-gray-900 mb-4">5S Checklist</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Coolant -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.coolantLevel"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Coolant Level Checked</label>
            </div>
            <select
              v-model="form.fiveSChecklist.coolantCondition"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="good">Good</option>
              <option value="needs-change">Needs Change</option>
              <option value="low">Low</option>
            </select>
          </div>

          <!-- Chip Bin -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.chipBinEmptied"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Chip Bin Emptied</label>
            </div>
            <select
              v-model="form.fiveSChecklist.chipBinCondition"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="empty">Empty</option>
              <option value="half-full">Half Full</option>
              <option value="full">Full</option>
            </select>
          </div>

          <!-- Desk and Tooling -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.deskCleaned"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Desk Cleaned</label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.toolingReturned"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Tooling Returned</label>
            </div>
          </div>

          <!-- Tooling Condition -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tooling Condition</label>
            <select
              v-model="form.fiveSChecklist.toolingCondition"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="good">Good</option>
              <option value="worn">Worn</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>

          <!-- Additional Checks -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.workAreaOrganized"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Work Area Organized</label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                v-model="form.fiveSChecklist.safetyChecked"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label class="text-sm font-medium text-gray-700">Safety Check Complete</label>
            </div>
          </div>

          <!-- 5S Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">5S Notes</label>
            <textarea
              v-model="form.fiveSChecklist.notes"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional 5S observations"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Next Shift Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Notes for Next Shift</label>
        <textarea
          v-model="form.nextShiftNotes"
          rows="3"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          placeholder="Important information for the next shift operator"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
        >
          {{ loading ? 'Saving...' : 'Save Passdown Note' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
import { usePassdownStore } from '../stores/passdown.ts';
import type { LaborType, MachineCondition, FiveSChecklist } from '../types';

const authStore = useAuthStore();
const passdownStore = usePassdownStore();
const loading = ref(false);

const emit = defineEmits<{
  'note-saved': [];
}>();

const form = reactive({
  workOrder: '',
  shift: 'day' as 'day' | 'evening' | 'night',
  machine: '',
  laborType: 'run' as LaborType,
  machineCondition: 'running' as MachineCondition,
  hoursWorked: 8,
  partsCompleted: 0,
  qualityIssues: '',
  machineIssues: '',
  fiveSChecklist: {
    coolantLevel: false,
    coolantCondition: 'good' as 'good' | 'needs-change' | 'low',
    chipBinEmptied: false,
    chipBinCondition: 'empty' as 'empty' | 'half-full' | 'full',
    deskCleaned: false,
    toolingReturned: false,
    toolingCondition: 'good' as 'good' | 'worn' | 'damaged',
    workAreaOrganized: false,
    safetyChecked: false,
    notes: ''
  } as FiveSChecklist,
  nextShiftNotes: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await passdownStore.addNote({
      ...form,
      date: new Date().toISOString().split('T')[0],
      operator: authStore.user?.name || 'Unknown'
    });
    
    emit('note-saved');
    resetForm();
  } catch (error) {
    console.error('Failed to save passdown note:', error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    workOrder: '',
    shift: 'day',
    machine: '',
    laborType: 'run',
    machineCondition: 'running',
    hoursWorked: 8,
    partsCompleted: 0,
    qualityIssues: '',
    machineIssues: '',
    fiveSChecklist: {
      coolantLevel: false,
      coolantCondition: 'good',
      chipBinEmptied: false,
      chipBinCondition: 'empty',
      deskCleaned: false,
      toolingReturned: false,
      toolingCondition: 'good',
      workAreaOrganized: false,
      safetyChecked: false,
      notes: ''
    },
    nextShiftNotes: ''
  });
};
</script>