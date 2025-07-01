<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ authStore.user?.name }}</p>
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

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">My Active Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeJobs.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BriefcaseIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completed Today</p>
            <p class="text-2xl font-bold text-gray-900">{{ completedToday }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Performance Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ performanceScore }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrophyIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Machine Status</p>
            <p class="text-2xl font-bold text-gray-900">{{ assignedMachine?.status || 'N/A' }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CogIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- My Jobs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">My Jobs</h3>
          <router-link
            to="/team/jobs"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div v-if="activeJobs.length === 0" class="text-center py-8">
          <BriefcaseIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No active jobs assigned to you</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="job in activeJobs.slice(0, 3)"
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

    <!-- Machine Status -->
    <div v-if="assignedMachine" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Assigned Machine</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getMachineStatusDot(assignedMachine.status)"
              ></div>
              <h4 class="text-lg font-medium text-gray-900">{{ assignedMachine.name }}</h4>
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getMachineStatusClass(assignedMachine.status)"
              >
                {{ assignedMachine.status.toUpperCase() }}
              </span>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium text-gray-900">{{ assignedMachine.type }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Current Job:</span>
                <span class="font-medium text-gray-900">{{ assignedMachine.currentJob || 'None' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium text-gray-900">{{ assignedMachine.location }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Last Maintenance:</span>
                <span class="font-medium text-gray-900">{{ formatDate(assignedMachine.lastMaintenance) }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-3">Machine Performance</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Utilization</span>
                  <span>{{ assignedMachine.utilizationRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${assignedMachine.utilizationRate}%` }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Efficiency</span>
                  <span>{{ assignedMachine.efficiency }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${assignedMachine.efficiency}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Passdown Notes -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Recent Passdown Notes</h3>
          <router-link
            to="/team/passdown"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div v-if="passdownNotes.length === 0" class="text-center py-8">
          <DocumentTextIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No passdown notes yet</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="note in passdownNotes.slice(0, 2)"
            :key="note.id"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-3">
                <span class="font-medium text-gray-900">{{ note.workOrder }}</span>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getShiftClass(note.shift)"
                >
                  {{ note.shift.toUpperCase() }} SHIFT
                </span>
              </div>
              <span class="text-xs text-gray-500">{{ formatDate(note.date) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ note.nextShiftNotes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useAuthStore } from '../stores/auth.ts';
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  TrophyIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

// Mock data - in a real app, this would come from the database
const activeJobs = ref([
  {
    id: '1',
    jobNumber: 'J2024-001',
    partNumber: 'PN-12345',
    partName: 'Hydraulic Cylinder Housing',
    customer: 'Acme Manufacturing',
    quantity: 50,
    completedQuantity: 35,
    status: 'running',
    priority: 'high',
    dueDate: '2024-01-15',
    machine: 'CNC-001'
  },
  {
    id: '2',
    jobNumber: 'J2024-002',
    partNumber: 'PN-67890',
    partName: 'Gear Assembly',
    customer: 'TechCorp Industries',
    quantity: 25,
    completedQuantity: 0,
    status: 'setup',
    priority: 'medium',
    dueDate: '2024-01-20',
    machine: 'CNC-002'
  }
]);

const completedToday = ref(3);
const performanceScore = ref(92);

const assignedMachine = ref({
  id: 'CNC-001',
  name: 'Haas VF-4SS',
  type: 'CNC Vertical Machining Center',
  status: 'running',
  currentJob: 'J2024-001',
  condition: 'running',
  lastMaintenance: '2024-01-10',
  nextMaintenance: '2024-02-10',
  utilizationRate: 92,
  efficiency: 87,
  location: 'Bay A-1'
});

const passdownNotes = ref([
  {
    id: '1',
    workOrder: 'J2024-001',
    shift: 'day',
    date: '2024-01-12',
    operator: 'John Smith',
    machine: 'CNC-001',
    nextShiftNotes: 'Continue with current setup. Monitor spindle vibration. Tool change due at part 40.'
  },
  {
    id: '2',
    workOrder: 'J2024-002',
    shift: 'evening',
    date: '2024-01-12',
    operator: 'Sarah Johnson',
    machine: 'CNC-002',
    nextShiftNotes: 'Setup 80% complete. Need tool verification and coolant change. First article inspection ready.'
  }
]);

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatStatus = (status: string) => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

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

const getShiftClass = (shift: string) => {
  const classes = {
    'day': 'bg-yellow-100 text-yellow-800',
    'evening': 'bg-orange-100 text-orange-800',
    'night': 'bg-blue-100 text-blue-800'
  };
  return classes[shift as keyof typeof classes] || classes.day;
};

onMounted(async () => {
  await refreshData();
});
</script>