<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manufacturing Operations</h1>
        <p class="text-gray-600">Monitor equipment across all departments and support functions</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <select 
          v-model="selectedDepartmentType"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Departments</option>
          <option value="production">Production Departments</option>
          <option value="support">Support Departments</option>
        </select>
        <select 
          v-model="selectedDepartment"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Specific Departments</option>
          <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
        <button class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200">
          Add Equipment
        </button>
      </div>
    </div>

    <!-- Department Type Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          @click="selectedDepartmentType = ''"
          :class="selectedDepartmentType === '' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
        >
          All Departments ({{ manufacturingStore.departments.length }})
        </button>
        <button
          @click="selectedDepartmentType = 'production'"
          :class="selectedDepartmentType === 'production' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
        >
          Production ({{ manufacturingStore.departmentsByType.production.length }})
        </button>
        <button
          @click="selectedDepartmentType = 'support'"
          :class="selectedDepartmentType === 'support' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
        >
          Support Functions ({{ manufacturingStore.departmentsByType.support.length }})
        </button>
      </nav>
    </div>

    <!-- Department Overview Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="dept in filteredDepartments"
        :key="dept.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-medium text-gray-900">{{ dept.name }}</h3>
            <p class="text-xs text-gray-500">{{ dept.supervisor }}</p>
          </div>
          <div class="text-right">
            <span class="text-sm text-gray-500">{{ dept.machines.length }} units</span>
            <div class="flex items-center space-x-1 mt-1">
              <span 
                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                :class="getShiftClass(dept.shift)"
              >
                {{ formatShift(dept.shift) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Efficiency:</span>
            <span class="font-medium text-gray-900">{{ dept.efficiency }}%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Utilization:</span>
            <span class="font-medium text-gray-900">{{ dept.utilizationRate }}%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Active Jobs:</span>
            <span class="font-medium text-gray-900">{{ dept.activeJobs }}</span>
          </div>
        </div>

        <!-- KPIs -->
        <div v-if="dept.kpis.length > 0" class="mt-3 pt-3 border-t border-gray-200">
          <h4 class="text-xs font-medium text-gray-700 mb-2">Key Metrics</h4>
          <div class="space-y-1">
            <div
              v-for="kpi in dept.kpis.slice(0, 2)"
              :key="kpi.name"
              class="flex justify-between text-xs"
            >
              <span class="text-gray-600">{{ kpi.name }}:</span>
              <div class="flex items-center space-x-1">
                <span class="font-medium text-gray-900">{{ kpi.value }}{{ kpi.unit }}</span>
                <component 
                  :is="getTrendIcon(kpi.trend)" 
                  class="w-3 h-3"
                  :class="getTrendColor(kpi.trend)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Capabilities -->
        <div class="mt-3 pt-3 border-t border-gray-200">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="capability in dept.capabilities.slice(0, 3)"
              :key="capability"
              class="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs capitalize"
            >
              {{ capability.replace('-', ' ') }}
            </span>
            <span
              v-if="dept.capabilities.length > 3"
              class="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs"
            >
              +{{ dept.capabilities.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Equipment Grid -->
    <div v-if="manufacturingStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-2 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    </div>

    <div v-else-if="filteredMachines.length > 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Equipment & Systems</h2>
        <span class="text-sm text-gray-500">{{ filteredMachines.length }} units</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="machine in filteredMachines"
          :key="machine.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ machine.name }}</h3>
              <p class="text-sm text-gray-600">{{ machine.type }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <p class="text-xs text-gray-500 capitalize">{{ getDepartmentName(machine.department) }}</p>
                <span class="text-xs text-gray-400">•</span>
                <p class="text-xs text-gray-500">{{ machine.location }}</p>
              </div>
            </div>
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(machine.status)"
            >
              {{ machine.status.toUpperCase() }}
            </span>
          </div>

          <!-- Status Indicator -->
          <div class="mb-4">
            <div class="flex items-center space-x-2">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getStatusDotClass(machine.status)"
              ></div>
              <span class="text-sm font-medium text-gray-900">
                {{ getStatusText(machine.status) }}
              </span>
            </div>
          </div>

          <!-- Current Assignment -->
          <div v-if="machine.currentJob || machine.operator" class="space-y-3 mb-4">
            <div v-if="machine.currentJob">
              <span class="text-sm text-gray-500">Current Job:</span>
              <p class="font-medium text-gray-900">{{ machine.currentJob }}</p>
            </div>
            <div v-if="machine.operator">
              <span class="text-sm text-gray-500">Operator:</span>
              <p class="font-medium text-gray-900">{{ machine.operator }}</p>
            </div>
          </div>

          <!-- Capabilities -->
          <div class="mb-4">
            <span class="text-sm text-gray-500">Capabilities:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="capability in machine.capabilities.slice(0, 3)"
                :key="capability"
                class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs capitalize"
              >
                {{ capability.replace('-', ' ') }}
              </span>
              <span
                v-if="machine.capabilities.length > 3"
                class="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs"
              >
                +{{ machine.capabilities.length - 3 }} more
              </span>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div v-if="machine.utilizationRate !== undefined" class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Utilization</span>
              <span>{{ machine.utilizationRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getUtilizationColor(machine.utilizationRate)"
                :style="{ width: `${machine.utilizationRate}%` }"
              ></div>
            </div>
          </div>

          <div v-if="machine.efficiency !== undefined" class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Efficiency</span>
              <span>{{ machine.efficiency }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getEfficiencyColor(machine.efficiency)"
                :style="{ width: `${machine.efficiency}%` }"
              ></div>
            </div>
          </div>

          <!-- Maintenance Info -->
          <div v-if="machine.lastMaintenance" class="mb-4 text-xs text-gray-500">
            <div>Last Maintenance: {{ formatDate(machine.lastMaintenance) }}</div>
            <div v-if="machine.nextMaintenance">Next Maintenance: {{ formatDate(machine.nextMaintenance) }}</div>
          </div>

          <!-- Machine Details -->
          <div v-if="machine.manufacturer" class="mb-4 text-xs text-gray-500">
            <div>{{ machine.manufacturer }} {{ machine.model }}</div>
            <div v-if="machine.yearInstalled">Installed: {{ machine.yearInstalled }}</div>
            <div v-if="machine.serialNumber">S/N: {{ machine.serialNumber }}</div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="viewMachineDetails(machine.id)"
              class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Details
            </button>
            <button
              v-if="machine.status === 'idle'"
              @click="assignJob(machine.id)"
              class="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Assign
            </button>
            <button
              v-else-if="machine.status === 'running' && machine.currentJob"
              @click="viewCurrentJob(machine.currentJob)"
              class="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
            >
              View Job
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Summary -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Overall Performance</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ manufacturingStore.overallEfficiency }}%</div>
            <div class="text-sm text-gray-600">Overall Efficiency</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ manufacturingStore.overallUtilization }}%</div>
            <div class="text-sm text-gray-600">Overall Utilization</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">{{ manufacturingStore.activeMachines.length }}</div>
            <div class="text-sm text-gray-600">Active Equipment</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ manufacturingStore.availableMachines.length }}</div>
            <div class="text-sm text-gray-600">Available Equipment</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useManufacturingStore } from '../stores/manufacturing';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon
} from '@heroicons/vue/24/outline';

