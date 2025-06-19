export interface PartSimilarity {
  id: string;
  partNumber: string;
  partName: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  machineType: string;
  fixtureType: string;
  setupTime: number;
  cycleTime: number;
  tooling: string[];
  operations: string[];
  similarityScore: number;
  groupId?: string;
}

export interface SetupOptimization {
  id: string;
  jobId: string;
  currentSetupTime: number;
  optimizedSetupTime: number;
  timeSavings: number;
  suggestions: OptimizationSuggestion[];
  confidence: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  estimatedROI: number;
  createdAt: string;
}

export interface OptimizationSuggestion {
  type: 'fixture' | 'tooling' | 'sequence' | 'batching' | 'machine';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  timeSavings: number;
  costSavings: number;
  implementation: string;
  relatedParts?: string[];
}

export interface ProductionTrend {
  id: string;
  metric: 'efficiency' | 'quality' | 'setup-time' | 'cycle-time' | 'throughput';
  period: 'daily' | 'weekly' | 'monthly';
  data: TrendDataPoint[];
  trend: 'improving' | 'declining' | 'stable';
  changePercent: number;
  insights: string[];
}

export interface TrendDataPoint {
  date: string;
  value: number;
  target?: number;
  variance?: number;
}

export interface VoiceNote {
  id: string;
  jobId?: string;
  userId: string;
  audioUrl: string;
  transcription: string;
  confidence: number;
  duration: number;
  type: 'job-update' | 'quality-issue' | 'machine-problem' | 'general';
  tags: string[];
  createdAt: string;
}

export interface MediaUpload {
  id: string;
  jobId?: string;
  userId: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  metadata: {
    size: number;
    duration?: number;
    dimensions?: { width: number; height: number };
    location?: { lat: number; lng: number };
  };
  createdAt: string;
}

export interface QualityInsight {
  id: string;
  partNumber: string;
  issueType: string;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  rootCause?: string;
  recommendations: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
  relatedJobs: string[];
}

export interface EngineeringAlert {
  id: string;
  type: 'design-change' | 'process-improvement' | 'tooling-update' | 'quality-concern';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedParts: string[];
  assignedTo?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  dueDate?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentRole {
  department: 'production' | 'quality' | 'engineering' | 'maintenance' | 'planning';
  permissions: string[];
  dataAccess: string[];
  quickActions: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  department: string[];
  requiresConfirmation?: boolean;
  voiceEnabled?: boolean;
}