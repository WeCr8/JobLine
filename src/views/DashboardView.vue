<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Manufacturing operations overview</p>
      </div>
      <div class="text-sm text-gray-500">
        Last updated: {{ formatTime(new Date()) }}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="kpi in kpis"
        :key="kpi.name"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ kpi.name }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.value }}</p>
          </div>
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="kpi.bgColor"
          >
            <component :is="kpi.icon" :class="kpi.iconColor" class="w-6 h-6" />
          </div>
        </div>
        <div v-if="kpi.change" class="mt-4 flex items-center">
          <span 
            class="text-sm font-medium"
            :class="kpi.change > 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ kpi.change > 0 ? '+' : '' }}{{ kpi.change }}%
          </span>
          <span class="text-sm text-gray-500 ml-2">from last week</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Job Status Chart -->
      <ChartWidget
        title="Job Status Distribution"
        :data="jobStatusChartData"
        default-type="doughnut"
        @chart-type-changed="handleChartTypeChange"
        @refresh="refreshJobData"
      />

      <!-- Production Trend Chart -->
      <ChartWidget
        title="Daily Production Trend"
        :data="productionTrendData"
        default-type="line"
        @chart-type-changed="handleChartTypeChange"
        @refresh="refreshProductionData"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Active Jobs -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Active Jobs</h2>
              <router-link
                to="/jobs"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="jobsStore.loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div v-else-if="jobsStore.activeJobs.length === 0" class="text-center py-8">
              <BriefcaseIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">No active jobs</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="job in jobsStore.activeJobs.slice(0, 5)"
                :key="job.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3 class="font-medium text-gray-900">{{ job.jobNumber }}</h3>
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
                      :class="getStatusClass(job.status)"
                    >
                      {{ formatStatus(job.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ job.partName }} - {{ job.customer }}</p>
                  <div class="mt-2">
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{{ job.completedQuantity }}/{{ job.quantity }} parts</span>
                      <span>{{ Math.round((job.completedQuantity / job.quantity) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: `${(job.completedQuantity / job.quantity) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Chat -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Quick Assistant</h2>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <button
              v-for="query in quickQueries"
              :key="query"
              @click="handleQuickQuery(query)"
              class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <p class="text-sm font-medium text-gray-900">{{ query }}</p>
            </button>
          </div>
          <div class="mt-4">
            <router-link
              to="/chat"
              class="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon class="w-4 h-4 mr-2" />
              Open Full Chat
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Machine Status and Passdown Notes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Machine Status -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Machine Status</h2>
            <router-link
              to="/machines"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="machine in machines.slice(0, 3)"
              :key="machine.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="getMachineStatusDot(machine.status)"
                ></div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ machine.name }}</h3>
                  <p class="text-sm text-gray-600">{{ machine.currentJob || 'Available' }}</p>
                </div>
              </div>
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getMachineStatusClass(machine.status)"
              >
                {{ machine.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Passdown Notes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Passdown Notes</h2>
            <router-link
              to="/passdown"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="note in passdownStore.recentNotes.slice(0, 3)"
              :key="note.id"
              class="p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ note.workOrder }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(note.date) }}</span>
              </div>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>{{ note.machine }}</span>
                <span>{{ note.shift.charAt(0).toUpperCase() + note.shift.slice(1) }}</span>
                <span>{{ note.operator }}</span>
              </div>
              <p class="text-sm text-gray-700 mt-2 line-clamp-2">{{ note.nextShiftNotes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { useJobsStore } from '../stores/jobs';
import { useChatStore } from '../stores/chat';
import { usePassdownStore } from '../stores/passdown';
import ChartWidget from '../components/ChartWidget.vue';
import type { KPI, Machine, ChartData, ChartType } from '../types';
import {
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const jobsStore = useJobsStore();
const chatStore = useChatStore();
const passdownStore = usePassdownStore();

const kpis = computed<(KPI & { icon: any; bgColor: string; iconColor: string; change?: number })[]>(() => [
  {
    name: 'Active Jobs',
    value: jobsStore.activeJobs.length,
    icon: BriefcaseIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    change: 12
  },
  {
    name: 'On Schedule',
    value: `${Math.round((jobsStore.activeJobs.filter(j => j.status === 'running').length / Math.max(jobsStore.activeJobs.length, 1)) * 100)}%`,
    icon: ClockIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    change: 5
  },
  {
    name: 'Completed Today',
    value: jobsStore.completedJobs.length,
    icon: CheckCircleIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    change: -2
  },
  {
    name: 'Issues',
    value: jobsStore.jobs.filter(j => j.status === 'on-hold').length,
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    change: -15
  },
  {
    name: 'Settings',
    value: '',
    icon: CogIcon,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600'
  }
]);

const machines: Machine[] = [
  {
    id: '1',
    name: 'CNC-001',
    type: 'CNC Machining Center',
    status: 'running',
    currentJob: 'J2024-001',
    operator: 'John Smith',
    condition: 'running'
  },
  {
    id: '2',
    name: 'CNC-002',
    type: 'CNC Lathe',
    status: 'running',
    currentJob: 'J2024-002',
    operator: 'Sarah Johnson',
    condition: 'in-setup'
  },
  {
    id: '3',
    name: 'CNC-003',
    type: 'CNC Mill',
    status: 'idle',
    operator: 'Mike Wilson',
    condition: 'idle'
  }
];

const quickQueries = [
  'Show urgent jobs',
  'Machine status',
  'Jobs due this week',
  'Current issues'
];

// Chart data
const jobStatusChartData = computed<ChartData>(() => ({
  labels: ['Running', 'Setup', 'On Hold', 'Pending', 'Completed'],
  datasets: [{
    label: 'Jobs',
    data: [
      jobsStore.jobsByStatus.running,
      jobsStore.jobsByStatus.setup,
      jobsStore.jobsByStatus['on-hold'],
      jobsStore.jobsByStatus.pending,
      jobsStore.jobsByStatus.completed
    ],
    backgroundColor: ['#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#3b82f6']
  }]
}));

const productionTrendData = computed<ChartData>(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Parts Produced',
    data: [45, 52, 38, 61, 55, 42, 48],
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb'
  }]
}));

const getStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-gray-100 text-gray-800 border-gray-200',
    'setup': 'bg-purple-100 text-purple-800 border-purple-200',
    'running': 'bg-green-100 text-green-800 border-green-200',
    'on-hold': 'bg-red-100 text-red-800 border-red-200',
    'completed': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getMachineStatusClass = (status: string) => {
  const classes = {
    'running': 'bg-green-100 text-green-800',
    'idle': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-orange-100 text-orange-800',
    'down': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.idle;
};

const getMachineStatusDot = (status: string) => {
  const classes = {
    'running': 'bg-green-500 animate-pulse',
    'idle': 'bg-yellow-500',
    'maintenance': 'bg-orange-500',
    'down': 'bg-red-500'
  };
  return classes[status as keyof typeof classes] || classes.idle;
};

const formatStatus = (status: string) => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatTime = (date: Date) => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd');
};

const handleQuickQuery = async (query: string) => {
  await chatStore.processUserQuery(query);
  router.push('/chat');
};

const handleChartTypeChange = (type: ChartType) => {
  console.log('Chart type changed to:', type);
};

const refreshJobData = () => {
  jobsStore.fetchJobs();
};

const refreshProductionData = () => {
  console.log('Refreshing production data...');
};

onMounted(() => {
  jobsStore.fetchJobs();
  passdownStore.fetchNotes();
});
</script>