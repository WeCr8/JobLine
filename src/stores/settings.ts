import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { settingsService } from '../services/settings.service';

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

export const useSettingsStore = defineStore('settings', () => {
  const userSettings = ref<UserSettings | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUserSettings = async (): Promise<UserSettings | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const settings = await settingsService.fetchUserSettings();
      userSettings.value = settings;
      return settings;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching user settings:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateUserProfile = async (profile: Partial<UserSettings['profile']>): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updateUserProfile(profile);
      
      if (success && userSettings.value) {
        userSettings.value.profile = {
          ...userSettings.value.profile,
          ...profile
        };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating user profile:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateNotificationSettings = async (settings: Partial<UserSettings['notifications']>): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updateNotificationSettings(settings);
      
      if (success && userSettings.value) {
        userSettings.value.notifications = {
          ...userSettings.value.notifications,
          ...settings
        };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating notification settings:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateAppearanceSettings = async (settings: Partial<UserSettings['appearance']>): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updateAppearanceSettings(settings);
      
      if (success && userSettings.value) {
        userSettings.value.appearance = {
          ...userSettings.value.appearance,
          ...settings
        };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating appearance settings:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateSecuritySettings = async (settings: Partial<UserSettings['security']>): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updateSecuritySettings(settings);
      
      if (success && userSettings.value) {
        userSettings.value.security = {
          ...userSettings.value.security,
          ...settings
        };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating security settings:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updatePrivacySettings = async (settings: Partial<UserSettings['privacy']>): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updatePrivacySettings(settings);
      
      if (success && userSettings.value) {
        userSettings.value.privacy = {
          ...userSettings.value.privacy,
          ...settings
        };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating privacy settings:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.updatePassword(currentPassword, newPassword);
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating password:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const regenerateApiKey = async (): Promise<string | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const newApiKey = await settingsService.regenerateApiKey();
      
      if (newApiKey && userSettings.value) {
        userSettings.value.integrations.apiKey = newApiKey;
      }
      
      return newApiKey;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error regenerating API key:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await settingsService.deleteAccount();
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting account:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    userSettings,
    loading,
    error,
    fetchUserSettings,
    updateUserProfile,
    updateNotificationSettings,
    updateAppearanceSettings,
    updateSecuritySettings,
    updatePrivacySettings,
    updatePassword,
    regenerateApiKey,
    deleteAccount
  };
});