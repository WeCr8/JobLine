<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Jobs</h1>
        <p class="text-gray-600">Manage and track manufacturing jobs</p>
      </div>
      <div class="flex space-x-3">
        <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
          Export
        </button>
        <button class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200">
          New Job
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="setup">Setup</option>
            <option value="running">Running</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select 
            v-model="filters.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <select 
            v-model="filters.customer"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Customers</option>
            <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">
              {{ customer }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Job number, part name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Jobs Grid -->
    <div v-if="jobsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-2 bg-gray-200 rounded w-full mb-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="h-3 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
      <BriefcaseIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
      <p class="text-gray-600">Try adjusting your filters or search terms.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <JobCard
        v-for="job in filteredJobs"
        :key="job.id"
        :job="job"
        @update-status="handleUpdateStatus"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Job Details Modal -->
    <JobDetailsModal
      v-if="selectedJob"
      :job="selectedJob"
      @close="selectedJob = null"
    />

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Job Status</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              v-model="statusUpdate.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="setup">Setup</option>
              <option value="running">Running</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              v-model="statusUpdate.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add notes about this status change..."
            ></textarea>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button
            @click="confirmStatusUpdate"
            class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Update Status
          </button>
          <button
            @click="cancelStatusUpdate"
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
import { ref, computed, onMounted } from 'vue';
import { useJobsStore } from '../stores/jobs';
import type { JobStatus, Job } from '../types';
import JobCard from '../components/JobCard.vue';
import JobDetailsModal from '../components/JobDetailsModal.vue';
import { BriefcaseIcon } from '@heroicons/vue/24/outline';

const jobsStore = useJobsStore();
const selectedJob = ref<Job | null>(null);

const filters = ref({
  status: '',
  priority: '',
  customer: '',
  search: ''
});

const showStatusModal = ref(false);
const statusUpdate = ref({
  jobId: '',
  status: '' as JobStatus,
  notes: ''
});

const uniqueCustomers = computed(() => {
  const customers = jobsStore.jobs.map(job => job.customer);
  return [...new Set(customers)].sort();
});

const filteredJobs = computed(() => {
  let filtered = jobsStore.jobs;

  if (filters.value.status) {
    filtered = filtered.filter(job => job.status === filters.value.status);
  }

  if (filters.value.priority) {
    filtered = filtered.filter(job => job.priority === filters.value.priority);
  }

  if (filters.value.customer) {
    filtered = filtered.filter(job => job.customer === filters.value.customer);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(job => 
      job.jobNumber.toLowerCase().includes(search) ||
      job.partName.toLowerCase().includes(search) ||
      job.partNumber.toLowerCase().includes(search) ||
      job.customer.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const handleUpdateStatus = (jobId: string) => {
  const job = jobsStore.jobs.find(j => j.id === jobId);
  if (job) {
    statusUpdate.value = {
      jobId,
      status: job.status,
      notes: ''
    };
    showStatusModal.value = true;
  }
};

const handleViewDetails = (jobId: string) => {
  const job = jobsStore.getJobById(jobId);
  if (job) {
    selectedJob.value = job;
  }
};

const confirmStatusUpdate = async () => {
  await jobsStore.updateJobStatus(
    statusUpdate.value.jobId,
    statusUpdate.value.status,
    statusUpdate.value.notes
  );
  showStatusModal.value = false;
};

const cancelStatusUpdate = () => {
  showStatusModal.value = false;
  statusUpdate.value = {
    jobId: '',
    status: '' as JobStatus,
    notes: ''
  };
};

onMounted(() => {
  jobsStore.fetchJobs();
});
</script>