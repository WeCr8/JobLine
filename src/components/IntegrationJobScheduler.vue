<template>
  <div class="job-scheduler">
    <div class="job-scheduler-header">
      <h3 class="job-scheduler-title">{{ title || 'AI Job Scheduler' }}</h3>
      <p v-if="description" class="job-scheduler-description">{{ description }}</p>
    </div>
    
    <div class="job-scheduler-content">
      <!-- Department Filter -->
      <div class="job-scheduler-filter">
        <label for="department-filter" class="job-scheduler-filter-label">Department</label>
        <select
          id="department-filter"
          v-model="selectedDepartment"
          class="job-scheduler-filter-select"
          :disabled="loading || optimizing"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
      
      <!-- Job Queue -->
      <div class="job-scheduler-queue">
        <h4 class="job-scheduler-section-title">Job Queue</h4>
        
        <div v-if="loading" class="job-scheduler-loading">
          <svg class="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading jobs...</span>
        </div>
        
        <div v-else-if="pendingJobs.length === 0" class="job-scheduler-empty">
          <ClipboardDocumentCheckIcon class="w-12 h-12 text-gray-300" />
          <p>No pending jobs to schedule</p>
        </div>
        
        <div v-else class="job-scheduler-job-list">
          <div
            v-for="job in pendingJobs"
            :key="job.id"
            class="job-scheduler-job-item"
            :class="{ 'job-scheduler-job-item-selected': selectedJobs.includes(job.id) }"
            @click="toggleJobSelection(job.id)"
          >
            <div class="job-scheduler-job-header">
              <div class="job-scheduler-job-title">
                <span class="job-scheduler-job-number">{{ job.jobNumber }}</span>
                <span 
                  class="job-scheduler-job-priority"
                  :class="getPriorityClass(job.priority)"
                >
                  {{ job.priority.toUpperCase() }}
                </span>
              </div>
              
              <div class="job-scheduler-job-checkbox">
                <input
                  :id="`job-${job.id}`"
                  type="checkbox"
                  :checked="selectedJobs.includes(job.id)"
                  @click.stop
                  @change="toggleJobSelection(job.id)"
                />
                <label :for="`job-${job.id}`" class="sr-only">Select job</label>
              </div>
            </div>
            
            <div class="job-scheduler-job-details">
              <div class="job-scheduler-job-detail">
                <span class="job-scheduler-job-detail-label">Part:</span>
                <span class="job-scheduler-job-detail-value">{{ job.partName }}</span>
              </div>
              
              <div class="job-scheduler-job-detail">
                <span class="job-scheduler-job-detail-label">Customer:</span>
                <span class="job-scheduler-job-detail-value">{{ job.customer }}</span>
              </div>
              
              <div class="job-scheduler-job-detail">
                <span class="job-scheduler-job-detail-label">Due:</span>
                <span class="job-scheduler-job-detail-value">{{ formatDate(job.dueDate) }}</span>
              </div>
              
              <div class="job-scheduler-job-detail">
                <span class="job-scheduler-job-detail-label">Quantity:</span>
                <span class="job-scheduler-job-detail-value">{{ job.quantity }}</span>
              </div>
            </div>
            
            <div v-if="job.aiRecommendation" class="job-scheduler-job-recommendation">
              <div class="job-scheduler-job-recommendation-header">
                <SparklesIcon class="w-4 h-4 text-yellow-500" />
                <span>AI Recommendation</span>
              </div>
              
              <div class="job-scheduler-job-recommendation-details">
                <div v-if="job.aiRecommendation.machine" class="job-scheduler-job-recommendation-detail">
                  <span class="job-scheduler-job-recommendation-label">Machine:</span>
                  <span class="job-scheduler-job-recommendation-value">{{ job.aiRecommendation.machine }}</span>
                </div>
                
                <div v-if="job.aiRecommendation.operator" class="job-scheduler-job-recommendation-detail">
                  <span class="job-scheduler-job-recommendation-label">Operator:</span>
                  <span class="job-scheduler-job-recommendation-value">{{ job.aiRecommendation.operator }}</span>
                </div>
                
                <div v-if="job.aiRecommendation.confidence" class="job-scheduler-job-recommendation-detail">
                  <span class="job-scheduler-job-recommendation-label">Confidence:</span>
                  <span class="job-scheduler-job-recommendation-value">{{ job.aiRecommendation.confidence }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Available Resources -->
      <div class="job-scheduler-resources">
        <h4 class="job-scheduler-section-title">Available Resources</h4>
        
        <div v-if="loading" class="job-scheduler-loading">
          <svg class="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading resources...</span>
        </div>
        
        <div v-else class="job-scheduler-resources-grid">
          <div class="job-scheduler-resource-section">
            <h5 class="job-scheduler-resource-title">Machines</h5>
            
            <div v-if="availableMachines.length === 0" class="job-scheduler-resource-empty">
              No available machines
            </div>
            
            <div v-else class="job-scheduler-resource-list">
              <div
                v-for="machine in availableMachines"
                :key="machine.id"
                class="job-scheduler-resource-item"
              >
                <div class="job-scheduler-resource-header">
                  <div class="job-scheduler-resource-name">{{ machine.name }}</div>
                  <div 
                    class="job-scheduler-resource-status"
                    :class="getMachineStatusClass(machine.status)"
                  >
                    {{ machine.status.toUpperCase() }}
                  </div>
                </div>
                
                <div class="job-scheduler-resource-details">
                  <div class="job-scheduler-resource-detail">
                    <span class="job-scheduler-resource-detail-label">Type:</span>
                    <span class="job-scheduler-resource-detail-value">{{ machine.type }}</span>
                  </div>
                  
                  <div class="job-scheduler-resource-detail">
                    <span class="job-scheduler-resource-detail-label">Department:</span>
                    <span class="job-scheduler-resource-detail-value">{{ getDepartmentName(machine.department) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="job-scheduler-resource-section">
            <h5 class="job-scheduler-resource-title">Operators</h5>
            
            <div v-if="availableOperators.length === 0" class="job-scheduler-resource-empty">
              No available operators
            </div>
            
            <div v-else class="job-scheduler-resource-list">
              <div
                v-for="operator in availableOperators"
                :key="operator.id"
                class="job-scheduler-resource-item"
              >
                <div class="job-scheduler-resource-header">
                  <div class="job-scheduler-resource-name">{{ operator.name }}</div>
                  <div class="job-scheduler-resource-role">{{ formatRole(operator.role) }}</div>
                </div>
                
                <div class="job-scheduler-resource-details">
                  <div class="job-scheduler-resource-detail">
                    <span class="job-scheduler-resource-detail-label">Department:</span>
                    <span class="job-scheduler-resource-detail-value">{{ getDepartmentName(operator.department) }}</span>
                  </div>
                  
                  <div v-if="operator.skills && operator.skills.length > 0" class="job-scheduler-resource-detail">
                    <span class="job-scheduler-resource-detail-label">Skills:</span>
                    <span class="job-scheduler-resource-detail-value">{{ operator.skills.join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="job-scheduler-actions">
        <button
          type="button"
          class="job-scheduler-action-button job-scheduler-action-optimize"
          @click="optimizeJobs"
          :disabled="loading || optimizing || selectedJobs.length === 0"
        >
          <span v-if="optimizing" class="job-scheduler-action-loading">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Optimizing...
          </span>
          <span v-else>
            <SparklesIcon class="w-5 h-5 mr-1" />
            AI Optimize Selected Jobs
          </span>
        </button>
        
        <button
          type="button"
          class="job-scheduler-action-button job-scheduler-action-auto"
          @click="autoScheduleAll"
          :disabled="loading || optimizing || pendingJobs.length === 0"
        >
          <span v-if="optimizing" class="job-scheduler-action-loading">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>
            <BoltIcon class="w-5 h-5 mr-1" />
            Auto-Schedule All Jobs
          </span>
        </button>
      </div>
      
      <!-- Results -->
      <div v-if="optimizationResults.length > 0" class="job-scheduler-results">
        <h4 class="job-scheduler-section-title">Optimization Results</h4>
        
        <div class="job-scheduler-results-list">
          <div
            v-for="result in optimizationResults"
            :key="result.jobId"
            class="job-scheduler-result-item"
          >
            <div class="job-scheduler-result-header">
              <div class="job-scheduler-result-title">{{ result.jobNumber }}</div>
              <div 
                class="job-scheduler-result-status"
                :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ result.success ? 'SCHEDULED' : 'FAILED' }}
              </div>
            </div>
            
            <div v-if="result.success" class="job-scheduler-result-details">
              <div class="job-scheduler-result-detail">
                <span class="job-scheduler-result-detail-label">Machine:</span>
                <span class="job-scheduler-result-detail-value">{{ result.machine }}</span>
              </div>
              
              <div class="job-scheduler-result-detail">
                <span class="job-scheduler-result-detail-label">Operator:</span>
                <span class="job-scheduler-result-detail-value">{{ result.operator }}</span>
              </div>
              
              <div class="job-scheduler-result-detail">
                <span class="job-scheduler-result-detail-label">Status:</span>
                <span class="job-scheduler-result-detail-value">{{ result.status }}</span>
              </div>
            </div>
            
            <div v-else class="job-scheduler-result-error">
              {{ result.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { integrationService } from '../services/integration.service';
import type { Job } from '../types';
import {
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/vue/24/outline';

interface Props {
  title?: string;
  description?: string;
  jobs?: Job[];
  machines?: any[];
  operators?: any[];
  departments?: any[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  jobs: () => [],
  machines: () => [],
  operators: () => [],
  departments: () => [],
  loading: false
});

const emit = defineEmits<{
  'schedule-jobs': [jobIds: string[]];
  'auto-schedule': [];
  'optimization-complete': [results: any[]];
}>();

// State
const selectedDepartment = ref('');
const selectedJobs = ref<string[]>([]);
const optimizing = ref(false);
const optimizationResults = ref<any[]>([]);

// Computed
const pendingJobs = computed(() => {
  let filtered = props.jobs.filter(job => job.status === 'pending');
  
  if (selectedDepartment.value) {
    // Filter by department if a machine is assigned
    filtered = filtered.filter(job => {
      if (job.machine) {
        const machine = props.machines.find(m => m.id === job.machine);
        return machine && machine.department === selectedDepartment.value;
      }
      return false;
    });
  }
  
  // Sort by priority and due date
  return filtered.sort((a, b) => {
    // First by priority
    const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                         priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
});

const availableMachines = computed(() => {
  let filtered = props.machines.filter(machine => machine.status === 'idle');
  
  if (selectedDepartment.value) {
    filtered = filtered.filter(machine => machine.department === selectedDepartment.value);
  }
  
  return filtered;
});

const availableOperators = computed(() => {
  let filtered = props.operators.filter(operator => operator.is_active);
  
  if (selectedDepartment.value) {
    filtered = filtered.filter(operator => operator.department === selectedDepartment.value);
  }
  
  return filtered;
});

// Methods
const toggleJobSelection = (jobId: string) => {
  const index = selectedJobs.value.indexOf(jobId);
  
  if (index === -1) {
    selectedJobs.value.push(jobId);
  } else {
    selectedJobs.value.splice(index, 1);
  }
};

const optimizeJobs = async () => {
  if (selectedJobs.value.length === 0) {
    return;
  }
  
  optimizing.value = true;
  optimizationResults.value = [];
  
  try {
    // Call the API to optimize job schedule
    const results = [];
    
    for (const jobId of selectedJobs.value) {
      const job = props.jobs.find(j => j.id === jobId);
      
      if (!job) {
        continue;
      }
      
      // Get AI recommendations for this job
      const recommendations = await integrationService.getJobRecommendations(job.operator || '');
      
      // Find the recommendation for this job
      const recommendation = recommendations.find(r => r.id === jobId);
      
      if (recommendation && recommendation.recommendedMachine) {
        // Apply the recommendation
        const machine = props.machines.find(m => m.id === recommendation.recommendedMachine);
        const operator = props.operators.find(o => o.id === job.operator);
        
        results.push({
          jobId,
          jobNumber: job.jobNumber,
          success: true,
          machine: machine?.name || recommendation.recommendedMachine,
          operator: operator?.name || 'Unassigned',
          status: 'setup'
        });
      } else {
        results.push({
          jobId,
          jobNumber: job.jobNumber,
          success: false,
          error: 'No suitable machine found for this job'
        });
      }
    }
    
    optimizationResults.value = results;
    emit('schedule-jobs', selectedJobs.value);
    emit('optimization-complete', results);
  } catch (err: any) {
    console.error('Error optimizing jobs:', err);
    
    // Add error results
    const errorResults = selectedJobs.value.map(jobId => {
      const job = props.jobs.find(j => j.id === jobId);
      
      return {
        jobId,
        jobNumber: job?.jobNumber || jobId,
        success: false,
        error: (err as Error).message || 'An error occurred during optimization'
      };
    });
    
    optimizationResults.value = errorResults;
    emit('optimization-complete', errorResults);
  } finally {
    optimizing.value = false;
  }
};

const autoScheduleAll = async () => {
  optimizing.value = true;
  optimizationResults.value = [];
  
  try {
    // Call the API to auto-schedule all jobs
    const success = await integrationService.optimizeJobSchedule(selectedDepartment.value);
    
    if (success) {
      // Create success results for all pending jobs
      const results = pendingJobs.value.map(job => ({
        jobId: job.id,
        jobNumber: job.jobNumber,
        success: true,
        machine: 'Auto-assigned',
        operator: 'Auto-assigned',
        status: 'setup'
      }));
      
      optimizationResults.value = results;
      emit('auto-schedule');
      emit('optimization-complete', results);
    } else {
      // Create error results
      const results = pendingJobs.value.map(job => ({
        jobId: job.id,
        jobNumber: job.jobNumber,
        success: false,
        error: 'Failed to auto-schedule job'
      }));
      
      optimizationResults.value = results;
      emit('optimization-complete', results);
    }
  } catch (err: any) {
    console.error('Error auto-scheduling jobs:', err);
    
    // Add error results
    const errorResults = pendingJobs.value.map(job => ({
      jobId: job.id,
      jobNumber: job.jobNumber,
      success: false,
      error: (err as Error).message || 'An error occurred during auto-scheduling'
    }));
    
    optimizationResults.value = errorResults;
    emit('optimization-complete', errorResults);
  } finally {
    optimizing.value = false;
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatRole = (role: string) => {
  if (role === 'organization_admin') return 'Org Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getPriorityClass = (priority: string) => {
  const classes = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  };
  return classes[priority as keyof typeof classes] || classes.medium;
};

const getMachineStatusClass = (status: string) => {
  const classes = {
    'running': 'bg-green-100 text-green-800',
    'idle': 'bg-blue-100 text-blue-800',
    'maintenance': 'bg-yellow-100 text-yellow-800',
    'down': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.idle;
};

const getDepartmentName = (departmentId: string | undefined) => {
  if (!departmentId) return 'Unassigned';
  
  const department = props.departments.find(d => d.id === departmentId);
  return department ? department.name : departmentId;
};
</script>

<style scoped>
.job-scheduler {
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.job-scheduler-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.job-scheduler-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.job-scheduler-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
}

.job-scheduler-content {
  padding: 1rem;
}

.job-scheduler-filter {
  margin-bottom: 1.5rem;
}

.job-scheduler-filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.job-scheduler-filter-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
}

.job-scheduler-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.job-scheduler-loading,
.job-scheduler-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.job-scheduler-loading {
  gap: 1rem;
}

.job-scheduler-empty {
  gap: 0.5rem;
}

.job-scheduler-queue,
.job-scheduler-resources,
.job-scheduler-results {
  margin-bottom: 1.5rem;
}

.job-scheduler-job-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.job-scheduler-job-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.job-scheduler-job-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.1);
}

.job-scheduler-job-item-selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.job-scheduler-job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.job-scheduler-job-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.job-scheduler-job-number {
  font-weight: 600;
  color: #111827;
}

.job-scheduler-job-priority {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.job-scheduler-job-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.job-scheduler-job-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.job-scheduler-job-detail {
  font-size: 0.875rem;
}

.job-scheduler-job-detail-label {
  color: #6b7280;
  margin-right: 0.25rem;
}

.job-scheduler-job-detail-value {
  color: #111827;
  font-weight: 500;
}

.job-scheduler-job-recommendation {
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 0.25rem;
  padding: 0.75rem;
}

.job-scheduler-job-recommendation-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.job-scheduler-job-recommendation-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.job-scheduler-job-recommendation-detail {
  font-size: 0.75rem;
}

.job-scheduler-job-recommendation-label {
  color: #92400e;
  margin-right: 0.25rem;
}

.job-scheduler-job-recommendation-value {
  color: #78350f;
  font-weight: 500;
}

.job-scheduler-resources-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.job-scheduler-resource-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem;
}

.job-scheduler-resource-empty {
  font-size: 0.875rem;
  color: #6b7280;
  padding: 1rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.job-scheduler-resource-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.job-scheduler-resource-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.job-scheduler-resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.job-scheduler-resource-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.job-scheduler-resource-status,
.job-scheduler-resource-role {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.job-scheduler-resource-role {
  background-color: #e5e7eb;
  color: #4b5563;
}

.job-scheduler-resource-details {
  font-size: 0.75rem;
}

.job-scheduler-resource-detail {
  margin-bottom: 0.25rem;
}

.job-scheduler-resource-detail:last-child {
  margin-bottom: 0;
}

.job-scheduler-resource-detail-label {
  color: #6b7280;
  margin-right: 0.25rem;
}

.job-scheduler-resource-detail-value {
  color: #111827;
}

.job-scheduler-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.job-scheduler-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.job-scheduler-action-optimize {
  flex: 1;
  color: white;
  background-color: #8b5cf6;
  border: 1px solid #8b5cf6;
}

.job-scheduler-action-optimize:hover:not(:disabled) {
  background-color: #7c3aed;
}

.job-scheduler-action-auto {
  flex: 1;
  color: white;
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
}

.job-scheduler-action-auto:hover:not(:disabled) {
  background-color: #2563eb;
}

.job-scheduler-action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.job-scheduler-action-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.job-scheduler-results-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.job-scheduler-result-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
}

.job-scheduler-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.job-scheduler-result-title {
  font-weight: 600;
  color: #111827;
}

.job-scheduler-result-status {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.job-scheduler-result-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.job-scheduler-result-detail {
  font-size: 0.875rem;
}

.job-scheduler-result-detail-label {
  color: #6b7280;
  margin-right: 0.25rem;
}

.job-scheduler-result-detail-value {
  color: #111827;
  font-weight: 500;
}

.job-scheduler-result-error {
  font-size: 0.875rem;
  color: #ef4444;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .job-scheduler-resources-grid {
    grid-template-columns: 1fr;
  }
  
  .job-scheduler-actions {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .job-scheduler-job-details,
  .job-scheduler-job-recommendation-details {
    grid-template-columns: 1fr;
  }
}

/* iOS optimizations */
:global(.ios-device) .job-scheduler-filter-select,
:global(.ios-device) .job-scheduler-action-button {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Android optimizations */
:global(.android-device) .job-scheduler-job-checkbox input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
}
</style>