export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
    jobReferences?: string[];
    type: 'text' | 'voice' | 'image' | 'part-lookup';
    audioUrl?: string;
    imageUrl?: string;
    partMatches?: PartMatch[];
    voiceTranscription?: string;
    confidence?: number;
}
export interface VoiceMessage {
    id: string;
    audioUrl: string;
    transcription: string;
    confidence: number;
    duration: number;
    isProcessing: boolean;
}
export interface PartMatch {
    partNumber: string;
    partName: string;
    similarity: number;
    imageUrl?: string;
    currentJobs?: string[];
    lastUsed?: string;
    material?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}
export interface ImageAnalysis {
    detectedParts: PartMatch[];
    confidence: number;
    features: string[];
    suggestedActions: string[];
}
export interface IntegrationConfig {
    id: string;
    type: 'slack' | 'teams' | 'discord' | 'webhook' | 'email';
    name: string;
    enabled: boolean;
    config: {
        webhookUrl?: string;
        channelId?: string;
        botToken?: string;
        tenantId?: string;
        clientId?: string;
        emailRecipients?: string[];
    };
    triggers: IntegrationTrigger[];
    createdAt: string;
    updatedAt: string;
}
export interface IntegrationTrigger {
    event: 'job-status-change' | 'urgent-job' | 'quality-issue' | 'machine-down' | 'chat-mention';
    conditions?: {
        priority?: string[];
        status?: string[];
        keywords?: string[];
    };
    message: string;
    enabled: boolean;
}
export interface ChatIntegration {
    platform: string;
    channelName: string;
    lastSync: string;
    messageCount: number;
    status: 'active' | 'error' | 'disabled';
}
