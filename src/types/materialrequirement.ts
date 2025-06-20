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