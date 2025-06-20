<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Departments</h1>
        <p class="text-gray-600">Manage departments and work centers in your organization</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
        <button
          @click="showAddDepartmentModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Department
        </button>
      </div>
    </div>

    <!-- Departments List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">All Departments</h3>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="dept in departments" :key="dept.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ dept.name }}</div>
                  <div class="text-xs text-gray-500">{{ dept.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 capitalize">{{ dept.department_type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ dept.supervisor }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ dept.operators?.length || 0 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ dept.active_jobs }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="editDepartment(dept)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="viewDepartmentUsers(dept)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Users
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Work Centers -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Work Centers</h3>
          <button
            @click="showAddWorkCenterModal = true"
            class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors duration-200"
          >
            Add Work Center
          </button>
        </div>
      </div>
      <div class="p-6">
        <div v-if="workCenters.length === 0" class="text-center py-8">
          <BuildingOfficeIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No work centers defined</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machines</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Load</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="wc in workCenters" :key="wc.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ wc.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getDepartmentName(wc.department_id) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ wc.machines.length }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ wc.capacity }} hours</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ wc.current_load }} hours</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ wc.efficiency }}%</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="editWorkCenter(wc)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="viewWorkCenterMachines(wc)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Machines
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Department Modal -->
    <div v-if="showAddDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Department</h3>
        
        <form @submit.prevent="addDepartment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department ID</label>
            <input
              v-model="newDepartment.id"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="cnc-machining"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="newDepartment.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="CNC Machining"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newDepartment.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Computer-controlled precision machining operations"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              v-model="newDepartment.department_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="production">Production</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
            <select
              v-model="newDepartment.supervisor_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingDepartment"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingDepartment ? 'Adding...' : 'Add Department' }}
            </button>
            <button
              type="button"
              @click="showAddDepartmentModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Work Center Modal -->
    <div v-if="showAddWorkCenterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Work Center</h3>
        
        <form @submit.prevent="addWorkCenter" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Work Center ID</label>
            <input
              v-model="newWorkCenter.id"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="wc-001"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="newWorkCenter.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="CNC Milling Center"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              v-model="newWorkCenter.department_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Capacity (hours per day)</label>
            <input
              v-model.number="newWorkCenter.capacity"
              type="number"
              min="1"
              max="24"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              v-model="newWorkCenter.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Bay A"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="addingWorkCenter"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ addingWorkCenter ? 'Adding...' : 'Add Work Center' }}
            </button>
            <button
              type="button"
              @click="showAddWorkCenterModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ArrowPathIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline';

// Mock data - in a real app, this would come from the database
const users = ref([
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@acme-manufacturing.com',
    role: 'organization_admin'
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@acme-manufacturing.com',
    role: 'manager'
  },
  {
    id: 'user-3',
    name: 'Mike Wilson',
    email: 'mike@acme-manufacturing.com',
    role: 'operator'
  }
]);

const departments = ref([
  {
    id: 'cnc-machining',
    name: 'CNC Machining',
    description: 'Computer-controlled precision machining operations',
    department_type: 'production',
    supervisor: 'Sarah Johnson',
    supervisor_id: 'user-2',
    operators: ['user-3'],
    active_jobs: 5
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: 'Quality assurance and inspection',
    department_type: 'support',
    supervisor: 'John Smith',
    supervisor_id: 'user-1',
    operators: [],
    active_jobs: 0
  }
]);

const workCenters = ref([
  {
    id: 'wc-001',
    name: 'CNC Milling Center',
    department_id: 'cnc-machining',
    machines: ['CNC-001', 'CNC-003', 'CNC-005'],
    capacity: 24,
    current_load: 18,
    efficiency: 85,
    location: 'Bay A'
  },
  {
    id: 'wc-002',
    name: 'CNC Turning Center',
    department_id: 'cnc-machining',
    machines: ['CNC-002', 'CNC-004'],
    capacity: 16,
    current_load: 12,
    efficiency: 90,
    location: 'Bay B'
  }
]);

const showAddDepartmentModal = ref(false);
const showAddWorkCenterModal = ref(false);
const addingDepartment = ref(false);
const addingWorkCenter = ref(false);

const newDepartment = reactive({
  id: '',
  name: '',
  description: '',
  department_type: 'production',
  supervisor_id: ''
});

const newWorkCenter = reactive({
  id: '',
  name: '',
  department_id: '',
  capacity: 24,
  location: ''
});

const refreshData = async () => {
  // In a real app, you would fetch data from the database
  console.log('Refreshing data...');
};

const getDepartmentName = (departmentId: string | undefined) => {
  if (!departmentId) return 'None';
  const dept = departments.value.find(d => d.id === departmentId);
  return dept ? dept.name : departmentId;
};

const addDepartment = async () => {
  addingDepartment.value = true;
  try {
    // In a real app, you would implement this
    console.log('Adding department:', newDepartment);
    
    // Simulate adding a department
    const supervisorUser = users.value.find(u => u.id === newDepartment.supervisor_id);
    const newDept = {
      id: newDepartment.id,
      name: newDepartment.name,
      description: newDepartment.description,
      department_type: newDepartment.department_type,
      supervisor: supervisorUser?.name || 'Not assigned',
      supervisor_id: newDepartment.supervisor_id,
      operators: [],
      active_jobs: 0
    };
    departments.value.push(newDept);
    
    showAddDepartmentModal.value = false;
    
    // Reset form
    Object.assign(newDepartment, {
      id: '',
      name: '',
      description: '',
      department_type: 'production',
      supervisor_id: ''
    });
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    addingDepartment.value = false;
  }
};

const editDepartment = (dept: any) => {
  // In a real app, you would implement this
  console.log('Edit department:', dept);
};

const viewDepartmentUsers = (dept: any) => {
  // In a real app, you would implement this
  console.log('View department users:', dept);
};

const addWorkCenter = async () => {
  addingWorkCenter.value = true;
  try {
    // In a real app, you would implement this
    console.log('Adding work center:', newWorkCenter);
    
    // Simulate adding a work center
    const newWC = {
      id: newWorkCenter.id,
      name: newWorkCenter.name,
      department_id: newWorkCenter.department_id,
      machines: [],
      capacity: newWorkCenter.capacity,
      current_load: 0,
      efficiency: 0,
      location: newWorkCenter.location
    };
    workCenters.value.push(newWC);
    
    showAddWorkCenterModal.value = false;
    
    // Reset form
    Object.assign(newWorkCenter, {
      id: '',
      name: '',
      department_id: '',
      capacity: 24,
      location: ''
    });
  } catch (error) {
    console.error('Error adding work center:', error);
  } finally {
    addingWorkCenter.value = false;
  }
};

const editWorkCenter = (wc: any) => {
  // In a real app, you would implement this
  console.log('Edit work center:', wc);
};

const viewWorkCenterMachines = (wc: any) => {
  // In a real app, you would implement this
  console.log('View work center machines:', wc);
};

onMounted(async () => {
  await refreshData();
});
</script>
```