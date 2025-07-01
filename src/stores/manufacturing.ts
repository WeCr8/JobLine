import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../services/api.service';
import type { 
  ManufacturingDepartment, 
  Machine, 
  WorkCenter, 
  Process,
  Capability,
  DigitalTwinCompliance,
  ToolDataIntegrity,
  MaterialInventory,
  PurchaseOrder,
  ShippingReceiving,
  ProgrammingTask
} from '../types/manufacturing';
import { demoService } from '../services/demo.service';
import { useAuthStore } from './auth';

export const useManufacturingStore = defineStore('manufacturing', () => {
  const departments = ref<ManufacturingDepartment[]>([]);
  const machines = ref<Machine[]>([]);
  const workCenters = ref<WorkCenter[]>([]);
  const processes = ref<Process[]>([]);
  const capabilities = ref<Capability[]>([]);
  const digitalTwinCompliance = ref<DigitalTwinCompliance[]>([]);
  const toolDataIntegrity = ref<ToolDataIntegrity[]>([]);
  const materialInventory = ref<MaterialInventory[]>([]);
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const shippingReceiving = ref<ShippingReceiving[]>([]);
  const programmingTasks = ref<ProgrammingTask[]>([]);
  const loading = ref(false);
  const authStore = useAuthStore();

  const fetchDepartments = async () => {
    loading.value = true;
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Use hardcoded demo data
        departments.value = demoService.getDemoData('departments') as ManufacturingDepartment[];
      } else {
        // Use real data from API
        const { data, error } = await supabase
          .from('departments')
          .select('*');
        
        if (error) throw error;
        
        // Map database fields to our ManufacturingDepartment type
        departments.value = (data || []).map(dept => ({
          id: dept.id,
          name: dept.name,
          description: dept.description || '',
          supervisor: dept.supervisor || 'Unassigned',
          shift: dept.shift || 'day',
          capabilities: dept.capabilities || [],
          qualityStandards: dept.quality_standards || [],
          machines: dept.machines || [],
          operators: [], // Would need to fetch from users table
          activeJobs: dept.active_jobs || 0,
          efficiency: dept.efficiency || 0,
          utilizationRate: dept.utilization_rate || 0,
          kpis: [
            { name: 'Efficiency', value: dept.efficiency || 0, target: 85, unit: '%', trend: 'up' },
            { name: 'Utilization', value: dept.utilization_rate || 0, target: 80, unit: '%', trend: 'stable' }
          ],
          integrations: dept.integrations || []
        }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to empty array
      departments.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchMachines = async () => {
    loading.value = true;
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Use hardcoded demo data
        machines.value = demoService.getDemoData('machines') as Machine[];
      } else {
        // Use real data from API
        const { data, error } = await supabase
          .from('machines')
          .select('*');
        
        if (error) throw error;
        
        // Map database fields to our Machine type
        machines.value = (data || []).map(machine => ({
          id: machine.id,
          name: machine.name,
          type: machine.type,
          department: machine.department_id || '',
          status: machine.status || 'idle',
          capabilities: machine.capabilities || [],
          specifications: machine.specifications || {},
          currentJob: machine.current_job_id,
          operator: machine.operator_id,
          condition: machine.condition || 'idle',
          lastMaintenance: machine.last_maintenance,
          nextMaintenance: machine.next_maintenance,
          utilizationRate: machine.utilization_rate || 0,
          efficiency: machine.efficiency || 0,
          location: machine.location || '',
          serialNumber: machine.serial_number,
          manufacturer: machine.manufacturer,
          model: machine.model,
          yearInstalled: machine.year_installed
        }));
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      // Fallback to empty array
      machines.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchWorkCenters = async () => {
    loading.value = true;
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Use hardcoded demo data - would need to implement this in demoService
        workCenters.value = [];
      } else {
        // Use real data from API
        const { data, error } = await supabase
          .from('work_centers')
          .select('*');
        
        if (error) throw error;
        
        // Map database fields to our WorkCenter type
        workCenters.value = (data || []).map(wc => ({
          id: wc.id,
          name: wc.name,
          department: wc.department_id || '',
          machines: wc.machines || [],
          capabilities: wc.capabilities || [],
          capacity: wc.capacity || 24,
          currentLoad: wc.current_load || 0,
          efficiency: wc.efficiency || 0,
          setupTime: wc.setup_time || 0,
          cycleTime: wc.cycle_time || 0,
          location: wc.location || '',
          supervisor: wc.supervisor_id || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching work centers:', error);
      // Fallback to empty array
      workCenters.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchProcesses = async () => {
    loading.value = true;
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll just set loading to false
      processes.value = [];
    } catch (error) {
      console.error('Error fetching processes:', error);
      processes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCapabilities = async () => {
    loading.value = true;
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll just set loading to false
      capabilities.value = [];
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      capabilities.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const departmentsByType = computed(() => {
    const production = departments.value.filter(d => 
      ['cnc-machining', 'sheet-metal', 'welding', 'additive', 'assembly'].includes(d.id)
    );
    const support = departments.value.filter(d => 
      ['purchasing', 'shipping-receiving', 'material-stores', 'tdit', 'digital-twin-compliance', 'programming', 'quality', 'maintenance', 'planning'].includes(d.id)
    );
    return { production, support };
  });

  const machinesByDepartment = computed(() => {
    const byDept: Record<string, Machine[]> = {};
    machines.value.forEach(machine => {
      if (!byDept[machine.department]) byDept[machine.department] = [];
      byDept[machine.department].push(machine);
    });
    return byDept;
  });

  const activeMachines = computed(() => 
    machines.value.filter(machine => machine.status === 'running')
  );

  const availableMachines = computed(() => 
    machines.value.filter(machine => machine.status === 'idle')
  );

  const overallEfficiency = computed(() => {
    if (departments.value.length === 0) return 0;
    const totalEfficiency = departments.value.reduce((sum, dept) => sum + dept.efficiency, 0);
    return Math.round(totalEfficiency / departments.value.length);
  });

  const overallUtilization = computed(() => {
    if (departments.value.length === 0) return 0;
    const totalUtilization = departments.value.reduce((sum, dept) => sum + dept.utilizationRate, 0);
    return Math.round(totalUtilization / departments.value.length);
  });

  return {
    departments,
    machines,
    workCenters,
    processes,
    capabilities,
    digitalTwinCompliance,
    toolDataIntegrity,
    materialInventory,
    purchaseOrders,
    shippingReceiving,
    programmingTasks,
    loading,
    departmentsByType,
    machinesByDepartment,
    activeMachines,
    availableMachines,
    overallEfficiency,
    overallUtilization,
    fetchDepartments,
    fetchMachines,
    fetchWorkCenters,
    fetchProcesses,
    fetchCapabilities
  };
});