const manufacturingStore = useManufacturingStore();
const selectedDepartmentType = ref('');
const selectedDepartment = ref('');

const filteredDepartments = computed(() => {
  let departments = manufacturingStore.departments;
  
  if (selectedDepartmentType.value === 'production') {
    departments = manufacturingStore.departmentsByType.production;
  } else if (selectedDepartmentType.value === 'support') {
    departments = manufacturingStore.departmentsByType.support;
  }
  
  if (selectedDepartment.value) {
    departments = departments.filter(d => d.id === selectedDepartment.value);
  }
  
  return departments;
});

const filteredMachines = computed(() => {
  if (!selectedDepartment.value && !selectedDepartmentType.value) {
    return manufacturingStore.machines;
  }
  
  if (selectedDepartment.value) {
    return manufacturingStore.machines.filter(machine => machine.department === selectedDepartment.value);
  }
  
  if (selectedDepartmentType.value) {
    const deptIds = filteredDepartments.value.map(d => d.id);
    return manufacturingStore.machines.filter(machine => deptIds.includes(machine.department));
  }
  
  return manufacturingStore.machines;
});

const getDepartmentName = (departmentId: string) => {
  const dept = manufacturingStore.departments.find(d => d.id === departmentId);
  return dept?.name || departmentId;
};

const getShiftClass = (shift: string) => {
  const classes = {
    'day': 'bg-yellow-100 text-yellow-800',
    'evening': 'bg-orange-100 text-orange-800',
    'night': 'bg-blue-100 text-blue-800',
    'all-shifts': 'bg-purple-100 text-purple-800'
  };
  return classes[shift as keyof typeof classes] || classes.day;
};

const formatShift = (shift: string) => {
  if (shift === 'all-shifts') return '24/7';
  return shift.charAt(0).toUpperCase() + shift.slice(1);
};

const getTrendIcon = (trend: string) => {
  const icons = {
    'up': ChevronUpIcon,
    'down': ChevronDownIcon,
    'stable': MinusIcon
  };
  return icons[trend as keyof typeof icons] || MinusIcon;
};

const getTrendColor = (trend: string) => {
  const colors = {
    'up': 'text-green-500',
    'down': 'text-red-500',
    'stable': 'text-gray-500'
  };
  return colors[trend as keyof typeof colors] || colors.stable;
};

const getStatusClass = (status: string) => {
  const classes = {
    'running': 'bg-green-100 text-green-800',
    'idle': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-orange-100 text-orange-800',
    'down': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.idle;
};

const getStatusDotClass = (status: string) => {
  const classes = {
    'running': 'bg-green-500 animate-pulse',
    'idle': 'bg-yellow-500',
    'maintenance': 'bg-orange-500',
    'down': 'bg-red-500'
  };
  return classes[status as keyof typeof classes] || classes.idle;
};

const getStatusText = (status: string) => {
  const texts = {
    'running': 'Currently Running',
    'idle': 'Available',
    'maintenance': 'Under Maintenance',
    'down': 'Out of Service'
  };
  return texts[status as keyof typeof texts] || 'Unknown';
};

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 90) return 'bg-green-500';
  if (utilization >= 75) return 'bg-blue-500';
  if (utilization >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 95) return 'bg-green-500';
  if (efficiency >= 85) return 'bg-blue-500';
  if (efficiency >= 75) return 'bg-yellow-500';
  return 'bg-red-500';
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd');
};

const viewMachineDetails = (machineId: string) => {
  console.log('View details for machine:', machineId);
};

const assignJob = (machineId: string) => {
  console.log('Assign job to machine:', machineId);
};

const viewCurrentJob = (jobId: string | undefined) => {
  if (jobId) {
    console.log('View job:', jobId);
  }
};

onMounted(() => {
  manufacturingStore.fetchDepartments();
  manufacturingStore.fetchMachines();
});
</script>