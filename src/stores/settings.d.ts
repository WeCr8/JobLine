export interface UserSettings {
    profile: {
        name: string;
        department?: string;
        phone?: string;
    };
    notifications: {
        emailEnabled: boolean;
        pushEnabled: boolean;
        smsEnabled: boolean;
        events: any[];
    };
    appearance: {
        theme: string;
        density: string;
        defaultView: string;
        dashboardWidgets: any[];
    };
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
    };
    privacy: {
        analyticsEnabled: boolean;
        errorReportingEnabled: boolean;
        marketingEnabled: boolean;
    };
    integrations: {
        apiKey: string;
        webhookSecret: string;
        connectedServices: any[];
    };
}
export declare const useSettingsStore: import("pinia").StoreDefinition<"settings", Pick<{
    userSettings: import("vue").Ref<{
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null, UserSettings | {
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchUserSettings: () => Promise<UserSettings | null>;
    updateUserProfile: (profile: Partial<UserSettings['profile']>) => Promise<boolean>;
    updateNotificationSettings: (settings: Partial<UserSettings['notifications']>) => Promise<boolean>;
    updateAppearanceSettings: (settings: Partial<UserSettings['appearance']>) => Promise<boolean>;
    updateSecuritySettings: (settings: Partial<UserSettings['security']>) => Promise<boolean>;
    updatePrivacySettings: (settings: Partial<UserSettings['privacy']>) => Promise<boolean>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    regenerateApiKey: () => Promise<string | null>;
    deleteAccount: () => Promise<boolean>;
}, "loading" | "error" | "userSettings">, Pick<{
    userSettings: import("vue").Ref<{
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null, UserSettings | {
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchUserSettings: () => Promise<UserSettings | null>;
    updateUserProfile: (profile: Partial<UserSettings['profile']>) => Promise<boolean>;
    updateNotificationSettings: (settings: Partial<UserSettings['notifications']>) => Promise<boolean>;
    updateAppearanceSettings: (settings: Partial<UserSettings['appearance']>) => Promise<boolean>;
    updateSecuritySettings: (settings: Partial<UserSettings['security']>) => Promise<boolean>;
    updatePrivacySettings: (settings: Partial<UserSettings['privacy']>) => Promise<boolean>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    regenerateApiKey: () => Promise<string | null>;
    deleteAccount: () => Promise<boolean>;
}, never>, Pick<{
    userSettings: import("vue").Ref<{
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null, UserSettings | {
        profile: {
            name: string;
            department?: string | undefined;
            phone?: string | undefined;
        };
        notifications: {
            emailEnabled: boolean;
            pushEnabled: boolean;
            smsEnabled: boolean;
            events: any[];
        };
        appearance: {
            theme: string;
            density: string;
            defaultView: string;
            dashboardWidgets: any[];
        };
        security: {
            twoFactorEnabled: boolean;
            sessionTimeout: number;
        };
        privacy: {
            analyticsEnabled: boolean;
            errorReportingEnabled: boolean;
            marketingEnabled: boolean;
        };
        integrations: {
            apiKey: string;
            webhookSecret: string;
            connectedServices: any[];
        };
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchUserSettings: () => Promise<UserSettings | null>;
    updateUserProfile: (profile: Partial<UserSettings['profile']>) => Promise<boolean>;
    updateNotificationSettings: (settings: Partial<UserSettings['notifications']>) => Promise<boolean>;
    updateAppearanceSettings: (settings: Partial<UserSettings['appearance']>) => Promise<boolean>;
    updateSecuritySettings: (settings: Partial<UserSettings['security']>) => Promise<boolean>;
    updatePrivacySettings: (settings: Partial<UserSettings['privacy']>) => Promise<boolean>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    regenerateApiKey: () => Promise<string | null>;
    deleteAccount: () => Promise<boolean>;
}, "fetchUserSettings" | "updateUserProfile" | "updateNotificationSettings" | "updateAppearanceSettings" | "updateSecuritySettings" | "updatePrivacySettings" | "updatePassword" | "regenerateApiKey" | "deleteAccount">>;
