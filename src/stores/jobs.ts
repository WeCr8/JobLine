import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jobsService } from '../services/jobs.service';
import type { Job, JobStatus, Priority, JobOperation, DNCProgram, QualityRequirement, MaterialRequirement, Drawing, JobHistoryEntry } from '../types';
import { demoService } from '../services/demo.service';
import { useAuthStore } from './auth';

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const fetchJobs = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Use hardcoded demo data
        jobs.value = demoService.getDemoData('jobs') as Job[];
      } else {
        // Use real data from API
        const fetchedJobs = await jobsService.fetchJobs();
        jobs.value = fetchedJobs;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching jobs:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateJobStatus = async (jobId: string, status: JobStatus, notes?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Update in local state only
        const job = jobs.value.find(j => j.id === jobId);
        if (job) {
          const oldStatus = job.status;
          job.status = status;
          job.updatedAt = new Date().toISOString();
          if (notes) job.notes = notes;

          // Add history entry
          const historyEntry: JobHistoryEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userId: 'current-user',
            userName: authStore.user?.name || 'Demo User',
            action: 'status-changed',
            field: 'status',
            oldValue: oldStatus,
            newValue: status,
            notes
          };
          job.history.unshift(historyEntry);
        }
        return true;
      } else {
        // Use real API
        const success = await jobsService.updateJobStatus(jobId, status, notes);
        
        if (success) {
          const job = jobs.value.find(j => j.id === jobId);
          if (job) {
            const oldStatus = job.status;
            job.status = status;
            job.updatedAt = new Date().toISOString();
            if (notes) job.notes = notes;

            // Add history entry
            const historyEntry: JobHistoryEntry = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              userId: 'current-user',
              userName: authStore.user?.name || 'Current User',
              action: 'status-changed',
              field: 'status',
              oldValue: oldStatus,
              newValue: status,
              notes
            };
            job.history.unshift(historyEntry);
          }
        }
        
        return success;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating job status:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateJobProgress = async (jobId: string, completedQuantity: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Update in local state only
        const job = jobs.value.find(j => j.id === jobId);
        if (job) {
          const oldQuantity = job.completedQuantity;
          job.completedQuantity = Math.min(completedQuantity, job.quantity);
          job.updatedAt = new Date().toISOString();
          
          if (job.completedQuantity === job.quantity) {
            job.status = 'completed';
          }

          // Add history entry
          const historyEntry: JobHistoryEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userId: 'current-user',
            userName: authStore.user?.name || 'Demo User',
            action: 'quantity-updated',
            field: 'completedQuantity',
            oldValue: oldQuantity,
            newValue: completedQuantity,
            notes: `Updated completed quantity from ${oldQuantity} to ${completedQuantity}`
          };
          job.history.unshift(historyEntry);
        }
        return true;
      } else {
        // Use real API
        const success = await jobsService.updateJobProgress(jobId, completedQuantity);
        
        if (success) {
          const job = jobs.value.find(j => j.id === jobId);
          if (job) {
            const oldQuantity = job.completedQuantity;
            job.completedQuantity = Math.min(completedQuantity, job.quantity);
            job.updatedAt = new Date().toISOString();
            
            if (job.completedQuantity === job.quantity) {
              job.status = 'completed';
            }

            // Add history entry
            const historyEntry: JobHistoryEntry = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              userId: 'current-user',
              userName: authStore.user?.name || 'Current User',
              action: 'quantity-updated',
              field: 'completedQuantity',
              oldValue: oldQuantity,
              newValue: completedQuantity,
              notes: `Updated completed quantity from ${oldQuantity} to ${completedQuantity}`
            };
            job.history.unshift(historyEntry);
          }
        }
        
        return success;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating job progress:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getJobById = (jobId: string) => {
    return jobs.value.find(job => job.id === jobId);
  };

  // Computed properties
  const activeJobs = computed(() => 
    jobs.value.filter(job => ['running', 'setup', 'on-hold'].includes(job.status))
  );

  const completedJobs = computed(() => 
    jobs.value.filter(job => job.status === 'completed')
  );

  const urgentJobs = computed(() => 
    jobs.value.filter(job => job.priority === 'urgent' && job.status !== 'completed')
  );

  const jobsByStatus = computed(() => {
    const statusCounts = {
      pending: 0,
      setup: 0,
      running: 0,
      'on-hold': 0,
      completed: 0
    };
    
    jobs.value.forEach(job => {
      statusCounts[job.status]++;
    });
    
    return statusCounts;
  });

  return {
    jobs,
    loading,
    error,
    activeJobs,
    completedJobs,
    urgentJobs,
    jobsByStatus,
    fetchJobs,
    updateJobStatus,
    updateJobProgress,
    getJobById
  };
});