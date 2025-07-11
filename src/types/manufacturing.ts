export interface ManufacturingDepartment {
  id: string;
  name: string;
  description: string;
  supervisor: string;
  shift: 'day' | 'evening' | 'night' | 'all-shifts';
  capabilities: string[];
  qualityStandards: string[];
  machines: string[];
  operators: string[];
  activeJobs: number;
  efficiency: number;
  utilizationRate: number;
  kpis: DepartmentKPI[];
  integrations: string[];
}

export interface DepartmentKPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  department: string;
  status: 'running' | 'idle' | 'maintenance' | 'down';
  capabilities: string[];
  specifications: Record<string, string>;
  currentJob?: string;
  operator?: string;
  condition: MachineCondition;
  lastMaintenance: string;
  nextMaintenance: string;
  utilizationRate: number;
  efficiency: number;
  location?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  yearInstalled?: number;
}

export interface WorkCenter {
  id: string;
  name: string;
  department: string;
  machines: string[];
  capabilities: string[];
  capacity: number; // hours per day
  currentLoad: number;
  efficiency: number;
  setupTime: number; // minutes average
  cycleTime: number; // minutes average
  location: string;
  supervisor: string;
}

export interface Process {
  id: string;
  name: string;
  department: string;
  description: string;
  steps: ProcessStep[];
  standardTime: number; // minutes
  qualityChecks: string[];
  tooling: string[];
  materials: string[];
  skillRequirements: string[];
  safetyRequirements: string[];
}

export interface ProcessStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  duration: number;
  resources: string[];
  qualityChecks: string[];
  safetyNotes: string[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  departments: string[];
  tolerance: string;
  materials: string[];
  maxSize?: string;
  minFeature?: string;
  surfaceFinish?: string;
  processes?: string[];
  certifications?: string[];
  qualityStandards?: string[];
  equipment?: string[];
  services?: string[];
  layerHeight?: string;
  postProcessing?: string[];
  leadTime?: string;
  capacity?: string;
}

export interface QualityStandard {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  applicableDepartments: string[];
  certificationBody: string;
  validUntil?: string;
}

export interface DigitalTwinCompliance {
  id: string;
  partNumber: string;
  digitalTwinVersion: string;
  physicalPartVersion: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'under-review';
  lastValidation: string;
  deviations: ComplianceDeviation[];
  approvedBy?: string;
  notes?: string;
}

export interface ComplianceDeviation {
  id: string;
  type: 'dimensional' | 'material' | 'process' | 'documentation';
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'approved' | 'rejected';
  justification?: string;
}

export interface ToolDataIntegrity {
  id: string;
  toolId: string;
  toolNumber: string;
  description: string;
  digitalData: ToolDigitalData;
  physicalVerification: ToolPhysicalData;
  complianceStatus: 'verified' | 'discrepancy' | 'pending';
  lastVerification: string;
  verifiedBy: string;
  discrepancies: string[];
}

export interface ToolDigitalData {
  diameter: number;
  length: number;
  material: string;
  coating?: string;
  geometry: string;
  speeds: number[];
  feeds: number[];
  applications: string[];
}

export interface ToolPhysicalData {
  measuredDiameter: number;
  measuredLength: number;
  condition: 'new' | 'good' | 'worn' | 'damaged';
  wearMeasurements: WearMeasurement[];
  lastInspection: string;
  inspector: string;
}

export interface WearMeasurement {
  location: string;
  measurement: number;
  tolerance: number;
  status: 'within-spec' | 'approaching-limit' | 'out-of-spec';
}

export interface MaterialInventory {
  id: string;
  materialCode: string;
  description: string;
  specification: string;
  currentStock: number;
  unit: string;
  location: string;
  bin: string;
  reorderPoint: number;
  maxStock: number;
  cost: number;
  supplier: string;
  lastReceived: string;
  expirationDate?: string;
  certifications: string[];
  heatNumber?: string;
  lotNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  status: 'draft' | 'sent' | 'acknowledged' | 'partial' | 'complete' | 'cancelled';
  orderDate: string;
  requestedDate: string;
  promisedDate?: string;
  items: PurchaseOrderItem[];
  totalValue: number;
  buyer: string;
  approvedBy?: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  requestedDate: string;
  promisedDate?: string;
  receivedQuantity: number;
  status: 'pending' | 'partial' | 'complete' | 'cancelled';
}

export interface ShippingReceiving {
  id: string;
  type: 'receiving' | 'shipping';
  documentNumber: string;
  supplier?: string;
  customer?: string;
  status: 'scheduled' | 'in-progress' | 'complete' | 'exception';
  scheduledDate: string;
  actualDate?: string;
  items: ShippingItem[];
  carrier?: string;
  trackingNumber?: string;
  dock: string;
  handler: string;
  notes?: string;
}

export interface ShippingItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  condition: 'good' | 'damaged' | 'discrepancy';
  location?: string;
  serialNumbers?: string[];
  notes?: string;
}

export interface ProgrammingTask {
  id: string;
  jobId: string;
  partNumber: string;
  operation: string;
  machine: string;
  programmer: string;
  status: 'assigned' | 'in-progress' | 'review' | 'approved' | 'released';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  programs: ProgramFile[];
  toolList: ToolRequirement[];
  fixtures: FixtureRequirement[];
  notes?: string;
}

export interface ProgramFile {
  id: string;
  fileName: string;
  version: string;
  filePath: string;
  fileSize: number;
  lastModified: string;
  modifiedBy: string;
  status: 'draft' | 'review' | 'approved' | 'released' | 'archived';
  checksum: string;
}

export interface ToolRequirement {
  toolNumber: number;
  description: string;
  type: string;
  diameter: number;
  length: number;
  material: string;
  coating?: string;
  vendor: string;
  partNumber: string;
  quantity: number;
  critical: boolean;
  alternatives?: string[];
}

export interface FixtureRequirement {
  id: string;
  name: string;
  type: 'vise' | 'custom' | 'modular' | 'pneumatic' | 'hydraulic';
  description: string;
  location: string;
  available: boolean;
  setupTime: number;
  notes?: string;
}

export type MachineCondition = 'in-setup' | 'running' | 'idle' | 'maintenance' | 'down';

// Manufacturing domain models for AI expeditor

export type OperationStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'skipped'
export type ResourceType = 'machine' | 'workcenter' | 'person' | 'tool'
export type ConstraintType = 'material' | 'resource' | 'skill' | 'custom'

export interface Part {
  id: string
  name: string
  description?: string
  partNumber?: string
  revision?: string
  jobId?: string
  quantity: number
  unit?: string
  location?: string
  customFields?: Record<string, any>
}

export interface Operation {
  id: string
  jobId: string
  partId?: string
  name: string
  description?: string
  status: OperationStatus
  sequence: number
  resourceId?: string
  plannedStart?: string // ISO date
  plannedEnd?: string // ISO date
  actualStart?: string // ISO date
  actualEnd?: string // ISO date
  durationMinutes?: number
  customFields?: Record<string, any>
}

export interface Resource {
  id: string
  name: string
  type: ResourceType
  available: boolean
  capacity?: Capacity
  skills?: string[]
  customFields?: Record<string, any>
}

export interface Capacity {
  resourceId: string
  date: string // ISO date
  availableMinutes: number
  usedMinutes: number
  customFields?: Record<string, any>
}

export interface Constraint {
  id: string
  type: ConstraintType
  description?: string
  affectedJobIds?: string[]
  affectedPartIds?: string[]
  affectedResourceIds?: string[]
  startDate?: string // ISO date
  endDate?: string // ISO date
  customFields?: Record<string, any>
}