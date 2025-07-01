import { supabase } from './api.service';
export const settingsService = {
    /**
     * Fetch user settings
     */
    async fetchUserSettings() {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Return mock settings for demo mode
                return {
                    profile: {
                        name: 'Demo User',
                        department: 'cnc-machining',
                        phone: '555-123-4567'
                    },
                    notifications: {
                        emailEnabled: true,
                        pushEnabled: true,
                        smsEnabled: false,
                        events: [
                            {
                                id: 'job-status',
                                name: 'Job Status Changes',
                                description: 'Notify when job status changes',
                                email: true,
                                push: true,
                                sms: false
                            },
                            {
                                id: 'machine-status',
                                name: 'Machine Status Changes',
                                description: 'Notify when machine status changes',
                                email: true,
                                push: true,
                                sms: false
                            }
                        ]
                    },
                    appearance: {
                        theme: 'light',
                        density: 'comfortable',
                        defaultView: 'dashboard',
                        dashboardWidgets: [
                            { id: 'job-status', visible: true },
                            { id: 'machine-status', visible: true }
                        ]
                    },
                    security: {
                        twoFactorEnabled: false,
                        sessionTimeout: 60
                    },
                    privacy: {
                        analyticsEnabled: true,
                        errorReportingEnabled: true,
                        marketingEnabled: false
                    },
                    integrations: {
                        apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
                        webhookSecret: Math.random().toString(36).substring(2, 15),
                        connectedServices: ['google-sheets', 'slack']
                    }
                };
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                return null;
            // Get user profile
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            if (profileError)
                throw profileError;
            // Get user settings
            const { data: settings, error: settingsError } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();
            // If no settings exist yet, return default settings
            if (settingsError && settingsError.code === 'PGRST116') {
                return {
                    profile: {
                        name: profile.name,
                        department: profile.department,
                        phone: profile.phone || ''
                    },
                    notifications: {
                        emailEnabled: true,
                        pushEnabled: true,
                        smsEnabled: false,
                        events: []
                    },
                    appearance: {
                        theme: 'light',
                        density: 'comfortable',
                        defaultView: 'dashboard',
                        dashboardWidgets: []
                    },
                    security: {
                        twoFactorEnabled: false,
                        sessionTimeout: 60
                    },
                    privacy: {
                        analyticsEnabled: true,
                        errorReportingEnabled: true,
                        marketingEnabled: false
                    },
                    integrations: {
                        apiKey: '',
                        webhookSecret: '',
                        connectedServices: []
                    }
                };
            }
            if (settingsError)
                throw settingsError;
            // Parse settings JSON
            const parsedSettings = settings.settings || {};
            return {
                profile: {
                    name: profile.name,
                    department: profile.department,
                    phone: profile.phone || ''
                },
                notifications: parsedSettings.notifications || {
                    emailEnabled: true,
                    pushEnabled: true,
                    smsEnabled: false,
                    events: []
                },
                appearance: parsedSettings.appearance || {
                    theme: 'light',
                    density: 'comfortable',
                    defaultView: 'dashboard',
                    dashboardWidgets: []
                },
                security: parsedSettings.security || {
                    twoFactorEnabled: false,
                    sessionTimeout: 60
                },
                privacy: parsedSettings.privacy || {
                    analyticsEnabled: true,
                    errorReportingEnabled: true,
                    marketingEnabled: false
                },
                integrations: parsedSettings.integrations || {
                    apiKey: '',
                    webhookSecret: '',
                    connectedServices: []
                }
            };
        }
        catch (err) {
            console.error('Error fetching user settings:', err);
            return null;
        }
    },
    /**
     * Update user profile
     */
    async updateUserProfile(profile) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Update user profile
            const { error } = await supabase
                .from('users')
                .update({
                name: profile.name,
                department: profile.department,
                phone: profile.phone
            })
                .eq('id', user.id);
            if (error)
                throw error;
            return true;
        }
        catch (err) {
            console.error('Error updating user profile:', err);
            return false;
        }
    },
    /**
     * Update notification settings
     */
    async updateNotificationSettings(settings) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    notifications: settings
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                updatedSettings = {
                    ...currentSettings.settings,
                    notifications: {
                        ...currentSettings.settings.notifications,
                        ...settings
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return true;
        }
        catch (err) {
            console.error('Error updating notification settings:', err);
            return false;
        }
    },
    /**
     * Update appearance settings
     */
    async updateAppearanceSettings(settings) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    appearance: settings
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                updatedSettings = {
                    ...currentSettings.settings,
                    appearance: {
                        ...currentSettings.settings.appearance,
                        ...settings
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return true;
        }
        catch (err) {
            console.error('Error updating appearance settings:', err);
            return false;
        }
    },
    /**
     * Update security settings
     */
    async updateSecuritySettings(settings) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    security: settings
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                updatedSettings = {
                    ...currentSettings.settings,
                    security: {
                        ...currentSettings.settings.security,
                        ...settings
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return true;
        }
        catch (err) {
            console.error('Error updating security settings:', err);
            return false;
        }
    },
    /**
     * Update privacy settings
     */
    async updatePrivacySettings(settings) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    privacy: settings
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                updatedSettings = {
                    ...currentSettings.settings,
                    privacy: {
                        ...currentSettings.settings.privacy,
                        ...settings
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return true;
        }
        catch (err) {
            console.error('Error updating privacy settings:', err);
            return false;
        }
    },
    /**
     * Update password
     */
    async updatePassword(_currentPassword, newPassword) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error)
                throw error;
            return true;
        }
        catch (err) {
            console.error('Error updating password:', err);
            return false;
        }
    },
    /**
     * Regenerate API key
     */
    async regenerateApiKey() {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Generate a new API key for demo mode
                const newApiKey = 'jl_api_' + Math.random().toString(36).substring(2, 15);
                await new Promise(resolve => setTimeout(resolve, 500));
                return newApiKey;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Generate a new API key
            const newApiKey = 'jl_api_' + Math.random().toString(36).substring(2, 15);
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    integrations: {
                        apiKey: newApiKey,
                        webhookSecret: Math.random().toString(36).substring(2, 15),
                        connectedServices: []
                    }
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                updatedSettings = {
                    ...currentSettings.settings,
                    integrations: {
                        ...currentSettings.settings.integrations,
                        apiKey: newApiKey
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return newApiKey;
        }
        catch (err) {
            console.error('Error regenerating API key:', err);
            return null;
        }
    },
    /**
     * Connect a service
     */
    async connectService(serviceId) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 1000));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            let updatedSettings = {};
            if (settingsError && settingsError.code === 'PGRST116') {
                // No settings exist yet, create new
                updatedSettings = {
                    integrations: {
                        apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
                        webhookSecret: Math.random().toString(36).substring(2, 15),
                        connectedServices: [serviceId]
                    }
                };
                const { error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                    user_id: user.id,
                    settings: updatedSettings
                });
                if (insertError)
                    throw insertError;
            }
            else if (settingsError) {
                throw settingsError;
            }
            else {
                // Update existing settings
                const connectedServices = currentSettings.settings.integrations?.connectedServices || [];
                if (!connectedServices.includes(serviceId)) {
                    connectedServices.push(serviceId);
                }
                updatedSettings = {
                    ...currentSettings.settings,
                    integrations: {
                        ...currentSettings.settings.integrations,
                        connectedServices
                    }
                };
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({
                    settings: updatedSettings
                })
                    .eq('user_id', user.id);
                if (updateError)
                    throw updateError;
            }
            return true;
        }
        catch (err) {
            console.error('Error connecting service:', err);
            return false;
        }
    },
    /**
     * Disconnect a service
     */
    async disconnectService(serviceId) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // Get current settings
            const { data: currentSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single();
            if (settingsError)
                throw settingsError;
            // Update existing settings
            const connectedServices = currentSettings.settings.integrations?.connectedServices || [];
            const updatedServices = connectedServices.filter((id) => id !== serviceId);
            const updatedSettings = {
                ...currentSettings.settings,
                integrations: {
                    ...currentSettings.settings.integrations,
                    connectedServices: updatedServices
                }
            };
            const { error: updateError } = await supabase
                .from('user_settings')
                .update({
                settings: updatedSettings
            })
                .eq('user_id', user.id);
            if (updateError)
                throw updateError;
            return true;
        }
        catch (err) {
            console.error('Error disconnecting service:', err);
            return false;
        }
    },
    /**
     * Verify two-factor authentication
     */
    async verifyTwoFactor(code) {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // In demo mode, accept any 6-digit code
                const isValid = /^\d{6}$/.test(code);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return isValid;
            }
            // In a real app, this would verify the code with an authenticator service
            // For now, we'll just simulate success
            if (code.length === 6 && /^\d+$/.test(code)) {
                // Get the current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user)
                    throw new Error('User not authenticated');
                // Get current settings
                const { data: currentSettings, error: settingsError } = await supabase
                    .from('user_settings')
                    .select('settings')
                    .eq('user_id', user.id)
                    .single();
                let updatedSettings = {};
                if (settingsError && settingsError.code === 'PGRST116') {
                    // No settings exist yet, create new
                    updatedSettings = {
                        security: {
                            twoFactorEnabled: true,
                            sessionTimeout: 60
                        }
                    };
                    const { error: insertError } = await supabase
                        .from('user_settings')
                        .insert({
                        user_id: user.id,
                        settings: updatedSettings
                    });
                    if (insertError)
                        throw insertError;
                }
                else if (settingsError) {
                    throw settingsError;
                }
                else {
                    // Update existing settings
                    updatedSettings = {
                        ...currentSettings.settings,
                        security: {
                            ...currentSettings.settings.security,
                            twoFactorEnabled: true
                        }
                    };
                    const { error: updateError } = await supabase
                        .from('user_settings')
                        .update({
                        settings: updatedSettings
                    })
                        .eq('user_id', user.id);
                    if (updateError)
                        throw updateError;
                }
                return true;
            }
            return false;
        }
        catch (err) {
            console.error('Error verifying two-factor code:', err);
            return false;
        }
    },
    /**
     * Export user data
     */
    async exportUserData() {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 1000));
                return true;
            }
            // In a real app, this would trigger a data export process
            // For now, we'll just simulate success
            return true;
        }
        catch (err) {
            console.error('Error exporting user data:', err);
            return false;
        }
    },
    /**
     * Delete account
     */
    async deleteAccount() {
        try {
            // Check for demo mode
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate success in demo mode
                await new Promise(resolve => setTimeout(resolve, 1000));
                return true;
            }
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('User not authenticated');
            // In a real app, this would delete all user data and then the user account
            // For now, we'll just simulate success
            // Sign out the user
            await supabase.auth.signOut();
            return true;
        }
        catch (err) {
            console.error('Error deleting account:', err);
            return false;
        }
    }
};
