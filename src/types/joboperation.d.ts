import type { QualityCheck } from './qualityrequirement';
export interface JobOperation {
    id: string;
    operationNumber: number;
    name: string;
    description: string;
    workCenter: string;
    machine?: string;
    setupTime: number;
    cycleTime: number;
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
export type OperationStatus = 'pending' | 'setup' | 'running' | 'completed' | 'on-hold';
