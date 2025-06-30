<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Demo Controls</h1>
        <p class="text-gray-600">Manage and manipulate demo data for testing and presentations</p>
      </div>
    </div>

    <!-- Demo Controls -->
    <DemoControls />

    <!-- Demo Data Stats -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Demo Data Statistics</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Jobs</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Jobs:</span>
                <span class="text-sm font-medium text-gray-900">{{ jobsStore.jobs.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Active Jobs:</span>
                <span class="text-sm font-medium text-gray-900">{{ jobsStore.activeJobs.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Completed Jobs:</span>
                <span class="text-sm font-medium text-gray-900">{{ jobsStore.completedJobs.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Urgent Jobs:</span>
                <span class="text-sm font-medium text-gray-900">{{ jobsStore.urgentJobs.length }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Status Distribution</h4>
            <div class="space-y-2">
              <div v-for="(count, status) in jobsStore.jobsByStatus" :key="status" class="flex justify-between">
                <span class="text-sm text-gray-600 capitalize">{{ status }}:</span>
                <span class="text-sm font-medium text-gray-900">{{ count }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Priority Distribution</h4>
            <div class="space-y-2">
              <div v-for="priority in ['low', 'medium', 'high', 'urgent']" :key="priority" class="flex justify-between">
                <span class="text-sm text-gray-600 capitalize">{{ priority }}:</span>
                <span class="text-sm font-medium text-gray-900">{{ 
                  jobsStore.jobs.filter(job => job.priority === priority).length 
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Data Management -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Demo Accounts</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-blue-900 mb-2">Available Demo Accounts</h4>
            <p class="text-sm text-blue-800 mb-4">
              Use these accounts to access different roles and perspectives in the application.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg border border-blue-200">
                <h5 class="font-medium text-gray-900">Platform Admin</h5>
                <div class="mt-2 space-y-1 text-sm">
                  <div><span class="text-gray-500">Email:</span> <span class="font-mono">admin@wecr8.info</span></div>
                  <div><span class="text-gray-500">Password:</span> <span class="font-mono">demo123</span></div>
                  <div class="text-xs text-gray-500 mt-2">Full platform administration access</div>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-lg border border-blue-200">
                <h5 class="font-medium text-gray-900">Organization Admin</h5>
                <div class="mt-2 space-y-1 text-sm">
                  <div><span class="text-gray-500">Email:</span> <span class="font-mono">org-admin@example.com</span></div>
                  <div><span class="text-gray-500">Password:</span> <span class="font-mono">demo123</span></div>
                  <div class="text-xs text-gray-500 mt-2">Organization administration access</div>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-lg border border-blue-200">
                <h5 class="font-medium text-gray-900">Operator</h5>
                <div class="mt-2 space-y-1 text-sm">
                  <div><span class="text-gray-500">Email:</span> <span class="font-mono">operator@example.com</span></div>
                  <div><span class="text-gray-500">Password:</span> <span class="font-mono">demo123</span></div>
                  <div class="text-xs text-gray-500 mt-2">Standard operator access</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-yellow-900">Important Notes</h4>
            <ul class="mt-2 space-y-2 text-sm text-yellow-800">
              <li>• Demo data is automatically generated for testing purposes</li>
              <li>• Use the controls above to manipulate data for presentations</li>
              <li>• All demo accounts have the password: <span class="font-mono">demo123</span></li>
              <li>• Data changes made in demo mode are not permanent and can be reset</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useJobsStore } from '../stores/jobs';
import DemoControls from '../components/DemoControls.vue';

const jobsStore = useJobsStore();

onMounted(async () => {
  await jobsStore.fetchJobs();
});
</script>