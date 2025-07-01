<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Operator Passdown</h1>
        <p class="text-gray-600">Record shift details and machine conditions</p>
      </div>
      <button
        @click="showForm = !showForm"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
      >
        {{ showForm ? 'Hide Form' : 'New Passdown Note' }}
      </button>
    </div>

    <!-- Passdown Form -->
    <div v-if="showForm">
      <PassdownForm @note-saved="handleNoteSaved" />
    </div>

    <!-- Analytics Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Shift Distribution -->
      <ChartWidget
        title="Notes by Shift"
        :data="shiftChartData"
        default-type="pie"
        @refresh="refreshData"
      />

      <!-- Machine Usage -->
      <ChartWidget
        title="Notes by Machine"
        :data="machineChartData"
        default-type="bar"
        @refresh="refreshData"
      />
    </div>

    <!-- Recent Passdown Notes -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Recent Passdown Notes</h2>
      </div>
      
      <div v-if="passdownStore.loading" class="p-6">
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="passdownStore.notes.length === 0" class="p-6 text-center">
        <DocumentTextIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No passdown notes yet</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="note in passdownStore.notes"
          :key="note.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ note.workOrder }}</h3>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getShiftClass(note.shift)"
                >
                  {{ note.shift.toUpperCase() }} SHIFT
                </span>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getLaborTypeClass(note.laborType)"
                >
                  {{ note.laborType.toUpperCase() }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                {{ note.machine }} • {{ note.operator }} • {{ formatDate(note.date) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ note.hoursWorked }}h worked</p>
              <p class="text-sm text-gray-600">{{ note.partsCompleted }} parts</p>
            </div>
          </div>

          <!-- Machine Condition -->
          <div class="mb-4">
            <span class="text-sm text-gray-500">Machine Condition: </span>
            <span 
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getMachineConditionClass(note.machineCondition)"
            >
              {{ formatMachineCondition(note.machineCondition) }}
            </span>
          </div>

          <!-- Issues -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-1">Quality Issues</h4>
              <p class="text-sm text-gray-700">{{ note.qualityIssues || 'None reported' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-1">Machine Issues</h4>
              <p class="text-sm text-gray-700">{{ note.machineIssues || 'None reported' }}</p>
            </div>
          </div>

          <!-- 5S Checklist Summary -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">5S Checklist</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div class="flex items-center space-x-1">
                <CheckCircleIcon 
                  v-if="note.fiveSChecklist.coolantLevel" 
                  class="w-4 h-4 text-green-500" 
                />
                <XCircleIcon 
                  v-else 
                  class="w-4 h-4 text-red-500" 
                />
                <span class="text-xs text-gray-600">Coolant</span>
              </div>
              <div class="flex items-center space-x-1">
                <CheckCircleIcon 
                  v-if="note.fiveSChecklist.chipBinEmptied" 
                  class="w-4 h-4 text-green-500" 
                />
                <XCircleIcon 
                  v-else 
                  class="w-4 h-4 text-red-500" 
                />
                <span class="text-xs text-gray-600">Chip Bin</span>
              </div>
              <div class="flex items-center space-x-1">
                <CheckCircleIcon 
                  v-if="note.fiveSChecklist.deskCleaned" 
                  class="w-4 h-4 text-green-500" 
                />
                <XCircleIcon 
                  v-else 
                  class="w-4 h-4 text-red-500" 
                />
                <span class="text-xs text-gray-600">Desk</span>
              </div>
              <div class="flex items-center space-x-1">
                <CheckCircleIcon 
                  v-if="note.fiveSChecklist.toolingReturned" 
                  class="w-4 h-4 text-green-500" 
                />
                <XCircleIcon 
                  v-else 
                  class="w-4 h-4 text-red-500" 
                />
                <span class="text-xs text-gray-600">Tooling</span>
              </div>
            </div>
          </div>

          <!-- Next Shift Notes -->
          <div class="bg-blue-50 rounded-lg p-3">
            <h4 class="text-sm font-medium text-blue-900 mb-1">Notes for Next Shift</h4>
            <p class="text-sm text-blue-800">{{ note.nextShiftNotes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { usePassdownStore } from '../stores/passdown.ts';
import PassdownForm from '../components/PassdownForm.vue';
import ChartWidget from '../components/ChartWidget.vue';
import type { ChartData } from '../types';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline';

const passdownStore = usePassdownStore();
const showForm = ref(false);

const shiftChartData = computed<ChartData>(() => ({
  labels: ['Day', 'Evening', 'Night'],
  datasets: [{
    label: 'Notes',
    data: [
      passdownStore.notesByShift.day,
      passdownStore.notesByShift.evening,
      passdownStore.notesByShift.night
    ],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#1f2937']
  }]
}));

const machineChartData = computed<ChartData>(() => {
  const machines = Object.keys(passdownStore.notesByMachine);
  const counts = Object.values(passdownStore.notesByMachine);
  
  return {
    labels: machines,
    datasets: [{
      label: 'Notes',
      data: counts,
      backgroundColor: '#3b82f6'
    }]
  };
});

const getShiftClass = (shift: string) => {
  const classes = {
    'day': 'bg-yellow-100 text-yellow-800',
    'evening': 'bg-orange-100 text-orange-800',
    'night': 'bg-blue-100 text-blue-800'
  };
  return classes[shift as keyof typeof classes] || classes.day;
};

const getLaborTypeClass = (laborType: string) => {
  const classes = {
    'setup': 'bg-purple-100 text-purple-800',
    'run': 'bg-green-100 text-green-800',
    'teardown': 'bg-orange-100 text-orange-800',
    'maintenance': 'bg-red-100 text-red-800',
    'inspection': 'bg-blue-100 text-blue-800'
  };
  return classes[laborType as keyof typeof classes] || classes.run;
};

const getMachineConditionClass = (condition: string) => {
  const classes = {
    'in-setup': 'bg-purple-100 text-purple-800',
    'running': 'bg-green-100 text-green-800',
    'idle': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-orange-100 text-orange-800',
    'down': 'bg-red-100 text-red-800'
  };
  return classes[condition as keyof typeof classes] || classes.idle;
};

const formatMachineCondition = (condition: string) => {
  return condition.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const handleNoteSaved = () => {
  showForm.value = false;
  passdownStore.fetchNotes();
};

const refreshData = () => {
  passdownStore.fetchNotes();
};

onMounted(() => {
  passdownStore.fetchNotes();
});
</script>