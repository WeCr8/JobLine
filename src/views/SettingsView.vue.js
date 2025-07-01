import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSettingsStore } from '../stores/settings';
import SettingsCard from '../components/SettingsCard.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import SecuritySettingsCard from '../components/SecuritySettingsCard.vue';
import PrivacySettingsCard from '../components/PrivacySettingsCard.vue';
import DataManagementCard from '../components/DataManagementCard.vue';
import DeleteAccountModal from '../components/DeleteAccountModal.vue';
import NotificationEventSetting from '../components/NotificationEventSetting.vue';
import ConnectedServiceCard from '../components/ConnectedServiceCard.vue';
import { settingsService } from '../services/settings.service';
import { UserIcon, BellIcon, PaintBrushIcon, LinkIcon, ShieldCheckIcon, ClipboardIcon, CloudIcon, GlobeAltIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const activeTab = ref('general');
const saving = ref(false);
const updatingPassword = ref(false);
const showDeleteAccountModal = ref(false);
const tabs = [
    { id: 'general', name: 'General', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon }
];
// Mock departments data
const departments = ref([
    { id: 'cnc-machining', name: 'CNC Machining' },
    { id: 'quality-control', name: 'Quality Control' },
    { id: 'assembly', name: 'Assembly' },
    { id: 'shipping', name: 'Shipping & Receiving' }
]);
// User settings
const userSettings = reactive({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    department: authStore.user?.department || '',
    phone: ''
});
// Password settings
const passwordSettings = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});
// Notification settings
const notificationSettings = reactive({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false
});
// Notification events
const notificationEvents = reactive([
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
    },
    {
        id: 'quality-issues',
        name: 'Quality Issues',
        description: 'Notify when quality issues are detected',
        email: true,
        push: true,
        sms: true
    },
    {
        id: 'due-dates',
        name: 'Upcoming Due Dates',
        description: 'Notify about upcoming job due dates',
        email: true,
        push: false,
        sms: false
    },
    {
        id: 'mentions',
        name: 'Mentions',
        description: 'Notify when you are mentioned in comments',
        email: false,
        push: true,
        sms: false
    }
]);
// Appearance settings
const appearanceSettings = reactive({
    theme: 'light',
    density: 'comfortable',
    defaultView: 'dashboard'
});
// Themes
const themes = [
    { id: 'light', name: 'Light', previewClass: 'bg-white' },
    { id: 'dark', name: 'Dark', previewClass: 'bg-gray-800' },
    { id: 'system', name: 'System', previewClass: 'bg-gradient-to-r from-white to-gray-800' }
];
// Densities
const densities = [
    { id: 'compact', name: 'Compact' },
    { id: 'comfortable', name: 'Comfortable' },
    { id: 'spacious', name: 'Spacious' }
];
// Dashboard widgets
const dashboardWidgets = reactive([
    { id: 'job-status', name: 'Job Status', visible: true },
    { id: 'machine-status', name: 'Machine Status', visible: true },
    { id: 'performance', name: 'Performance Metrics', visible: true },
    { id: 'recent-passdown', name: 'Recent Passdown Notes', visible: true },
    { id: 'quick-chat', name: 'Quick Chat', visible: true }
]);
// Integration settings
const integrationSettings = reactive({
    apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
    webhookSecret: Math.random().toString(36).substring(2, 15)
});
// Connected services
const connectedServices = reactive([
    {
        id: 'google-sheets',
        name: 'Google Sheets',
        status: 'connected',
        icon: CloudIcon,
        bgColor: 'bg-green-100 text-green-600'
    },
    {
        id: 'slack',
        name: 'Slack',
        status: 'connected',
        icon: ChatBubbleLeftRightIcon,
        bgColor: 'bg-purple-100 text-purple-600'
    },
    {
        id: 'erp',
        name: 'ERP System',
        status: 'disconnected',
        icon: GlobeAltIcon,
        bgColor: 'bg-blue-100 text-blue-600'
    }
]);
// API permissions
const apiPermissions = reactive([
    { id: 'read-jobs', name: 'Read Jobs', enabled: true },
    { id: 'write-jobs', name: 'Write Jobs', enabled: false },
    { id: 'read-machines', name: 'Read Machines', enabled: true },
    { id: 'write-machines', name: 'Write Machines', enabled: false },
    { id: 'read-users', name: 'Read Users', enabled: false }
]);
// Security settings
const securitySettings = reactive({
    twoFactorEnabled: false,
    verificationCode: '',
    sessionTimeout: '60'
});
// Privacy settings
const privacySettings = reactive({
    analyticsEnabled: true,
    errorReportingEnabled: true,
    marketingEnabled: false
});
// Chat Provider Integration state
const chatProviderSettings = reactive({
    provider: 'dummy',
    apiKey: '',
    endpoint: ''
});
const testingChatProvider = ref(false);
const chatProviderTestResult = ref('');
// Computed properties
const canUpdatePassword = computed(() => {
    return (passwordSettings.currentPassword.length > 0 &&
        passwordSettings.newPassword.length >= 8 &&
        passwordSettings.newPassword === passwordSettings.confirmPassword);
});
const webhookUrl = computed(() => {
    return `${window.location.origin}/api/webhook/${authStore.user?.id || 'user-id'}`;
});
// Methods
const saveAllSettings = async () => {
    saving.value = true;
    try {
        // Save user profile
        await settingsService.updateUserProfile({
            name: userSettings.name,
            department: userSettings.department,
            phone: userSettings.phone
        });
        // Save notification settings
        await settingsService.updateNotificationSettings({
            emailEnabled: notificationSettings.emailEnabled,
            pushEnabled: notificationSettings.pushEnabled,
            smsEnabled: notificationSettings.smsEnabled,
            events: notificationEvents
        });
        // Save appearance settings
        await settingsService.updateAppearanceSettings({
            theme: appearanceSettings.theme,
            density: appearanceSettings.density,
            defaultView: appearanceSettings.defaultView,
            dashboardWidgets: dashboardWidgets
        });
        // Save security settings
        await settingsService.updateSecuritySettings({
            sessionTimeout: parseInt(securitySettings.sessionTimeout)
        });
        // Save privacy settings
        await settingsService.updatePrivacySettings({
            analyticsEnabled: privacySettings.analyticsEnabled,
            errorReportingEnabled: privacySettings.errorReportingEnabled,
            marketingEnabled: privacySettings.marketingEnabled
        });
        alert('Settings saved successfully');
    }
    catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
    }
    finally {
        saving.value = false;
    }
};
const updatePassword = async () => {
    if (!canUpdatePassword.value)
        return;
    updatingPassword.value = true;
    try {
        await settingsService.updatePassword(passwordSettings.currentPassword, passwordSettings.newPassword);
        // Reset password fields
        passwordSettings.currentPassword = '';
        passwordSettings.newPassword = '';
        passwordSettings.confirmPassword = '';
        alert('Password updated successfully');
    }
    catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password');
    }
    finally {
        updatingPassword.value = false;
    }
};
const toggleServiceConnection = async (service) => {
    try {
        if (service.status === 'connected') {
            await settingsService.disconnectService(service.id);
            service.status = 'disconnected';
        }
        else {
            // In demo mode, simulate a successful connection
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                // Simulate a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                service.status = 'connected';
                return;
            }
            await settingsService.connectService(service.id);
            service.status = 'connected';
        }
    }
    catch (error) {
        console.error(`Error toggling service ${service.id}:`, error);
        alert(`Failed to ${service.status === 'connected' ? 'disconnect' : 'connect'} service`);
    }
};
const regenerateApiKey = async () => {
    try {
        const newApiKey = await settingsService.regenerateApiKey();
        integrationSettings.apiKey = newApiKey || '';
        alert('API key regenerated successfully');
    }
    catch (error) {
        console.error('Error regenerating API key:', error);
        alert('Failed to regenerate API key');
    }
};
const copyApiKey = () => {
    navigator.clipboard.writeText(integrationSettings.apiKey);
    alert('API key copied to clipboard');
};
const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl.value);
    alert('Webhook URL copied to clipboard');
};
const verifyTwoFactor = async (code) => {
    try {
        const success = await settingsService.verifyTwoFactor(code);
        if (success) {
            alert('Two-factor authentication enabled successfully');
        }
        else {
            alert('Invalid verification code');
        }
    }
    catch (error) {
        console.error('Error verifying two-factor code:', error);
        alert('Failed to verify two-factor code');
    }
};
const exportUserData = async () => {
    try {
        await settingsService.exportUserData();
        alert('Data export initiated. You will receive an email with your data shortly.');
    }
    catch (error) {
        console.error('Error exporting user data:', error);
        alert('Failed to export user data');
    }
};
const deleteAccount = async () => {
    try {
        await settingsService.deleteAccount();
        alert('Account deleted successfully');
        // Redirect to login page
        window.location.href = '/login';
    }
    catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
    }
    finally {
        showDeleteAccountModal.value = false;
    }
};
const testChatProvider = async () => {
    testingChatProvider.value = true;
    chatProviderTestResult.value = '';
    try {
        // Simulate a test connection (replace with real API call as needed)
        await new Promise(resolve => setTimeout(resolve, 800));
        if (chatProviderSettings.provider === 'dummy') {
            chatProviderTestResult.value = 'success';
        }
        else if (chatProviderSettings.provider === 'openai' && chatProviderSettings.apiKey.startsWith('sk-')) {
            chatProviderTestResult.value = 'success';
        }
        else if (chatProviderSettings.provider === 'custom' && chatProviderSettings.endpoint && chatProviderSettings.apiKey) {
            chatProviderTestResult.value = 'success';
        }
        else {
            chatProviderTestResult.value = 'error';
        }
    }
    catch (e) {
        chatProviderTestResult.value = 'error';
    }
    finally {
        testingChatProvider.value = false;
    }
};
onMounted(async () => {
    try {
        // Load user settings
        const settings = await settingsStore.fetchUserSettings();
        if (settings) {
            // Update reactive objects with fetched settings
            Object.assign(userSettings, settings.profile);
            Object.assign(notificationSettings, settings.notifications);
            Object.assign(appearanceSettings, settings.appearance);
            // Update notification events
            if (settings.notifications.events) {
                settings.notifications.events.forEach((event) => {
                    const existingEvent = notificationEvents.find(e => e.id === event.id);
                    if (existingEvent) {
                        Object.assign(existingEvent, event);
                    }
                });
            }
            // Update dashboard widgets
            if (settings.appearance.dashboardWidgets) {
                settings.appearance.dashboardWidgets.forEach((widget) => {
                    const existingWidget = dashboardWidgets.find(w => w.id === widget.id);
                    if (existingWidget) {
                        existingWidget.visible = widget.visible;
                    }
                });
            }
            // Update security settings
            if (settings.security) {
                securitySettings.twoFactorEnabled = settings.security.twoFactorEnabled || false;
                securitySettings.sessionTimeout = settings.security.sessionTimeout?.toString() || '60';
            }
            // Update privacy settings
            if (settings.privacy) {
                Object.assign(privacySettings, settings.privacy);
            }
            // Update integration settings
            if (settings.integrations) {
                integrationSettings.apiKey = settings.integrations.apiKey || integrationSettings.apiKey;
                integrationSettings.webhookSecret = settings.integrations.webhookSecret || integrationSettings.webhookSecret;
                // Update connected services
                if (settings.integrations.connectedServices) {
                    settings.integrations.connectedServices.forEach((serviceId) => {
                        const service = connectedServices.find(s => s.id === serviceId);
                        if (service) {
                            service.status = 'connected';
                        }
                    });
                }
            }
        }
    }
    catch (error) {
        console.error('Error loading settings:', error);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-gray-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex space-x-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.saveAllSettings) },
    disabled: (__VLS_ctx.saving),
    ...{ class: "bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200" },
});
(__VLS_ctx.saving ? 'Saving...' : 'Save All Settings');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-b border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "flex space-x-8 overflow-x-auto" },
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.tabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.id;
            } },
        key: (tab.id),
        ...{ class: (__VLS_ctx.activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') },
        ...{ class: "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200" },
    });
    const __VLS_0 = ((tab.icon));
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-4 h-4 mr-2 inline" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-4 h-4 mr-2 inline" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    (tab.name);
}
if (__VLS_ctx.activeTab === 'general') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Profile Settings",
    }));
    const __VLS_5 = __VLS_4({
        title: "Profile Settings",
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    __VLS_6.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (__VLS_ctx.userSettings.name),
        type: "text",
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "email",
        disabled: true,
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" },
    });
    (__VLS_ctx.userSettings.email);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.userSettings.department),
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    for (const [dept] of __VLS_getVForSourceType((__VLS_ctx.departments))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (dept.id),
            value: (dept.id),
        });
        (dept.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "tel",
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    (__VLS_ctx.userSettings.phone);
    var __VLS_6;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Password",
    }));
    const __VLS_8 = __VLS_7({
        title: "Password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_9.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "password",
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    (__VLS_ctx.passwordSettings.currentPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "password",
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    (__VLS_ctx.passwordSettings.newPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "password",
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    (__VLS_ctx.passwordSettings.confirmPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.updatePassword) },
        disabled: (!__VLS_ctx.canUpdatePassword || __VLS_ctx.updatingPassword),
        ...{ class: "bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200" },
    });
    (__VLS_ctx.updatingPassword ? 'Updating...' : 'Update Password');
    var __VLS_9;
}
if (__VLS_ctx.activeTab === 'notifications') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Notification Preferences",
    }));
    const __VLS_11 = __VLS_10({
        title: "Notification Preferences",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(ToggleSwitch, new ToggleSwitch({
        modelValue: (__VLS_ctx.notificationSettings.emailEnabled),
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.notificationSettings.emailEnabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(ToggleSwitch, new ToggleSwitch({
        modelValue: (__VLS_ctx.notificationSettings.pushEnabled),
    }));
    const __VLS_17 = __VLS_16({
        modelValue: (__VLS_ctx.notificationSettings.pushEnabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(ToggleSwitch, new ToggleSwitch({
        modelValue: (__VLS_ctx.notificationSettings.smsEnabled),
    }));
    const __VLS_20 = __VLS_19({
        modelValue: (__VLS_ctx.notificationSettings.smsEnabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    var __VLS_12;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Notification Events",
    }));
    const __VLS_23 = __VLS_22({
        title: "Notification Events",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    for (const [event] of __VLS_getVForSourceType((__VLS_ctx.notificationEvents))) {
        /** @type {[typeof NotificationEventSetting, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(NotificationEventSetting, new NotificationEventSetting({
            key: (event.id),
            event: (event),
            emailEnabled: (__VLS_ctx.notificationSettings.emailEnabled),
            pushEnabled: (__VLS_ctx.notificationSettings.pushEnabled),
            smsEnabled: (__VLS_ctx.notificationSettings.smsEnabled),
        }));
        const __VLS_26 = __VLS_25({
            key: (event.id),
            event: (event),
            emailEnabled: (__VLS_ctx.notificationSettings.emailEnabled),
            pushEnabled: (__VLS_ctx.notificationSettings.pushEnabled),
            smsEnabled: (__VLS_ctx.notificationSettings.smsEnabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    }
    var __VLS_24;
}
if (__VLS_ctx.activeTab === 'appearance') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Theme Settings",
    }));
    const __VLS_29 = __VLS_28({
        title: "Theme Settings",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_30.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-3 gap-4" },
    });
    for (const [theme] of __VLS_getVForSourceType((__VLS_ctx.themes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'appearance'))
                        return;
                    __VLS_ctx.appearanceSettings.theme = theme.id;
                } },
            key: (theme.id),
            ...{ class: "border rounded-lg p-4 cursor-pointer" },
            ...{ class: (__VLS_ctx.appearanceSettings.theme === theme.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-12 rounded-md mb-2" },
            ...{ class: (theme.previewClass) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-center" },
        });
        (theme.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-3 gap-4" },
    });
    for (const [density] of __VLS_getVForSourceType((__VLS_ctx.densities))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'appearance'))
                        return;
                    __VLS_ctx.appearanceSettings.density = density.id;
                } },
            key: (density.id),
            ...{ class: "border rounded-lg p-4 cursor-pointer" },
            ...{ class: (__VLS_ctx.appearanceSettings.density === density.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-col items-center justify-center h-12 mb-2" },
        });
        if (density.id === 'compact') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "w-full h-2 bg-gray-200 rounded mb-1" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-full h-2 bg-gray-200 rounded mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-full h-2 bg-gray-200 rounded mb-1" },
        });
        if (density.id === 'comfortable') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "w-full h-2 bg-gray-200 rounded" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-center" },
        });
        (density.name);
    }
    var __VLS_30;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Dashboard Layout",
    }));
    const __VLS_32 = __VLS_31({
        title: "Dashboard Layout",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.appearanceSettings.defaultView),
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "dashboard",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "jobs",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "machines",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "chat",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2" },
    });
    for (const [widget] of __VLS_getVForSourceType((__VLS_ctx.dashboardWidgets))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (widget.id),
            ...{ class: "flex items-center justify-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-900" },
        });
        (widget.name);
        /** @type {[typeof ToggleSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(ToggleSwitch, new ToggleSwitch({
            modelValue: (widget.visible),
        }));
        const __VLS_35 = __VLS_34({
            modelValue: (widget.visible),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    }
    var __VLS_33;
}
if (__VLS_ctx.activeTab === 'integrations') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Connected Services",
    }));
    const __VLS_38 = __VLS_37({
        title: "Connected Services",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    for (const [service] of __VLS_getVForSourceType((__VLS_ctx.connectedServices))) {
        /** @type {[typeof ConnectedServiceCard, ]} */ ;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent(ConnectedServiceCard, new ConnectedServiceCard({
            ...{ 'onToggle': {} },
            key: (service.id),
            service: (service),
        }));
        const __VLS_41 = __VLS_40({
            ...{ 'onToggle': {} },
            key: (service.id),
            service: (service),
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        let __VLS_43;
        let __VLS_44;
        let __VLS_45;
        const __VLS_46 = {
            onToggle: (__VLS_ctx.toggleServiceConnection)
        };
        var __VLS_42;
    }
    var __VLS_39;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "API Access",
    }));
    const __VLS_48 = __VLS_47({
        title: "API Access",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_49.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.regenerateApiKey) },
        ...{ class: "text-primary-600 hover:text-primary-700 text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "text",
        readonly: true,
        value: (__VLS_ctx.integrationSettings.apiKey),
        ...{ class: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.copyApiKey) },
        ...{ class: "px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200" },
    });
    const __VLS_50 = {}.ClipboardIcon;
    /** @type {[typeof __VLS_components.ClipboardIcon, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_52 = __VLS_51({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2" },
    });
    for (const [permission] of __VLS_getVForSourceType((__VLS_ctx.apiPermissions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (permission.id),
            ...{ class: "flex items-center justify-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-900" },
        });
        (permission.name);
        /** @type {[typeof ToggleSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(ToggleSwitch, new ToggleSwitch({
            modelValue: (permission.enabled),
        }));
        const __VLS_55 = __VLS_54({
            modelValue: (permission.enabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-medium text-gray-900 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "text",
        readonly: true,
        value: (__VLS_ctx.webhookUrl),
        ...{ class: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.copyWebhookUrl) },
        ...{ class: "px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200" },
    });
    const __VLS_57 = {}.ClipboardIcon;
    /** @type {[typeof __VLS_components.ClipboardIcon, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_59 = __VLS_58({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    var __VLS_49;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(SettingsCard, new SettingsCard({
        title: "Chat Provider Integration",
    }));
    const __VLS_62 = __VLS_61({
        title: "Chat Provider Integration",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.chatProviderSettings.provider),
        ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "dummy",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "openai",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "custom",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    if (__VLS_ctx.chatProviderSettings.provider === 'openai') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            value: (__VLS_ctx.chatProviderSettings.apiKey),
            type: "text",
            ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
            placeholder: "sk-...",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-gray-500 mt-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            href: 'https://platform.openai.com/account/api-keys',
            target: '_blank',
            ...{ class: 'text-primary-600 underline' },
        });
    }
    if (__VLS_ctx.chatProviderSettings.provider === 'custom') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "block text-sm font-medium text-gray-700 mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            value: (__VLS_ctx.chatProviderSettings.endpoint),
            type: "text",
            ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
            placeholder: "https://api.example.com/chat",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "block text-sm font-medium text-gray-700 mb-2 mt-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            value: (__VLS_ctx.chatProviderSettings.apiKey),
            type: "text",
            ...{ class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" },
            placeholder: "Your API Key",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-gray-500 mt-1" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.testChatProvider) },
        disabled: (__VLS_ctx.testingChatProvider),
        ...{ class: "bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200" },
    });
    (__VLS_ctx.testingChatProvider ? 'Testing...' : 'Test Connection');
    if (__VLS_ctx.chatProviderTestResult) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.chatProviderTestResult === 'success' ? 'text-green-600' : 'text-red-600') },
        });
        (__VLS_ctx.chatProviderTestResult === 'success' ? 'Success!' : 'Failed to connect');
    }
    var __VLS_63;
}
if (__VLS_ctx.activeTab === 'privacy') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {[typeof SecuritySettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(SecuritySettingsCard, new SecuritySettingsCard({
        ...{ 'onUpdate:twoFactorEnabled': {} },
        ...{ 'onUpdate:sessionTimeout': {} },
        ...{ 'onVerify': {} },
        twoFactorEnabled: (__VLS_ctx.securitySettings.twoFactorEnabled),
        sessionTimeout: (__VLS_ctx.securitySettings.sessionTimeout),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onUpdate:twoFactorEnabled': {} },
        ...{ 'onUpdate:sessionTimeout': {} },
        ...{ 'onVerify': {} },
        twoFactorEnabled: (__VLS_ctx.securitySettings.twoFactorEnabled),
        sessionTimeout: (__VLS_ctx.securitySettings.sessionTimeout),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_67;
    let __VLS_68;
    let __VLS_69;
    const __VLS_70 = {
        'onUpdate:twoFactorEnabled': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.securitySettings.twoFactorEnabled = $event;
        }
    };
    const __VLS_71 = {
        'onUpdate:sessionTimeout': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.securitySettings.sessionTimeout = $event;
        }
    };
    const __VLS_72 = {
        onVerify: (__VLS_ctx.verifyTwoFactor)
    };
    var __VLS_66;
    /** @type {[typeof PrivacySettingsCard, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(PrivacySettingsCard, new PrivacySettingsCard({
        ...{ 'onUpdate:analyticsEnabled': {} },
        ...{ 'onUpdate:errorReportingEnabled': {} },
        ...{ 'onUpdate:marketingEnabled': {} },
        analyticsEnabled: (__VLS_ctx.privacySettings.analyticsEnabled),
        errorReportingEnabled: (__VLS_ctx.privacySettings.errorReportingEnabled),
        marketingEnabled: (__VLS_ctx.privacySettings.marketingEnabled),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onUpdate:analyticsEnabled': {} },
        ...{ 'onUpdate:errorReportingEnabled': {} },
        ...{ 'onUpdate:marketingEnabled': {} },
        analyticsEnabled: (__VLS_ctx.privacySettings.analyticsEnabled),
        errorReportingEnabled: (__VLS_ctx.privacySettings.errorReportingEnabled),
        marketingEnabled: (__VLS_ctx.privacySettings.marketingEnabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        'onUpdate:analyticsEnabled': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.analyticsEnabled = $event;
        }
    };
    const __VLS_80 = {
        'onUpdate:errorReportingEnabled': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.errorReportingEnabled = $event;
        }
    };
    const __VLS_81 = {
        'onUpdate:marketingEnabled': (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.marketingEnabled = $event;
        }
    };
    var __VLS_75;
    /** @type {[typeof DataManagementCard, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(DataManagementCard, new DataManagementCard({
        ...{ 'onExportData': {} },
        ...{ 'onDeleteAccount': {} },
    }));
    const __VLS_83 = __VLS_82({
        ...{ 'onExportData': {} },
        ...{ 'onDeleteAccount': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    let __VLS_85;
    let __VLS_86;
    let __VLS_87;
    const __VLS_88 = {
        onExportData: (__VLS_ctx.exportUserData)
    };
    const __VLS_89 = {
        onDeleteAccount: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.showDeleteAccountModal = true;
        }
    };
    var __VLS_84;
}
if (__VLS_ctx.showDeleteAccountModal) {
    /** @type {[typeof DeleteAccountModal, ]} */ ;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent(DeleteAccountModal, new DeleteAccountModal({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
    }));
    const __VLS_91 = __VLS_90({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    let __VLS_93;
    let __VLS_94;
    let __VLS_95;
    const __VLS_96 = {
        onConfirm: (__VLS_ctx.deleteAccount)
    };
    const __VLS_97 = {
        onCancel: (...[$event]) => {
            if (!(__VLS_ctx.showDeleteAccountModal))
                return;
            __VLS_ctx.showDeleteAccountModal = false;
        }
    };
    var __VLS_92;
}
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-8']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-l-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-r-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-l-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-0']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-r-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SettingsCard: SettingsCard,
            ToggleSwitch: ToggleSwitch,
            SecuritySettingsCard: SecuritySettingsCard,
            PrivacySettingsCard: PrivacySettingsCard,
            DataManagementCard: DataManagementCard,
            DeleteAccountModal: DeleteAccountModal,
            NotificationEventSetting: NotificationEventSetting,
            ConnectedServiceCard: ConnectedServiceCard,
            ClipboardIcon: ClipboardIcon,
            activeTab: activeTab,
            saving: saving,
            updatingPassword: updatingPassword,
            showDeleteAccountModal: showDeleteAccountModal,
            tabs: tabs,
            departments: departments,
            userSettings: userSettings,
            passwordSettings: passwordSettings,
            notificationSettings: notificationSettings,
            notificationEvents: notificationEvents,
            appearanceSettings: appearanceSettings,
            themes: themes,
            densities: densities,
            dashboardWidgets: dashboardWidgets,
            integrationSettings: integrationSettings,
            connectedServices: connectedServices,
            apiPermissions: apiPermissions,
            securitySettings: securitySettings,
            privacySettings: privacySettings,
            chatProviderSettings: chatProviderSettings,
            testingChatProvider: testingChatProvider,
            chatProviderTestResult: chatProviderTestResult,
            canUpdatePassword: canUpdatePassword,
            webhookUrl: webhookUrl,
            saveAllSettings: saveAllSettings,
            updatePassword: updatePassword,
            toggleServiceConnection: toggleServiceConnection,
            regenerateApiKey: regenerateApiKey,
            copyApiKey: copyApiKey,
            copyWebhookUrl: copyWebhookUrl,
            verifyTwoFactor: verifyTwoFactor,
            exportUserData: exportUserData,
            deleteAccount: deleteAccount,
            testChatProvider: testChatProvider,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
