import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  ManufacturingDepartment, 
  Machine, 
  WorkCenter, 
  Process,
  Capability,
  QualityStandard,
  DigitalTwinCompliance,
  ToolDataIntegrity,
  MaterialInventory,
  PurchaseOrder,
  ShippingReceiving,
  ProgrammingTask
} from '../types/manufacturing';

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

  // Enhanced mock data with all manufacturing departments
  const mockDepartments: ManufacturingDepartment[] = [
    // Production Departments
    {
      id: 'cnc-machining',
      name: 'CNC Machining',
      description: 'Computer-controlled precision machining operations',
      supervisor: 'John Martinez',
      shift: 'all-shifts',
      capabilities: ['milling', 'turning', 'drilling', 'boring', 'threading', 'grinding'],
      qualityStandards: ['ISO 9001', 'AS9100', 'ITAR'],
      machines: ['CNC-001', 'CNC-002', 'CNC-003', 'CNC-004', 'CNC-005', 'CNC-006'],
      operators: ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Chen', 'David Rodriguez', 'Amy Foster'],
      activeJobs: 12,
      efficiency: 87,
      utilizationRate: 92,
      kpis: [
        { name: 'First Pass Yield', value: 94, target: 95, unit: '%', trend: 'up' },
        { name: 'Setup Time', value: 32, target: 30, unit: 'min', trend: 'down' },
        { name: 'Cycle Time Variance', value: 3.2, target: 5.0, unit: '%', trend: 'stable' }
      ],
      integrations: ['ERP', 'DNC', 'CMM']
    },
    {
      id: 'sheet-metal',
      name: 'Sheet Metal Fabrication',
      description: 'Cutting, forming, and welding of sheet metal components',
      supervisor: 'Maria Rodriguez',
      shift: 'day',
      capabilities: ['laser-cutting', 'plasma-cutting', 'waterjet', 'forming', 'welding', 'punching'],
      qualityStandards: ['ISO 9001', 'AWS D1.1'],
      machines: ['LASER-001', 'LASER-002', 'PLASMA-001', 'WATERJET-001', 'PRESS-001', 'PRESS-002'],
      operators: ['Carlos Mendez', 'Jennifer Park', 'David Kim', 'Amanda Foster', 'Roberto Silva'],
      activeJobs: 18,
      efficiency: 91,
      utilizationRate: 88,
      kpis: [
        { name: 'Cut Quality', value: 98, target: 97, unit: '%', trend: 'up' },
        { name: 'Material Utilization', value: 89, target: 85, unit: '%', trend: 'up' },
        { name: 'Edge Quality', value: 96, target: 95, unit: '%', trend: 'stable' }
      ],
      integrations: ['Nesting Software', 'Material Management']
    },
    {
      id: 'welding',
      name: 'Welding & Assembly',
      description: 'Structural welding, assembly, and fabrication operations',
      supervisor: 'Robert Thompson',
      shift: 'day',
      capabilities: ['mig-welding', 'tig-welding', 'stick-welding', 'robotic-welding', 'assembly'],
      qualityStandards: ['AWS D1.1', 'AWS D1.3', 'ASME IX'],
      machines: ['WELD-001', 'WELD-002', 'ROBOT-WELD-001', 'ASSEMBLY-001', 'ASSEMBLY-002'],
      operators: ['Tony Garcia', 'Rachel Adams', 'Kevin Brown', 'Nicole Taylor', 'James Wilson'],
      activeJobs: 8,
      efficiency: 85,
      utilizationRate: 79,
      kpis: [
        { name: 'Weld Quality', value: 97, target: 95, unit: '%', trend: 'up' },
        { name: 'Rework Rate', value: 2.1, target: 3.0, unit: '%', trend: 'down' },
        { name: 'Certification Rate', value: 100, target: 100, unit: '%', trend: 'stable' }
      ],
      integrations: ['Welding Management', 'NDT Systems']
    },
    {
      id: 'additive',
      name: 'Additive Manufacturing',
      description: '3D printing and rapid prototyping operations',
      supervisor: 'Dr. Emily Chen',
      shift: 'all-shifts',
      capabilities: ['fdm-printing', 'sla-printing', 'sls-printing', 'metal-printing', 'post-processing'],
      qualityStandards: ['ISO 17296', 'ASTM F2792'],
      machines: ['3D-001', '3D-002', 'METAL-3D-001', 'SLA-001', 'SLS-001'],
      operators: ['Alex Rivera', 'Samantha Lee', 'Jordan Mitchell', 'Taylor Kim'],
      activeJobs: 25,
      efficiency: 94,
      utilizationRate: 76,
      kpis: [
        { name: 'Print Success Rate', value: 92, target: 90, unit: '%', trend: 'up' },
        { name: 'Material Waste', value: 8, target: 10, unit: '%', trend: 'down' },
        { name: 'Post-Process Time', value: 45, target: 60, unit: 'min', trend: 'down' }
      ],
      integrations: ['CAD Systems', 'Material Tracking']
    },

    // Support Departments
    {
      id: 'purchasing',
      name: 'Purchasing & Procurement',
      description: 'Strategic sourcing, vendor management, and procurement operations',
      supervisor: 'Linda Chang',
      shift: 'day',
      capabilities: ['strategic-sourcing', 'vendor-management', 'contract-negotiation', 'cost-analysis'],
      qualityStandards: ['ISO 9001', 'Supplier Quality Standards'],
      machines: [],
      operators: ['Michael Chen', 'Sarah Williams', 'David Park', 'Lisa Rodriguez'],
      activeJobs: 45,
      efficiency: 96,
      utilizationRate: 85,
      kpis: [
        { name: 'On-Time Delivery', value: 94, target: 95, unit: '%', trend: 'stable' },
        { name: 'Cost Savings', value: 12, target: 10, unit: '%', trend: 'up' },
        { name: 'Supplier Quality', value: 97, target: 95, unit: '%', trend: 'up' },
        { name: 'PO Cycle Time', value: 2.1, target: 3.0, unit: 'days', trend: 'down' }
      ],
      integrations: ['ERP', 'Supplier Portal', 'Contract Management']
    },
    {
      id: 'shipping-receiving',
      name: 'Shipping & Receiving',
      description: 'Inbound and outbound logistics, inventory receiving, and shipping operations',
      supervisor: 'Mark Johnson',
      shift: 'day',
      capabilities: ['receiving', 'shipping', 'packaging', 'logistics', 'inventory-tracking'],
      qualityStandards: ['ISO 9001', 'Shipping Standards'],
      machines: ['FORKLIFT-001', 'FORKLIFT-002', 'CRANE-001', 'SCALE-001', 'SCANNER-001'],
      operators: ['Carlos Martinez', 'Jennifer Lee', 'Robert Kim', 'Amanda Davis', 'Jose Rodriguez'],
      activeJobs: 32,
      efficiency: 89,
      utilizationRate: 91,
      kpis: [
        { name: 'Receiving Accuracy', value: 99.2, target: 99.0, unit: '%', trend: 'up' },
        { name: 'Shipping Accuracy', value: 99.8, target: 99.5, unit: '%', trend: 'stable' },
        { name: 'Dock Utilization', value: 87, target: 85, unit: '%', trend: 'up' },
        { name: 'Damage Rate', value: 0.3, target: 0.5, unit: '%', trend: 'down' }
      ],
      integrations: ['WMS', 'TMS', 'ERP', 'Carrier Systems']
    },
    {
      id: 'material-stores',
      name: 'Material Stores & Inventory',
      description: 'Raw material management, tool crib, and inventory control',
      supervisor: 'Patricia Williams',
      shift: 'all-shifts',
      capabilities: ['inventory-management', 'material-handling', 'tool-management', 'kitting'],
      qualityStandards: ['ISO 9001', 'Material Traceability'],
      machines: ['CAROUSEL-001', 'CAROUSEL-002', 'SCANNER-002', 'SCALE-002'],
      operators: ['Thomas Anderson', 'Maria Gonzalez', 'Kevin Lee', 'Sandra Kim', 'Daniel Rodriguez'],
      activeJobs: 28,
      efficiency: 93,
      utilizationRate: 88,
      kpis: [
        { name: 'Inventory Accuracy', value: 99.5, target: 99.0, unit: '%', trend: 'up' },
        { name: 'Stock Turnover', value: 8.2, target: 8.0, unit: 'turns/year', trend: 'up' },
        { name: 'Pick Accuracy', value: 99.8, target: 99.5, unit: '%', trend: 'stable' },
        { name: 'Cycle Count Variance', value: 0.2, target: 0.5, unit: '%', trend: 'down' }
      ],
      integrations: ['ERP', 'WMS', 'Barcode Systems']
    },
    {
      id: 'tdit',
      name: 'Tool Data Integrity Team (TDIT)',
      description: 'Tool data verification, digital twin validation, and cutting tool management',
      supervisor: 'Dr. James Wilson',
      shift: 'day',
      capabilities: ['tool-verification', 'data-validation', 'digital-twin-sync', 'tool-optimization'],
      qualityStandards: ['ISO 9001', 'Digital Twin Standards', 'Tool Management Standards'],
      machines: ['TOOL-PRESETTER-001', 'TOOL-PRESETTER-002', 'LASER-SCANNER-001', 'CMM-TOOL-001'],
      operators: ['Dr. Sarah Chen', 'Michael Torres', 'Jennifer Wang', 'David Martinez'],
      activeJobs: 15,
      efficiency: 97,
      utilizationRate: 82,
      kpis: [
        { name: 'Tool Data Accuracy', value: 99.8, target: 99.5, unit: '%', trend: 'up' },
        { name: 'Digital Twin Sync', value: 98.5, target: 98.0, unit: '%', trend: 'up' },
        { name: 'Tool Life Optimization', value: 15, target: 10, unit: '% improvement', trend: 'up' },
        { name: 'Verification Cycle Time', value: 12, target: 15, unit: 'min', trend: 'down' }
      ],
      integrations: ['Tool Management', 'CAM Systems', 'Digital Twin Platform']
    },
    {
      id: 'digital-twin-compliance',
      name: 'Digital Twin Compliance Team',
      description: 'Digital twin validation, model-to-part compliance, and virtual manufacturing',
      supervisor: 'Dr. Rachel Kim',
      shift: 'day',
      capabilities: ['digital-twin-validation', 'model-compliance', 'virtual-manufacturing', 'simulation'],
      qualityStandards: ['Digital Twin Standards', 'Model-Based Definition', 'ISO 23247'],
      machines: ['WORKSTATION-001', 'WORKSTATION-002', 'SCANNER-3D-001', 'VR-SYSTEM-001'],
      operators: ['Dr. Alex Chen', 'Priya Patel', 'Marcus Johnson', 'Elena Rodriguez'],
      activeJobs: 22,
      efficiency: 95,
      utilizationRate: 78,
      kpis: [
        { name: 'Model Accuracy', value: 99.2, target: 99.0, unit: '%', trend: 'up' },
        { name: 'Compliance Rate', value: 97.8, target: 97.0, unit: '%', trend: 'up' },
        { name: 'Validation Time', value: 45, target: 60, unit: 'min', trend: 'down' },
        { name: 'Deviation Resolution', value: 24, target: 48, unit: 'hours', trend: 'down' }
      ],
      integrations: ['CAD Systems', 'PLM', 'Digital Twin Platform', 'Simulation Software']
    },
    {
      id: 'programming',
      name: 'CNC Programming',
      description: 'CNC program development, optimization, and validation',
      supervisor: 'Steven Rodriguez',
      shift: 'day',
      capabilities: ['cnc-programming', 'cam-programming', 'program-optimization', 'simulation'],
      qualityStandards: ['Programming Standards', 'ISO 6983', 'Safety Standards'],
      machines: ['CAM-STATION-001', 'CAM-STATION-002', 'CAM-STATION-003', 'SIMULATOR-001'],
      operators: ['Brian Chen', 'Michelle Park', 'Carlos Torres', 'Amanda Wilson', 'Jason Kim'],
      activeJobs: 35,
      efficiency: 92,
      utilizationRate: 89,
      kpis: [
        { name: 'Program Accuracy', value: 98.5, target: 98.0, unit: '%', trend: 'up' },
        { name: 'Programming Time', value: 4.2, target: 5.0, unit: 'hours/program', trend: 'down' },
        { name: 'First Article Success', value: 94, target: 90, unit: '%', trend: 'up' },
        { name: 'Cycle Time Optimization', value: 12, target: 8, unit: '% improvement', trend: 'up' }
      ],
      integrations: ['CAM Software', 'DNC Systems', 'Simulation Software', 'Tool Management']
    },
    {
      id: 'quality',
      name: 'Quality Control & Assurance',
      description: 'Inspection, testing, quality assurance, and metrology',
      supervisor: 'Patricia Williams',
      shift: 'all-shifts',
      capabilities: ['cmm-inspection', 'surface-testing', 'material-testing', 'ndt', 'calibration'],
      qualityStandards: ['ISO 9001', 'AS9100', 'ISO 17025', 'NADCAP'],
      machines: ['CMM-001', 'CMM-002', 'SURFACE-001', 'HARDNESS-001', 'NDT-001'],
      operators: ['Michael Davis', 'Laura Johnson', 'Steven Clark', 'Diana Martinez', 'Robert Lee'],
      activeJobs: 42,
      efficiency: 96,
      utilizationRate: 85,
      kpis: [
        { name: 'Inspection Accuracy', value: 99.8, target: 99.5, unit: '%', trend: 'stable' },
        { name: 'First Pass Yield', value: 96, target: 95, unit: '%', trend: 'up' },
        { name: 'Calibration Compliance', value: 100, target: 100, unit: '%', trend: 'stable' },
        { name: 'Inspection Cycle Time', value: 25, target: 30, unit: 'min', trend: 'down' }
      ],
      integrations: ['QMS', 'CMM Software', 'Calibration Management', 'SPC Systems']
    },
    {
      id: 'assembly',
      name: 'Final Assembly & Test',
      description: 'Product assembly, testing, packaging, and final inspection',
      supervisor: 'James Anderson',
      shift: 'day',
      capabilities: ['mechanical-assembly', 'electrical-assembly', 'testing', 'packaging'],
      qualityStandards: ['ISO 9001', 'IPC-A-610', 'Assembly Standards'],
      machines: ['ASSEMBLY-001', 'ASSEMBLY-002', 'TEST-001', 'PACK-001', 'TORQUE-001'],
      operators: ['Christine Moore', 'Daniel White', 'Ashley Martinez', 'Ryan Thomas', 'Nicole Garcia'],
      activeJobs: 28,
      efficiency: 89,
      utilizationRate: 91,
      kpis: [
        { name: 'Assembly Quality', value: 98.2, target: 98.0, unit: '%', trend: 'up' },
        { name: 'Test Pass Rate', value: 96.5, target: 95.0, unit: '%', trend: 'up' },
        { name: 'Packaging Accuracy', value: 99.9, target: 99.5, unit: '%', trend: 'stable' },
        { name: 'Cycle Time', value: 45, target: 50, unit: 'min', trend: 'down' }
      ],
      integrations: ['Assembly Instructions', 'Test Equipment', 'Packaging Systems']
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Facilities',
      description: 'Preventive maintenance, repairs, and facility management',
      supervisor: 'Robert Martinez',
      shift: 'all-shifts',
      capabilities: ['preventive-maintenance', 'repairs', 'calibration', 'facility-management'],
      qualityStandards: ['Maintenance Standards', 'Safety Standards', 'Environmental Standards'],
      machines: ['MAINT-CART-001', 'MAINT-CART-002', 'CRANE-MAINT-001', 'TOOLS-MAINT'],
      operators: ['Frank Wilson', 'Maria Santos', 'John Kim', 'Lisa Chen', 'Carlos Rodriguez'],
      activeJobs: 18,
      efficiency: 91,
      utilizationRate: 76,
      kpis: [
        { name: 'Planned Maintenance', value: 92, target: 90, unit: '%', trend: 'up' },
        { name: 'MTBF', value: 720, target: 600, unit: 'hours', trend: 'up' },
        { name: 'Response Time', value: 15, target: 20, unit: 'min', trend: 'down' },
        { name: 'Equipment Uptime', value: 96.5, target: 95.0, unit: '%', trend: 'up' }
      ],
      integrations: ['CMMS', 'IoT Sensors', 'Calibration Management']
    },
    {
      id: 'planning',
      name: 'Production Planning & Control',
      description: 'Production scheduling, capacity planning, and workflow optimization',
      supervisor: 'Jennifer Chang',
      shift: 'day',
      capabilities: ['production-scheduling', 'capacity-planning', 'workflow-optimization', 'resource-allocation'],
      qualityStandards: ['Planning Standards', 'Lean Manufacturing', 'Six Sigma'],
      machines: ['PLANNING-STATION-001', 'PLANNING-STATION-002'],
      operators: ['David Chen', 'Sarah Kim', 'Michael Rodriguez', 'Lisa Park'],
      activeJobs: 65,
      efficiency: 94,
      utilizationRate: 87,
      kpis: [
        { name: 'Schedule Adherence', value: 92, target: 90, unit: '%', trend: 'up' },
        { name: 'Capacity Utilization', value: 89, target: 85, unit: '%', trend: 'up' },
        { name: 'Lead Time', value: 8.5, target: 10.0, unit: 'days', trend: 'down' },
        { name: 'WIP Turns', value: 12, target: 10, unit: 'turns/year', trend: 'up' }
      ],
      integrations: ['ERP', 'MES', 'Scheduling Software', 'Capacity Planning Tools']
    }
  ];

  const mockMachines: Machine[] = [
    // CNC Machines
    {
      id: 'CNC-001',
      name: 'Haas VF-4SS',
      type: 'CNC Vertical Machining Center',
      department: 'cnc-machining',
      status: 'running',
      capabilities: ['milling', 'drilling', 'tapping'],
      specifications: {
        workEnvelope: '50" x 20" x 25"',
        spindle: '15,000 RPM',
        toolChanger: '24 Position ATC',
        accuracy: '±0.0002"',
        repeatability: '±0.0001"'
      },
      currentJob: 'J2024-001',
      operator: 'John Smith',
      condition: 'running',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      utilizationRate: 92,
      efficiency: 87,
      location: 'Bay A-1',
      serialNumber: 'VF4SS-2019-001',
      manufacturer: 'Haas Automation',
      model: 'VF-4SS',
      yearInstalled: 2019
    },
    {
      id: 'CNC-002',
      name: 'Mazak Integrex i-400',
      type: 'CNC Turn-Mill Center',
      department: 'cnc-machining',
      status: 'running',
      capabilities: ['turning', 'milling', 'drilling'],
      specifications: {
        maxDiameter: '15.75"',
        maxLength: '31.5"',
        spindle: '5,000 RPM',
        toolChanger: '40 Position ATC',
        subSpindle: 'Yes'
      },
      currentJob: 'J2024-002',
      operator: 'Sarah Johnson',
      condition: 'in-setup',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-02-08',
      utilizationRate: 88,
      efficiency: 91,
      location: 'Bay A-2',
      serialNumber: 'INT400-2020-002',
      manufacturer: 'Mazak',
      model: 'Integrex i-400',
      yearInstalled: 2020
    },

    // Sheet Metal Equipment
    {
      id: 'LASER-001',
      name: 'Trumpf TruLaser 3030',
      type: 'Fiber Laser Cutting System',
      department: 'sheet-metal',
      status: 'running',
      capabilities: ['laser-cutting', 'piercing', 'marking'],
      specifications: {
        laserPower: '4000W',
        workArea: '60" x 120"',
        maxThickness: '1" Steel, 0.5" Aluminum',
        accuracy: '±0.002"',
        cuttingSpeed: '2000 IPM'
      },
      currentJob: 'J2024-015',
      operator: 'Carlos Mendez',
      condition: 'running',
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-12',
      utilizationRate: 94,
      efficiency: 96,
      location: 'Bay B-1',
      serialNumber: 'TL3030-2021-001',
      manufacturer: 'Trumpf',
      model: 'TruLaser 3030',
      yearInstalled: 2021
    },

    // Material Handling Equipment
    {
      id: 'FORKLIFT-001',
      name: 'Toyota 8FGU25',
      type: 'Propane Forklift',
      department: 'shipping-receiving',
      status: 'running',
      capabilities: ['material-handling', 'loading', 'unloading'],
      specifications: {
        capacity: '5000 lbs',
        liftHeight: '189"',
        fuelType: 'Propane',
        tireType: 'Pneumatic'
      },
      operator: 'Carlos Martinez',
      condition: 'running',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      utilizationRate: 78,
      efficiency: 85,
      location: 'Dock Area',
      serialNumber: 'TOY-8FGU-001',
      manufacturer: 'Toyota',
      model: '8FGU25',
      yearInstalled: 2018
    },

    // Tool Management Equipment
    {
      id: 'TOOL-PRESETTER-001',
      name: 'Zoller Genius 3',
      type: 'Tool Presetter',
      department: 'tdit',
      status: 'running',
      capabilities: ['tool-measurement', 'tool-verification', 'data-collection'],
      specifications: {
        accuracy: '±0.0001"',
        repeatability: '±0.00005"',
        maxToolDiameter: '8"',
        maxToolLength: '12"',
        camera: 'High Resolution CCD'
      },
      operator: 'Dr. Sarah Chen',
      condition: 'running',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-03-15',
      utilizationRate: 65,
      efficiency: 98,
      location: 'Tool Room',
      serialNumber: 'ZOL-G3-001',
      manufacturer: 'Zoller',
      model: 'Genius 3',
      yearInstalled: 2022
    },

    // 3D Printing Equipment
    {
      id: 'METAL-3D-001',
      name: 'EOS M 290',
      type: 'Metal 3D Printer (DMLS)',
      department: 'additive',
      status: 'running',
      capabilities: ['metal-printing', 'post-processing'],
      specifications: {
        buildVolume: '250 x 250 x 325mm',
        laserPower: '400W',
        layerThickness: '20-100μm',
        materials: 'Ti64, 316L, AlSi10Mg, Inconel 718',
        inertGas: 'Argon'
      },
      currentJob: 'J2024-025',
      operator: 'Alex Rivera',
      condition: 'running',
      lastMaintenance: '2024-01-11',
      nextMaintenance: '2024-02-11',
      utilizationRate: 78,
      efficiency: 94,
      location: 'Additive Lab',
      serialNumber: 'EOS-M290-001',
      manufacturer: 'EOS',
      model: 'M 290',
      yearInstalled: 2023
    },

    // Quality Equipment
    {
      id: 'CMM-001',
      name: 'Zeiss Contura G2',
      type: 'Coordinate Measuring Machine',
      department: 'quality',
      status: 'running',
      capabilities: ['cmm-inspection', 'reverse-engineering'],
      specifications: {
        measuringRange: '700 x 1000 x 600mm',
        accuracy: '1.5 + L/300 μm',
        probeSystem: 'VAST XXT',
        software: 'Calypso',
        temperature: '20°C ± 1°C'
      },
      currentJob: 'INSPECTION-001',
      operator: 'Michael Davis',
      condition: 'running',
      lastMaintenance: '2024-01-07',
      nextMaintenance: '2024-02-07',
      utilizationRate: 89,
      efficiency: 97,
      location: 'Quality Lab',
      serialNumber: 'ZEI-CG2-001',
      manufacturer: 'Zeiss',
      model: 'Contura G2',
      yearInstalled: 2020
    }
  ];

  const mockWorkCenters: WorkCenter[] = [
    {
      id: 'WC-001',
      name: 'CNC Milling Center',
      department: 'cnc-machining',
      machines: ['CNC-001', 'CNC-003', 'CNC-005'],
      capabilities: ['milling', 'drilling', 'tapping'],
      capacity: 24, // hours per day (3 shifts)
      currentLoad: 21,
      efficiency: 89,
      setupTime: 45,
      cycleTime: 25,
      location: 'Bay A',
      supervisor: 'John Martinez'
    },
    {
      id: 'WC-002',
      name: 'CNC Turning Center',
      department: 'cnc-machining',
      machines: ['CNC-002', 'CNC-004', 'CNC-006'],
      capabilities: ['turning', 'boring', 'threading'],
      capacity: 24,
      currentLoad: 19,
      efficiency: 91,
      setupTime: 30,
      cycleTime: 18,
      location: 'Bay A',
      supervisor: 'John Martinez'
    },
    {
      id: 'WC-003',
      name: 'Laser Cutting Center',
      department: 'sheet-metal',
      machines: ['LASER-001', 'LASER-002'],
      capabilities: ['laser-cutting', 'marking'],
      capacity: 16,
      currentLoad: 15,
      efficiency: 96,
      setupTime: 15,
      cycleTime: 8,
      location: 'Bay B',
      supervisor: 'Maria Rodriguez'
    },
    {
      id: 'WC-004',
      name: 'Tool Verification Center',
      department: 'tdit',
      machines: ['TOOL-PRESETTER-001', 'TOOL-PRESETTER-002'],
      capabilities: ['tool-verification', 'data-validation'],
      capacity: 8,
      currentLoad: 5.5,
      efficiency: 98,
      setupTime: 5,
      cycleTime: 12,
      location: 'Tool Room',
      supervisor: 'Dr. James Wilson'
    },
    {
      id: 'WC-005',
      name: 'Receiving Dock',
      department: 'shipping-receiving',
      machines: ['FORKLIFT-001', 'FORKLIFT-002', 'CRANE-001'],
      capabilities: ['receiving', 'material-handling'],
      capacity: 8,
      currentLoad: 7.2,
      efficiency: 89,
      setupTime: 10,
      cycleTime: 30,
      location: 'Dock Area',
      supervisor: 'Mark Johnson'
    }
  ];

  const fetchDepartments = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    departments.value = mockDepartments;
    loading.value = false;
  };

  const fetchMachines = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 600));
    machines.value = mockMachines;
    loading.value = false;
  };

  const fetchWorkCenters = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    workCenters.value = mockWorkCenters;
    loading.value = false;
  };

  const fetchProcesses = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock processes would be populated here
    loading.value = false;
  };

  const fetchCapabilities = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock capabilities would be populated here
    loading.value = false;
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