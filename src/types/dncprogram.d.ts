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
    estimatedRunTime: number;
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
export type ToolType = 'end-mill' | 'drill' | 'tap' | 'reamer' | 'face-mill' | 'insert' | 'boring-bar';
