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