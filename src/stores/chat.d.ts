import type { ChatMessage, PartMatch, IntegrationConfig } from '../types/chat';
export declare const useChatStore: import("pinia").StoreDefinition<"chat", Pick<{
    messages: import("vue").Ref<{
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[], ChatMessage[] | {
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[]>;
    isTyping: import("vue").Ref<boolean, boolean>;
    isListening: import("vue").Ref<boolean, boolean>;
    isProcessingVoice: import("vue").Ref<boolean, boolean>;
    isProcessingImage: import("vue").Ref<boolean, boolean>;
    integrations: import("vue").Ref<{
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], IntegrationConfig[] | {
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    voiceEnabled: import("vue").Ref<boolean, boolean>;
    addMessage: (content: string, isUser: boolean, type?: 'text' | 'voice' | 'image' | 'part-lookup', metadata?: any) => void;
    processUserQuery: (query: string, inputType?: 'text' | 'voice') => Promise<void>;
    startVoiceRecording: () => Promise<void>;
    stopVoiceRecording: () => void;
    startVoiceListening: () => void;
    stopVoiceListening: () => void;
    processImageForPartLookup: (imageFile: File) => Promise<PartMatch[]>;
    addIntegration: (integration: Omit<IntegrationConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    testIntegration: (integrationId: string) => Promise<boolean>;
    clearChat: () => void;
}, "messages" | "isTyping" | "isListening" | "isProcessingVoice" | "isProcessingImage" | "integrations" | "voiceEnabled">, Pick<{
    messages: import("vue").Ref<{
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[], ChatMessage[] | {
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[]>;
    isTyping: import("vue").Ref<boolean, boolean>;
    isListening: import("vue").Ref<boolean, boolean>;
    isProcessingVoice: import("vue").Ref<boolean, boolean>;
    isProcessingImage: import("vue").Ref<boolean, boolean>;
    integrations: import("vue").Ref<{
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], IntegrationConfig[] | {
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    voiceEnabled: import("vue").Ref<boolean, boolean>;
    addMessage: (content: string, isUser: boolean, type?: 'text' | 'voice' | 'image' | 'part-lookup', metadata?: any) => void;
    processUserQuery: (query: string, inputType?: 'text' | 'voice') => Promise<void>;
    startVoiceRecording: () => Promise<void>;
    stopVoiceRecording: () => void;
    startVoiceListening: () => void;
    stopVoiceListening: () => void;
    processImageForPartLookup: (imageFile: File) => Promise<PartMatch[]>;
    addIntegration: (integration: Omit<IntegrationConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    testIntegration: (integrationId: string) => Promise<boolean>;
    clearChat: () => void;
}, never>, Pick<{
    messages: import("vue").Ref<{
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[], ChatMessage[] | {
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
        jobReferences?: string[] | undefined;
        type: "image" | "text" | "voice" | "part-lookup";
        audioUrl?: string | undefined;
        imageUrl?: string | undefined;
        partMatches?: {
            partNumber: string;
            partName: string;
            similarity: number;
            imageUrl?: string | undefined;
            currentJobs?: string[] | undefined;
            lastUsed?: string | undefined;
            material?: string | undefined;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            } | undefined;
        }[] | undefined;
        voiceTranscription?: string | undefined;
        confidence?: number | undefined;
    }[]>;
    isTyping: import("vue").Ref<boolean, boolean>;
    isListening: import("vue").Ref<boolean, boolean>;
    isProcessingVoice: import("vue").Ref<boolean, boolean>;
    isProcessingImage: import("vue").Ref<boolean, boolean>;
    integrations: import("vue").Ref<{
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], IntegrationConfig[] | {
        id: string;
        type: "webhook" | "email" | "slack" | "teams" | "discord";
        name: string;
        enabled: boolean;
        config: {
            webhookUrl?: string | undefined;
            channelId?: string | undefined;
            botToken?: string | undefined;
            tenantId?: string | undefined;
            clientId?: string | undefined;
            emailRecipients?: string[] | undefined;
        };
        triggers: {
            event: "job-status-change" | "urgent-job" | "quality-issue" | "machine-down" | "chat-mention";
            conditions?: {
                priority?: string[] | undefined;
                status?: string[] | undefined;
                keywords?: string[] | undefined;
            } | undefined;
            message: string;
            enabled: boolean;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    voiceEnabled: import("vue").Ref<boolean, boolean>;
    addMessage: (content: string, isUser: boolean, type?: 'text' | 'voice' | 'image' | 'part-lookup', metadata?: any) => void;
    processUserQuery: (query: string, inputType?: 'text' | 'voice') => Promise<void>;
    startVoiceRecording: () => Promise<void>;
    stopVoiceRecording: () => void;
    startVoiceListening: () => void;
    stopVoiceListening: () => void;
    processImageForPartLookup: (imageFile: File) => Promise<PartMatch[]>;
    addIntegration: (integration: Omit<IntegrationConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    testIntegration: (integrationId: string) => Promise<boolean>;
    clearChat: () => void;
}, "addMessage" | "processUserQuery" | "startVoiceRecording" | "stopVoiceRecording" | "startVoiceListening" | "stopVoiceListening" | "processImageForPartLookup" | "addIntegration" | "testIntegration" | "clearChat">>;
