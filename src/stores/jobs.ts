import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Job, JobStatus, Priority, JobOperation, DNCProgram, QualityRequirement, MaterialRequirement, Drawing, JobHistoryEntry } from '../types';

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([]);
  const loading = ref(false);

  // Enhanced mock data with operations and DNC programs
  const mockJobs: Job[] = [
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
      startDate: '2024-01-08',
      estimatedHours: 40,
      actualHours: 28,
      operator: 'John Smith',
      machine: 'CNC-001',
      operation: 'Machining',
      notes: 'Customer requested expedited delivery',
      operations: [
        {
          id: 'op-1-1',
          operationNumber: 10,
          name: 'Rough Machining',
          description: 'Rough machine external features',
          workCenter: 'CNC Milling',
          machine: 'CNC-001',
          setupTime: 45,
          cycleTime: 25,
          status: 'completed',
          completedQuantity: 50,
          operator: 'John Smith',
          startTime: '2024-01-08T08:00:00Z',
          endTime: '2024-01-09T16:00:00Z',
          tooling: ['1/2" End Mill', '3/4" Face Mill'],
          programs: ['prog-1-1'],
          qualityChecks: [],
          instructions: [
            'Use flood coolant throughout operation',
            'Check first piece dimensions before continuing',
            'Deburr all edges after machining'
          ]
        },
        {
          id: 'op-1-2',
          operationNumber: 20,
          name: 'Finish Machining',
          description: 'Finish machine to final dimensions',
          workCenter: 'CNC Milling',
          machine: 'CNC-001',
          setupTime: 30,
          cycleTime: 35,
          status: 'running',
          completedQuantity: 35,
          operator: 'John Smith',
          startTime: '2024-01-10T08:00:00Z',
          tooling: ['1/4" End Mill', '1/8" End Mill'],
          programs: ['prog-1-2'],
          qualityChecks: [
            {
              id: 'qc-1-1',
              requirementId: 'req-1-1',
              timestamp: '2024-01-12T10:30:00Z',
              inspector: 'Mike Davis',
              result: 'pass',
              actualValue: '2.0005"',
              notes: 'Within tolerance'
            }
          ],
          instructions: [
            'Use mist coolant for finish passes',
            'Maintain surface finish Ra 32 or better',
            'Check critical dimensions every 5 parts'
          ]
        },
        {
          id: 'op-1-3',
          operationNumber: 30,
          name: 'Drilling & Tapping',
          description: 'Drill holes and tap threads',
          workCenter: 'CNC Milling',
          machine: 'CNC-001',
          setupTime: 20,
          cycleTime: 15,
          status: 'pending',
          completedQuantity: 0,
          tooling: ['1/4" Drill', 'M6 Tap'],
          programs: ['prog-1-3'],
          qualityChecks: [],
          instructions: [
            'Use tapping fluid for all threaded holes',
            'Check thread pitch with go/no-go gauges',
            'Deburr all holes'
          ]
        }
      ],
      dncPrograms: [
        {
          id: 'prog-1-1',
          programNumber: 'O1001',
          name: 'Rough Machining Program',
          description: 'Rough machining of external features',
          filePath: '/programs/O1001.nc',
          version: 'Rev C',
          lastModified: '2024-01-05T14:30:00Z',
          operationId: 'op-1-1',
          machine: 'CNC-001',
          toolList: [
            {
              id: 'tool-1',
              toolNumber: 1,
              description: '1/2" Carbide End Mill',
              type: 'end-mill',
              diameter: 0.5,
              length: 3.0,
              material: 'Carbide',
              coating: 'TiAlN',
              vendor: 'Sandvik',
              partNumber: 'R390-012A16-11L',
              location: 'Tool Crib A-15',
              status: 'available'
            },
            {
              id: 'tool-2',
              toolNumber: 2,
              description: '3/4" Face Mill',
              type: 'face-mill',
              diameter: 0.75,
              length: 2.5,
              material: 'Carbide',
              vendor: 'Kennametal',
              partNumber: 'F4042R.750.Z05.08',
              location: 'Tool Crib A-20',
              status: 'available'
            }
          ],
          parameters: [
            { name: 'Spindle Speed', value: 2500, description: 'RPM for rough cuts', unit: 'RPM' },
            { name: 'Feed Rate', value: 50, description: 'Feed rate for roughing', unit: 'IPM' },
            { name: 'Depth of Cut', value: 0.1, description: 'Axial depth per pass', unit: 'in' }
          ],
          estimatedRunTime: 120,
          status: 'active'
        },
        {
          id: 'prog-1-2',
          programNumber: 'O1002',
          name: 'Finish Machining Program',
          description: 'Finish machining to final dimensions',
          filePath: '/programs/O1002.nc',
          version: 'Rev B',
          lastModified: '2024-01-03T09:15:00Z',
          operationId: 'op-1-2',
          machine: 'CNC-001',
          toolList: [
            {
              id: 'tool-3',
              toolNumber: 3,
              description: '1/4" Carbide End Mill',
              type: 'end-mill',
              diameter: 0.25,
              length: 2.0,
              material: 'Carbide',
              coating: 'AlCrN',
              vendor: 'Sandvik',
              partNumber: 'R390-025A20-17L',
              location: 'Tool Crib A-10',
              status: 'in-use'
            }
          ],
          parameters: [
            { name: 'Spindle Speed', value: 4000, description: 'RPM for finish cuts', unit: 'RPM' },
            { name: 'Feed Rate', value: 25, description: 'Feed rate for finishing', unit: 'IPM' }
          ],
          estimatedRunTime: 180,
          status: 'active'
        }
      ],
      qualityRequirements: [
        {
          id: 'req-1-1',
          feature: 'Overall Length',
          specification: '2.000" ± 0.005"',
          tolerance: '±0.005"',
          inspectionMethod: 'Caliper measurement',
          frequency: 'first-piece',
          operationId: 'op-1-2'
        },
        {
          id: 'req-1-2',
          feature: 'Bore Diameter',
          specification: '1.250" +0.002/-0.000',
          tolerance: '+0.002/-0.000',
          inspectionMethod: 'Bore gauge',
          frequency: 'in-process'
        }
      ],
      tooling: [],
      materials: [
        {
          id: 'mat-1-1',
          material: 'Aluminum 6061-T6',
          specification: 'ASTM B221',
          quantity: 50,
          unit: 'lbs',
          lotNumber: 'AL-2024-001',
          certificationRequired: true,
          received: true,
          location: 'Material Rack B-5'
        }
      ],
      drawings: [
        {
          id: 'dwg-1-1',
          name: 'Hydraulic Cylinder Housing',
          revision: 'C',
          filePath: '/drawings/PN-12345-RevC.pdf',
          type: 'part',
          lastModified: '2024-01-01T12:00:00Z'
        },
        {
          id: 'dwg-1-2',
          name: 'Setup Sheet - Op 10',
          revision: 'A',
          filePath: '/drawings/PN-12345-Setup-Op10.pdf',
          type: 'setup',
          lastModified: '2024-01-05T10:00:00Z',
          operationId: 'op-1-1'
        }
      ],
      history: [
        {
          id: 'hist-1-1',
          timestamp: '2024-01-12T14:30:00Z',
          userId: 'user-1',
          userName: 'John Smith',
          action: 'quantity-updated',
          field: 'completedQuantity',
          oldValue: 30,
          newValue: 35,
          notes: 'Completed 5 more parts',
          operationId: 'op-1-2'
        },
        {
          id: 'hist-1-2',
          timestamp: '2024-01-10T08:00:00Z',
          userId: 'user-1',
          userName: 'John Smith',
          action: 'operation-started',
          notes: 'Started finish machining operation',
          operationId: 'op-1-2'
        }
      ],
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-12T14:30:00Z'
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
      estimatedHours: 20,
      actualHours: 2,
      operator: 'Sarah Johnson',
      machine: 'CNC-002',
      operation: 'Setup',
      notes: 'Waiting for tooling verification',
      operations: [
        {
          id: 'op-2-1',
          operationNumber: 10,
          name: 'Gear Cutting',
          description: 'Cut gear teeth using gear hobbing',
          workCenter: 'Gear Hobbing',
          machine: 'CNC-002',
          setupTime: 60,
          cycleTime: 45,
          status: 'setup',
          completedQuantity: 0,
          operator: 'Sarah Johnson',
          tooling: ['Gear Hob', 'Arbor'],
          programs: ['prog-2-1'],
          qualityChecks: [],
          instructions: [
            'Verify gear hob condition before setup',
            'Check tooth profile with gear checker',
            'Maintain proper cutting fluid flow'
          ]
        }
      ],
      dncPrograms: [
        {
          id: 'prog-2-1',
          programNumber: 'O2001',
          name: 'Gear Hobbing Program',
          description: 'Gear cutting program for 24-tooth gear',
          filePath: '/programs/O2001.nc',
          version: 'Rev A',
          lastModified: '2024-01-08T16:00:00Z',
          operationId: 'op-2-1',
          machine: 'CNC-002',
          toolList: [
            {
              id: 'tool-4',
              toolNumber: 1,
              description: 'Module 2.5 Gear Hob',
              type: 'insert',
              diameter: 3.0,
              length: 4.0,
              material: 'HSS',
              vendor: 'Gleason',
              partNumber: 'GH-M2.5-20PA',
              location: 'Tool Crib C-10',
              status: 'maintenance'
            }
          ],
          parameters: [
            { name: 'Hob Speed', value: 150, description: 'Hob rotation speed', unit: 'RPM' },
            { name: 'Feed Rate', value: 2.5, description: 'Axial feed rate', unit: 'mm/rev' }
          ],
          estimatedRunTime: 60,
          status: 'active'
        }
      ],
      qualityRequirements: [
        {
          id: 'req-2-1',
          feature: 'Tooth Profile',
          specification: 'DIN 3962 Class 6',
          tolerance: 'Class 6',
          inspectionMethod: 'Gear checker',
          frequency: 'first-piece'
        }
      ],
      tooling: [],
      materials: [
        {
          id: 'mat-2-1',
          material: 'Steel 4140',
          specification: 'AISI 4140 HT',
          quantity: 25,
          unit: 'pcs',
          received: true,
          certificationRequired: false,
          location: 'Material Rack A-10'
        }
      ],
      drawings: [
        {
          id: 'dwg-2-1',
          name: 'Gear Assembly Drawing',
          revision: 'B',
          filePath: '/drawings/PN-67890-RevB.pdf',
          type: 'part',
          lastModified: '2024-01-02T14:00:00Z'
        }
      ],
      history: [
        {
          id: 'hist-2-1',
          timestamp: '2024-01-12T10:15:00Z',
          userId: 'user-2',
          userName: 'Sarah Johnson',
          action: 'status-changed',
          field: 'status',
          oldValue: 'pending',
          newValue: 'setup',
          notes: 'Started job setup'
        }
      ],
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-12T10:15:00Z'
    }
  ];

  const fetchJobs = async () => {
    loading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    jobs.value = mockJobs;
    loading.value = false;
  };

  const updateJobStatus = async (jobId: string, status: JobStatus, notes?: string) => {
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
        userName: 'Current User',
        action: 'status-changed',
        field: 'status',
        oldValue: oldStatus,
        newValue: status,
        notes
      };
      job.history.unshift(historyEntry);
    }
  };

  const updateJobProgress = async (jobId: string, completedQuantity: number) => {
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
        userName: 'Current User',
        action: 'quantity-updated',
        field: 'completedQuantity',
        oldValue: oldQuantity,
        newValue: completedQuantity,
        notes: `Updated completed quantity from ${oldQuantity} to ${completedQuantity}`
      };
      job.history.unshift(historyEntry);
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