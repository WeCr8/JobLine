<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ job.jobNumber }}</h3>
        <p class="text-sm text-gray-600">{{ job.partName }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
          :class="priorityClasses[job.priority]"
        >
          {{ job.priority.toUpperCase() }}
        </span>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
          :class="statusClasses[job.status]"
        >
          {{ formatStatus(job.status) }}
        </span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{{ job.completedQuantity }}/{{ job.quantity }} parts</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="progressBarColor"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div class="text-right text-xs text-gray-500 mt-1">
        {{ progressPercentage }}% complete
      </div>
    </div>

    <!-- Current Operation -->
    <div v-if="currentOperation" class="mb-4 p-3 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-900">Current Operation</p>
          <p class="text-xs text-blue-700">Op {{ currentOperation.operationNumber }}: {{ currentOperation.name }}</p>
        </div>
        <span 
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="getOperationStatusClass(currentOperation.status)"
        >
          {{ formatStatus(currentOperation.status) }}
        </span>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-4 text-sm mb-4">
      <div>
        <span class="text-gray-500">Customer:</span>
        <p class="font-medium text-gray-900">{{ job.customer }}</p>
      </div>
      <div>
        <span class="text-gray-500">Due Date:</span>
        <p class="font-medium text-gray-900">{{ formatDate(job.dueDate) }}</p>
      </div>
      <div>
        <span class="text-gray-500">Operator:</span>
        <p class="font-medium text-gray-900">{{ job.operator || 'Unassigned' }}</p>
      </div>
      <div>
        <span class="text-gray-500">Machine:</span>
        <p class="font-medium text-gray-900">{{ job.machine || 'TBD' }}</p>
      </div>
    </div>

    <!-- Operations Summary -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Operations</span>
        <span class="text-xs text-gray-500">{{ completedOperations }}/{{ job.operations.length }}</span>
      </div>
      <div class="space-y-1">
        <div
          v-for="operation in job.operations.slice(0, 3)"
          :key="operation.id"
          class="flex items-center justify-between text-xs"
        >
          <span class="text-gray-600">Op {{ operation.operationNumber }}: {{ operation.name }}</span>
          <span 
            class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
            :class="getOperationStatusClass(operation.status)"
          >
            {{ formatStatus(operation.status) }}
          </span>
        </div>
        <div v-if="job.operations.length > 3" class="text-xs text-gray-500 text-center">
          +{{ job.operations.length - 3 }} more operations
        </div>
      </div>
    </div>

    <!-- DNC Programs -->
    <div v-if="job.dncPrograms.length > 0" class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">DNC Programs</span>
        <span class="text-xs text-gray-500">{{ job.dncPrograms.length }} programs</span>
      </div>
      <div class="space-y-1">
        <div
          v-for="program in job.dncPrograms.slice(0, 2)"
          :key="program.id"
          class="flex items-center justify-between text-xs"
        >
          <span class="text-gray-600">{{ program.programNumber }}</span>
          <button
            @click.stop="loadProgram(program.id)"
            class="text-primary-600 hover:text-primary-700"
          >
            Load
          </button>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="job.notes" class="mt-4 p-3 bg-gray-50 rounded-md">
      <p class="text-sm text-gray-700">{{ job.notes }}</p>
    </div>

    <!-- Actions -->
    <div class="mt-4 flex space-x-2">
      <button
        @click="$emit('view-details', job.id)"
        class="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
      >
        View Details
      </button>
      <button
        v-if="canUpdateStatus"
        @click.stop="$emit('update-status', job.id)"
        class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
      >
        Update Status
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { Job } from '../types';
import { useAuthStore } from '../stores/auth.ts';

interface Props {
  job: Job;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

defineEmits<{
  'update-status': [jobId: string];
  'view-details': [jobId: string];
}>();

const progressPercentage = computed(() => 
  Math.round((props.job.completedQuantity / props.job.quantity) * 100)
);

const progressBarColor = computed(() => {
  const percentage = progressPercentage.value;
  if (percentage === 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
});

const currentOperation = computed(() => 
  props.job.operations.find(op => op.status === 'running') || 
  props.job.operations.find(op => op.status === 'setup')
);

const completedOperations = computed(() => 
  props.job.operations.filter(op => op.status === 'completed').length
);

const canUpdateStatus = computed(() => 
  ['operator', 'lead', 'supervisor', 'manager', 'admin'].includes(authStore.user?.role || '')
);

const statusClasses = {
  'pending': 'bg-gray-100 text-gray-800 border-gray-200',
  'setup': 'bg-purple-100 text-purple-800 border-purple-200',
  'running': 'bg-green-100 text-green-800 border-green-200',
  'on-hold': 'bg-red-100 text-red-800 border-red-200',
  'completed': 'bg-blue-100 text-blue-800 border-blue-200'
};

const priorityClasses = {
  'low': 'bg-gray-100 text-gray-800 border-gray-200',
  'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'high': 'bg-orange-100 text-orange-800 border-orange-200',
  'urgent': 'bg-red-100 text-red-800 border-red-200'
};

const getOperationStatusClass = (status: string) => {
  return statusClasses[status as keyof typeof statusClasses] || statusClasses.pending;
};

const formatStatus = (status: string) => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const loadProgram = (programId: string) => {
  console.log('Loading program to DNC:', programId);
  // Implementation would send program to DNC system
};
</script>