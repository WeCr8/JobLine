export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export declare const PRIORITIES: Priority[];
export declare function isPriority(value: string): value is Priority;
export declare function getPriorityLabel(priority: Priority): string;
