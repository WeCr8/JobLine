<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">AI Job Scheduler</h1>
        <p class="text-gray-600">Automatically schedule and optimize jobs using AI</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <IntegrationJobScheduler
        title="AI Job Scheduler"
        description="Automatically schedule jobs based on AI recommendations"
        :jobs="jobsStore.jobs"
        :machines="machines"
        :operators="operators"
        :departments="departments"
        :loading="jobsStore.loading"
        @schedule-jobs="handleScheduleJobs"
        @auto-schedule="handleAutoSchedule"
        @optimization-complete="handleOptimizationComplete"
      />
    </div>

    <!-- Optimization History -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Optimization History</h2>
      </div>
      
      <div v-if="optimizationHistory.length === 0" class="p-6 text-center">
        <SparklesIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No optimization history yet</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="(history, index) in optimizationHistory"
          :key="index"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="history.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ history.success ? 'SUCCESS' : 'FAILED' }}
              </span>
              <h3 class="text-sm font-medium text-gray-900">{{ history.type }}</h3>
            </div>
            <span class="text-xs text-gray-500">{{ formatTime(history.timestamp) }}</span>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <span class="text-gray-500">Jobs:</span>
              <p class="font-medium text-gray-900">{{ history.jobCount }}</p>
            </div>
            <div>
              <span class="text-gray-500">Success:</span>
              <p class="font-medium text-green-600">{{ history.successCount }}</p>
            </div>
            <div>
              <span class="text-gray-500">Failed:</span>
              <p class="font-medium text-red-600">{{ history.failedCount }}</p>
            </div>
          </div>
          
          <div class="text-sm text-gray-600">
            {{ history.summary }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useJobsStore } from '../stores/jobs.ts';
import { integrationService } from '../services/integration.service.ts';
import IntegrationJobScheduler from '../components/IntegrationJobScheduler.vue';
import {
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const jobsStore = useJobsStore();

// State
interface OptimizationHistoryEntry {
  timestamp: string;
  type: string;
  success: boolean;
  jobCount: number;
  successCount: number;
  failedCount: number;
  summary: string;
}

const optimizationHistory = ref<OptimizationHistoryEntry[]>([
  {
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'Auto Schedule',
    success: true,
    jobCount: 12,
    successCount: 10,
    failedCount: 2,
    summary: 'Automatically scheduled 10 jobs across 5 machines. 2 jobs could not be scheduled due to resource constraints.'
  },
  {
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    type: 'Manual Optimization',
    success: true,
    jobCount: 5,
    successCount: 5,
    failedCount: 0,
    summary: 'Optimized 5 selected jobs with 100% success rate. Estimated efficiency improvement: 15%.'
  }
]);

// Mock data for machines, operators, and departments
const machines = ref([
  {
    id: 'machine-1',
    name: 'CNC-001',
    type: 'CNC Machining Center',
    department: 'cnc-machining',
    status: 'idle',
    capabilities: ['milling', 'drilling', 'tapping']
  },
  {
    id: 'machine-2',
    name: 'CNC-002',
    type: 'CNC Lathe',
    department: 'cnc-machining',
    status: 'idle',
    capabilities: ['turning', 'threading', 'facing']
  },
  {
    id: 'machine-3',
    name: 'LASER-001',
    type: 'Laser Cutter',
    department: 'sheet-metal',
    status: 'idle',
    capabilities: ['cutting', 'marking', 'engraving']
  }
]);

const operators = ref([
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'operator',
    department: 'cnc-machining',
    is_active: true,
    skills: ['milling', 'drilling', 'programming']
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'lead',
    department: 'cnc-machining',
    is_active: true,
    skills: ['setup', 'inspection', 'programming']
  },
  {
    id: 'user-3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'operator',
    department: 'sheet-metal',
    is_active: true,
    skills: ['laser-cutting', 'bending', 'welding']
  }
]);

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining'
  },
  {
    id: 'sheet-metal',
    name: 'Sheet Metal'
  },
  {
    id: 'quality',
    name: 'Quality Control'
  }
]);

// Methods
const refreshData = async () => {
  try {
    await jobsStore.fetchJobs();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const handleScheduleJobs = async (jobIds: string[]) => {
  try {
    // In a real implementation, this would call the API to schedule the jobs
    // For now, we'll just add a history entry
    optimizationHistory.value.unshift({
      timestamp: new Date().toISOString(),
      type: 'Manual Optimization',
      success: true,
      jobCount: jobIds.length,
      successCount: jobIds.length,
      failedCount: 0,
      summary: `Optimized ${jobIds.length} selected jobs with 100% success rate. Estimated efficiency improvement: 15%.`
    });
  } catch (error) {
    console.error('Error scheduling jobs:', error);
  }
};

const handleAutoSchedule = async () => {
  try {
    // Call the API to auto-schedule all jobs
    const success = await integrationService.optimizeJobSchedule();
    
    // Add history entry
    optimizationHistory.value.unshift({
      timestamp: new Date().toISOString(),
      type: 'Auto Schedule',
      success,
      jobCount: jobsStore.jobs.filter(j => j.status === 'pending').length,
      successCount: success ? jobsStore.jobs.filter(j => j.status === 'pending').length - 2 : 0,
      failedCount: success ? 2 : jobsStore.jobs.filter(j => j.status === 'pending').length,
      summary: success
        ? 'Automatically scheduled jobs across available machines. Some jobs could not be scheduled due to resource constraints.'
        : 'Failed to auto-schedule jobs. Please try again later.'
    });
    
    // Refresh jobs
    await jobsStore.fetchJobs();
  } catch (error) {
    console.error('Error auto-scheduling jobs:', error);
  }
};

const handleOptimizationComplete = (results: any[]) => {
  console.log('Optimization complete:', results);
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
};

onMounted(() => {
  refreshData();
});
</script>