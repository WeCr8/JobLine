export interface Job {
  id: string;
  jobNumber: string;
  partNumber: string;
  partName: string;
  customer: string;
  quantity: number;
  completedQuantity: number;
  status: JobStatus;
  priority: Priority;
  dueDate: string;
  startDate?: string;
  estimatedHours: number;
  actualHours: number;
  operator?: string;
  machine?: string;
  operation: string;
  notes: string;
  operations: JobOperation[];
  dncPrograms: DNCProgram[];
  history: JobHistoryEntry[];
  qualityRequirements: QualityRequirement[];
  tooling: ToolingRequirement[];
  materials: MaterialRequirement[];
  drawings: Drawing[];
  createdAt: string;
  updatedAt: string;
}

export interface JobOperation {
  id: string;
  operationNumber: number;
  name: string;
  description: string;
  workCenter: string;
  machine?: string;
  setupTime: number; // minutes
  cycleTime: number; // minutes
  status: OperationStatus;
  completedQuantity: number;
  operator?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  tooling: string[];
  programs: string[];
  qualityChecks: QualityCheck[];
  instructions: string[];
}

export interface DNCProgram {
  id: string;
  programNumber: string;
  name: string;
  description: string;
  filePath: string;
  version: string;
  lastModified: string;
  operationId: string;
  machine: string;
  toolList: Tool[];
  parameters: ProgramParameter[];
  estimatedRunTime: number; // minutes
  status: 'active' | 'archived' | 'development';
}

export interface Tool {
  id: string;
  toolNumber: number;
  description: string;
  type: ToolType;
  diameter?: number;
  length?: number;
  material: string;
  coating?: string;
  vendor: string;
  partNumber: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
}

export interface ProgramParameter {
  name: string;
  value: string | number;
  description: string;
  unit?: string;
}

export interface JobHistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: HistoryAction;
  field?: string;
  oldValue?: any;
  newValue?: any;
  notes?: string;
  operationId?: string;
}

export interface QualityRequirement {
  id: string;
  feature: string;
  specification: string;
  tolerance: string;
  inspectionMethod: string;
  frequency: 'first-piece' | 'in-process' | 'final' | 'statistical';
  operationId?: string;
}

export interface QualityCheck {
  id: string;
  requirementId: string;
  timestamp: string;
  inspector: string;
  result: 'pass' | 'fail' | 'rework';
  actualValue?: string;
  notes?: string;
  images?: string[];
}

export interface ToolingRequirement {
  id: string;
  operationId: string;
  toolId: string;
  quantity: number;
  setup: boolean;
  critical: boolean;
  alternatives?: string[];
}

export interface MaterialRequirement {
  id: string;
  material: string;
  specification: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  certificationRequired: boolean;
  received: boolean;
  location?: string;
}

export interface Drawing {
  id: string;
  name: string;
  revision: string;
  filePath: string;
  type: 'part' | 'assembly' | 'detail' | 'setup';
  lastModified: string;
  operationId?: string;
}

export type JobStatus = 'pending' | 'setup' | 'running' | 'on-hold' | 'completed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type LaborType = 'setup' | 'run' | 'teardown' | 'maintenance' | 'inspection';
export type MachineCondition = 'in-setup' | 'running' | 'idle' | 'maintenance' | 'down';
export type OperationStatus = 'pending' | 'setup' | 'running' | 'completed' | 'on-hold';
export type ToolType = 'end-mill' | 'drill' | 'tap' | 'reamer' | 'face-mill' | 'insert' | 'boring-bar';
export type HistoryAction = 'created' | 'status-changed' | 'operation-started' | 'operation-completed' | 'quantity-updated' | 'notes-added' | 'program-updated' | 'quality-check' | 'rework-required';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: string;
}

export type UserRole = 'operator' | 'lead' | 'supervisor' | 'manager' | 'admin' | 'customer';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  jobReferences?: string[];
}

export interface KPI {
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'maintenance' | 'down';
  currentJob?: string;
  operator?: string;
  condition: MachineCondition;
}

export interface PassdownNote {
  id: string;
  workOrder: string;
  shift: 'day' | 'evening' | 'night';
  date: string;
  operator: string;
  machine: string;
  laborType: LaborType;
  machineCondition: MachineCondition;
  hoursWorked: number;
  partsCompleted: number;
  qualityIssues: string;
  machineIssues: string;
  fiveSChecklist: FiveSChecklist;
  nextShiftNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FiveSChecklist {
  coolantLevel: boolean;
  coolantCondition: 'good' | 'needs-change' | 'low';
  chipBinEmptied: boolean;
  chipBinCondition: 'empty' | 'half-full' | 'full';
  deskCleaned: boolean;
  toolingReturned: boolean;
  toolingCondition: 'good' | 'worn' | 'damaged';
  workAreaOrganized: boolean;
  safetyChecked: boolean;
  notes: string;
}

export type ChartType = 'bar' | 'line' | 'doughnut' | 'pie';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}