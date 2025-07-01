import type { UserSettings } from '../stores/settings';
export declare const settingsService: {
    /**
     * Fetch user settings
     */
    fetchUserSettings(): Promise<UserSettings | null>;
    /**
     * Update user profile
     */
    updateUserProfile(profile: Partial<UserSettings['profile']>): Promise<boolean>;
    /**
     * Update notification settings
     */
    updateNotificationSettings(settings: Partial<UserSettings['notifications']>): Promise<boolean>;
    /**
     * Update appearance settings
     */
    updateAppearanceSettings(settings: Partial<UserSettings['appearance']>): Promise<boolean>;
    /**
     * Update security settings
     */
    updateSecuritySettings(settings: Partial<UserSettings['security']>): Promise<boolean>;
    /**
     * Update privacy settings
     */
    updatePrivacySettings(settings: Partial<UserSettings['privacy']>): Promise<boolean>;
    /**
     * Update password
     */
    updatePassword(_currentPassword: string, newPassword: string): Promise<boolean>;
    /**
     * Regenerate API key
     */
    regenerateApiKey(): Promise<string | null>;
    /**
     * Connect a service
     */
    connectService(serviceId: string): Promise<boolean>;
    /**
     * Disconnect a service
     */
    disconnectService(serviceId: string): Promise<boolean>;
    /**
     * Verify two-factor authentication
     */
    verifyTwoFactor(code: string): Promise<boolean>;
    /**
     * Export user data
     */
    exportUserData(): Promise<boolean>;
    /**
     * Delete account
     */
    deleteAccount(): Promise<boolean>;
};
