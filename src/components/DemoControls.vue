<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Demo Controls</h3>
    </div>
    <div class="p-6">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">Shuffle Job Priorities</h4>
            <p class="text-sm text-gray-500">Randomly change job priorities to simulate changing conditions</p>
          </div>
          <button
            @click="shuffleJobPriorities"
            :disabled="loading.shuffle"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ loading.shuffle ? 'Shuffling...' : 'Shuffle' }}
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">Advance Job Statuses</h4>
            <p class="text-sm text-gray-500">Move jobs forward in the production process</p>
          </div>
          <button
            @click="advanceJobStatuses"
            :disabled="loading.advance"
            class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ loading.advance ? 'Advancing...' : 'Advance' }}
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">Reset Demo Data</h4>
            <p class="text-sm text-gray-500">Reset all demo data to initial state</p>
          </div>
          <button
            @click="confirmReset"
            :disabled="loading.reset"
            class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
          >
            {{ loading.reset ? 'Resetting...' : 'Reset' }}
          </button>
        </div>
      </div>
      
      <!-- Status message -->
      <div v-if="statusMessage" class="mt-4 p-3 rounded-md" :class="statusSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
        {{ statusMessage }}
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Reset</h3>
        <p class="text-gray-700 mb-4">
          Are you sure you want to reset all demo data? This will regenerate all jobs, users, and other data.
        </p>
        <div class="flex space-x-3 mt-6">
          <button
            @click="resetDemoData"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Reset Data
          </button>
          <button
            @click="showConfirmation = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { demoService } from '../services/demo.service';
import { useJobsStore } from '../stores/jobs';

const jobsStore = useJobsStore();

const loading = reactive({
  shuffle: false,
  advance: false,
  reset: false
});

const statusMessage = ref('');
const statusSuccess = ref(true);
const showConfirmation = ref(false);

const shuffleJobPriorities = async () => {
  loading.shuffle = true;
  statusMessage.value = '';
  
  try {
    const result = await demoService.shuffleJobPriorities();
    
    if (result.success) {
      statusSuccess.value = true;
      statusMessage.value = result.message || 'Job priorities shuffled successfully';
      
      // Refresh jobs data
      await jobsStore.fetchJobs();
    } else {
      statusSuccess.value = false;
      statusMessage.value = result.error || 'Failed to shuffle job priorities';
    }
  } catch (error) {
    statusSuccess.value = false;
    statusMessage.value = 'An unexpected error occurred';
    console.error('Error shuffling job priorities:', error);
  } finally {
    loading.shuffle = false;
    
    // Clear status message after 5 seconds
    setTimeout(() => {
      statusMessage.value = '';
    }, 5000);
  }
};

const advanceJobStatuses = async () => {
  loading.advance = true;
  statusMessage.value = '';
  
  try {
    const result = await demoService.advanceJobStatuses();
    
    if (result.success) {
      statusSuccess.value = true;
      statusMessage.value = result.message || 'Job statuses advanced successfully';
      
      // Refresh jobs data
      await jobsStore.fetchJobs();
    } else {
      statusSuccess.value = false;
      statusMessage.value = result.error || 'Failed to advance job statuses';
    }
  } catch (error) {
    statusSuccess.value = false;
    statusMessage.value = 'An unexpected error occurred';
    console.error('Error advancing job statuses:', error);
  } finally {
    loading.advance = false;
    
    // Clear status message after 5 seconds
    setTimeout(() => {
      statusMessage.value = '';
    }, 5000);
  }
};

const confirmReset = () => {
  showConfirmation.value = true;
};

const resetDemoData = async () => {
  showConfirmation.value = false;
  loading.reset = true;
  statusMessage.value = '';
  
  try {
    const result = await demoService.resetDemoData();
    
    if (result.success) {
      statusSuccess.value = true;
      statusMessage.value = result.message || 'Demo data reset successfully';
      
      // Refresh jobs data
      await jobsStore.fetchJobs();
    } else {
      statusSuccess.value = false;
      statusMessage.value = result.error || 'Failed to reset demo data';
    }
  } catch (error) {
    statusSuccess.value = false;
    statusMessage.value = 'An unexpected error occurred';
    console.error('Error resetting demo data:', error);
  } finally {
    loading.reset = false;
    
    // Clear status message after 5 seconds
    setTimeout(() => {
      statusMessage.value = '';
    }, 5000);
  }
};
</script>