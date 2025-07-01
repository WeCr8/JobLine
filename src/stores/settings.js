import { defineStore } from 'pinia';
import { ref } from 'vue';
import { settingsService } from '../services/settings.service';
export const useSettingsStore = defineStore('settings', () => {
    const userSettings = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const fetchUserSettings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const settings = await settingsService.fetchUserSettings();
            userSettings.value = settings;
            return settings;
        }
        catch (err) {
            error.value = err.message;
            console.error('Error fetching user settings:', err);
            return null;
        }
        finally {
            loading.value = false;
        }
    };
    const updateUserProfile = async (profile) => {
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating user profile:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const updateNotificationSettings = async (settings) => {
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating notification settings:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const updateAppearanceSettings = async (settings) => {
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating appearance settings:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const updateSecuritySettings = async (settings) => {
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating security settings:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const updatePrivacySettings = async (settings) => {
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating privacy settings:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const updatePassword = async (currentPassword, newPassword) => {
        loading.value = true;
        error.value = null;
        try {
            const success = await settingsService.updatePassword(currentPassword, newPassword);
            return success;
        }
        catch (err) {
            error.value = err.message;
            console.error('Error updating password:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    const regenerateApiKey = async () => {
        loading.value = true;
        error.value = null;
        try {
            const newApiKey = await settingsService.regenerateApiKey();
            if (newApiKey && userSettings.value) {
                userSettings.value.integrations.apiKey = newApiKey;
            }
            return newApiKey;
        }
        catch (err) {
            error.value = err.message;
            console.error('Error regenerating API key:', err);
            return null;
        }
        finally {
            loading.value = false;
        }
    };
    const deleteAccount = async () => {
        loading.value = true;
        error.value = null;
        try {
            const success = await settingsService.deleteAccount();
            return success;
        }
        catch (err) {
            error.value = err.message;
            console.error('Error deleting account:', err);
            return false;
        }
        finally {
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
