import type { PartSimilarity, SetupOptimization, ProductionTrend, VoiceNote, MediaUpload, QualityInsight, EngineeringAlert } from '../types/optimization';
export declare const useOptimizationStore: import("pinia").StoreDefinition<"optimization", Pick<{
    partSimilarities: import("vue").Ref<{
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
        groupId?: string | undefined;
    }[], PartSimilarity[] | {
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
        groupId?: string | undefined;
    }[]>;
    setupOptimizations: import("vue").Ref<{
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[], SetupOptimization[] | {
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[]>;
    productionTrends: import("vue").Ref<{
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[], ProductionTrend[] | {
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[]>;
    voiceNotes: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[], VoiceNote[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[]>;
    mediaUploads: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[], MediaUpload[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[]>;
    qualityInsights: import("vue").Ref<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[], QualityInsight[] | {
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    engineeringAlerts: import("vue").Ref<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[], EngineeringAlert[] | {
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    partFamilies: import("vue").ComputedRef<Record<string, PartSimilarity[]>>;
    totalTimeSavings: import("vue").ComputedRef<number>;
    totalCostSavings: import("vue").ComputedRef<number>;
    criticalQualityIssues: import("vue").ComputedRef<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    openEngineeringAlerts: import("vue").ComputedRef<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    fetchPartSimilarities: () => Promise<void>;
    fetchSetupOptimizations: () => Promise<void>;
    fetchProductionTrends: () => Promise<void>;
    fetchQualityInsights: () => Promise<void>;
    fetchEngineeringAlerts: () => Promise<void>;
    analyzePartSimilarity: (partNumber: string) => Promise<PartSimilarity[]>;
    generateSetupOptimization: (jobId: string) => Promise<SetupOptimization>;
    addVoiceNote: (note: Omit<VoiceNote, 'id' | 'createdAt'>) => Promise<void>;
    addMediaUpload: (upload: Omit<MediaUpload, 'id' | 'createdAt'>) => Promise<void>;
    transcribeAudio: () => Promise<string>;
}, "loading" | "partSimilarities" | "setupOptimizations" | "productionTrends" | "voiceNotes" | "mediaUploads" | "qualityInsights" | "engineeringAlerts">, Pick<{
    partSimilarities: import("vue").Ref<{
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
        groupId?: string | undefined;
    }[], PartSimilarity[] | {
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
        groupId?: string | undefined;
    }[]>;
    setupOptimizations: import("vue").Ref<{
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[], SetupOptimization[] | {
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[]>;
    productionTrends: import("vue").Ref<{
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[], ProductionTrend[] | {
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[]>;
    voiceNotes: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[], VoiceNote[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[]>;
    mediaUploads: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[], MediaUpload[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[]>;
    qualityInsights: import("vue").Ref<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[], QualityInsight[] | {
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    engineeringAlerts: import("vue").Ref<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[], EngineeringAlert[] | {
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    partFamilies: import("vue").ComputedRef<Record<string, PartSimilarity[]>>;
    totalTimeSavings: import("vue").ComputedRef<number>;
    totalCostSavings: import("vue").ComputedRef<number>;
    criticalQualityIssues: import("vue").ComputedRef<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    openEngineeringAlerts: import("vue").ComputedRef<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    fetchPartSimilarities: () => Promise<void>;
    fetchSetupOptimizations: () => Promise<void>;
    fetchProductionTrends: () => Promise<void>;
    fetchQualityInsights: () => Promise<void>;
    fetchEngineeringAlerts: () => Promise<void>;
    analyzePartSimilarity: (partNumber: string) => Promise<PartSimilarity[]>;
    generateSetupOptimization: (jobId: string) => Promise<SetupOptimization>;
    addVoiceNote: (note: Omit<VoiceNote, 'id' | 'createdAt'>) => Promise<void>;
    addMediaUpload: (upload: Omit<MediaUpload, 'id' | 'createdAt'>) => Promise<void>;
    transcribeAudio: () => Promise<string>;
}, "partFamilies" | "totalTimeSavings" | "totalCostSavings" | "criticalQualityIssues" | "openEngineeringAlerts">, Pick<{
    partSimilarities: import("vue").Ref<{
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
        groupId?: string | undefined;
    }[], PartSimilarity[] | {
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
        groupId?: string | undefined;
    }[]>;
    setupOptimizations: import("vue").Ref<{
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[], SetupOptimization[] | {
        id: string;
        jobId: string;
        currentSetupTime: number;
        optimizedSetupTime: number;
        timeSavings: number;
        suggestions: {
            type: "machine" | "tooling" | "fixture" | "sequence" | "batching";
            title: string;
            description: string;
            impact: "low" | "medium" | "high";
            timeSavings: number;
            costSavings: number;
            implementation: string;
            relatedParts?: string[] | undefined;
        }[];
        confidence: number;
        implementationDifficulty: "medium" | "easy" | "hard";
        estimatedROI: number;
        createdAt: string;
    }[]>;
    productionTrends: import("vue").Ref<{
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[], ProductionTrend[] | {
        id: string;
        metric: "efficiency" | "quality" | "setup-time" | "cycle-time" | "throughput";
        period: "daily" | "weekly" | "monthly";
        data: {
            date: string;
            value: number;
            target?: number | undefined;
            variance?: number | undefined;
        }[];
        trend: "stable" | "improving" | "declining";
        changePercent: number;
        insights: string[];
    }[]>;
    voiceNotes: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[], VoiceNote[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        audioUrl: string;
        transcription: string;
        confidence: number;
        duration: number;
        type: "quality-issue" | "job-update" | "machine-problem" | "general";
        tags: string[];
        createdAt: string;
    }[]>;
    mediaUploads: import("vue").Ref<{
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[], MediaUpload[] | {
        id: string;
        jobId?: string | undefined;
        userId: string;
        type: "video" | "photo";
        url: string;
        thumbnail?: string | undefined;
        description: string;
        tags: string[];
        metadata: {
            size: number;
            duration?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            location?: {
                lat: number;
                lng: number;
            } | undefined;
        };
        createdAt: string;
    }[]>;
    qualityInsights: import("vue").Ref<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[], QualityInsight[] | {
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    engineeringAlerts: import("vue").Ref<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[], EngineeringAlert[] | {
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    partFamilies: import("vue").ComputedRef<Record<string, PartSimilarity[]>>;
    totalTimeSavings: import("vue").ComputedRef<number>;
    totalCostSavings: import("vue").ComputedRef<number>;
    criticalQualityIssues: import("vue").ComputedRef<{
        id: string;
        partNumber: string;
        issueType: string;
        frequency: number;
        impact: "low" | "medium" | "high";
        rootCause?: string | undefined;
        recommendations: string[];
        trend: "stable" | "increasing" | "decreasing";
        relatedJobs: string[];
    }[]>;
    openEngineeringAlerts: import("vue").ComputedRef<{
        id: string;
        type: "design-change" | "process-improvement" | "tooling-update" | "quality-concern";
        priority: "critical" | "low" | "medium" | "high";
        title: string;
        description: string;
        affectedParts: string[];
        assignedTo?: string | undefined;
        status: "open" | "in-progress" | "resolved" | "closed";
        dueDate?: string | undefined;
        attachments: string[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    fetchPartSimilarities: () => Promise<void>;
    fetchSetupOptimizations: () => Promise<void>;
    fetchProductionTrends: () => Promise<void>;
    fetchQualityInsights: () => Promise<void>;
    fetchEngineeringAlerts: () => Promise<void>;
    analyzePartSimilarity: (partNumber: string) => Promise<PartSimilarity[]>;
    generateSetupOptimization: (jobId: string) => Promise<SetupOptimization>;
    addVoiceNote: (note: Omit<VoiceNote, 'id' | 'createdAt'>) => Promise<void>;
    addMediaUpload: (upload: Omit<MediaUpload, 'id' | 'createdAt'>) => Promise<void>;
    transcribeAudio: () => Promise<string>;
}, "fetchPartSimilarities" | "fetchSetupOptimizations" | "fetchProductionTrends" | "fetchQualityInsights" | "fetchEngineeringAlerts" | "analyzePartSimilarity" | "generateSetupOptimization" | "addVoiceNote" | "addMediaUpload" | "transcribeAudio">>;
