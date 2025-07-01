"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var auth_1 = require("../stores/auth");
var settings_1 = require("../stores/settings");
var SettingsCard_vue_1 = require("../components/SettingsCard.vue");
var ToggleSwitch_vue_1 = require("../components/ToggleSwitch.vue");
var SecuritySettingsCard_vue_1 = require("../components/SecuritySettingsCard.vue");
var PrivacySettingsCard_vue_1 = require("../components/PrivacySettingsCard.vue");
var DataManagementCard_vue_1 = require("../components/DataManagementCard.vue");
var DeleteAccountModal_vue_1 = require("../components/DeleteAccountModal.vue");
var NotificationEventSetting_vue_1 = require("../components/NotificationEventSetting.vue");
var ConnectedServiceCard_vue_1 = require("../components/ConnectedServiceCard.vue");
var settings_service_1 = require("../services/settings.service");
var outline_1 = require("@heroicons/vue/24/outline");
var authStore = (0, auth_1.useAuthStore)();
var settingsStore = (0, settings_1.useSettingsStore)();
var activeTab = (0, vue_1.ref)('general');
var saving = (0, vue_1.ref)(false);
var updatingPassword = (0, vue_1.ref)(false);
var showDeleteAccountModal = (0, vue_1.ref)(false);
var tabs = [
    { id: 'general', name: 'General', icon: outline_1.UserIcon },
    { id: 'notifications', name: 'Notifications', icon: outline_1.BellIcon },
    { id: 'appearance', name: 'Appearance', icon: outline_1.PaintBrushIcon },
    { id: 'integrations', name: 'Integrations', icon: outline_1.LinkIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: outline_1.ShieldCheckIcon }
];
// Mock departments data
var departments = (0, vue_1.ref)([
    { id: 'cnc-machining', name: 'CNC Machining' },
    { id: 'quality-control', name: 'Quality Control' },
    { id: 'assembly', name: 'Assembly' },
    { id: 'shipping', name: 'Shipping & Receiving' }
]);
// User settings
var userSettings = (0, vue_1.reactive)({
    name: ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.name) || '',
    email: ((_b = authStore.user) === null || _b === void 0 ? void 0 : _b.email) || '',
    department: ((_c = authStore.user) === null || _c === void 0 ? void 0 : _c.department) || '',
    phone: ''
});
// Password settings
var passwordSettings = (0, vue_1.reactive)({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});
// Notification settings
var notificationSettings = (0, vue_1.reactive)({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false
});
// Notification events
var notificationEvents = (0, vue_1.reactive)([
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
var appearanceSettings = (0, vue_1.reactive)({
    theme: 'light',
    density: 'comfortable',
    defaultView: 'dashboard'
});
// Themes
var themes = [
    { id: 'light', name: 'Light', previewClass: 'bg-white' },
    { id: 'dark', name: 'Dark', previewClass: 'bg-gray-800' },
    { id: 'system', name: 'System', previewClass: 'bg-gradient-to-r from-white to-gray-800' }
];
// Densities
var densities = [
    { id: 'compact', name: 'Compact' },
    { id: 'comfortable', name: 'Comfortable' },
    { id: 'spacious', name: 'Spacious' }
];
// Dashboard widgets
var dashboardWidgets = (0, vue_1.reactive)([
    { id: 'job-status', name: 'Job Status', visible: true },
    { id: 'machine-status', name: 'Machine Status', visible: true },
    { id: 'performance', name: 'Performance Metrics', visible: true },
    { id: 'recent-passdown', name: 'Recent Passdown Notes', visible: true },
    { id: 'quick-chat', name: 'Quick Chat', visible: true }
]);
// Integration settings
var integrationSettings = (0, vue_1.reactive)({
    apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
    webhookSecret: Math.random().toString(36).substring(2, 15)
});
// Connected services
var connectedServices = (0, vue_1.reactive)([
    {
        id: 'google-sheets',
        name: 'Google Sheets',
        status: 'connected',
        icon: outline_1.CloudIcon,
        bgColor: 'bg-green-100 text-green-600'
    },
    {
        id: 'slack',
        name: 'Slack',
        status: 'connected',
        icon: outline_1.ChatBubbleLeftRightIcon,
        bgColor: 'bg-purple-100 text-purple-600'
    },
    {
        id: 'erp',
        name: 'ERP System',
        status: 'disconnected',
        icon: outline_1.GlobeAltIcon,
        bgColor: 'bg-blue-100 text-blue-600'
    }
]);
// API permissions
var apiPermissions = (0, vue_1.reactive)([
    { id: 'read-jobs', name: 'Read Jobs', enabled: true },
    { id: 'write-jobs', name: 'Write Jobs', enabled: false },
    { id: 'read-machines', name: 'Read Machines', enabled: true },
    { id: 'write-machines', name: 'Write Machines', enabled: false },
    { id: 'read-users', name: 'Read Users', enabled: false }
]);
// Security settings
var securitySettings = (0, vue_1.reactive)({
    twoFactorEnabled: false,
    verificationCode: '',
    sessionTimeout: '60'
});
// Privacy settings
var privacySettings = (0, vue_1.reactive)({
    analyticsEnabled: true,
    errorReportingEnabled: true,
    marketingEnabled: false
});
// Computed properties
var canUpdatePassword = (0, vue_1.computed)(function () {
    return (passwordSettings.currentPassword.length > 0 &&
        passwordSettings.newPassword.length >= 8 &&
        passwordSettings.newPassword === passwordSettings.confirmPassword);
});
var webhookUrl = (0, vue_1.computed)(function () {
    var _a;
    return "".concat(window.location.origin, "/api/webhook/").concat(((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id) || 'user-id');
});
// Methods
var saveAllSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saving.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 8, 9]);
                // Save user profile
                return [4 /*yield*/, settings_service_1.settingsService.updateUserProfile({
                        name: userSettings.name,
                        department: userSettings.department,
                        phone: userSettings.phone
                    })];
            case 2:
                // Save user profile
                _a.sent();
                // Save notification settings
                return [4 /*yield*/, settings_service_1.settingsService.updateNotificationSettings({
                        emailEnabled: notificationSettings.emailEnabled,
                        pushEnabled: notificationSettings.pushEnabled,
                        smsEnabled: notificationSettings.smsEnabled,
                        events: notificationEvents
                    })];
            case 3:
                // Save notification settings
                _a.sent();
                // Save appearance settings
                return [4 /*yield*/, settings_service_1.settingsService.updateAppearanceSettings({
                        theme: appearanceSettings.theme,
                        density: appearanceSettings.density,
                        defaultView: appearanceSettings.defaultView,
                        dashboardWidgets: dashboardWidgets
                    })];
            case 4:
                // Save appearance settings
                _a.sent();
                // Save security settings
                return [4 /*yield*/, settings_service_1.settingsService.updateSecuritySettings({
                        sessionTimeout: parseInt(securitySettings.sessionTimeout)
                    })];
            case 5:
                // Save security settings
                _a.sent();
                // Save privacy settings
                return [4 /*yield*/, settings_service_1.settingsService.updatePrivacySettings({
                        analyticsEnabled: privacySettings.analyticsEnabled,
                        errorReportingEnabled: privacySettings.errorReportingEnabled,
                        marketingEnabled: privacySettings.marketingEnabled
                    })];
            case 6:
                // Save privacy settings
                _a.sent();
                alert('Settings saved successfully');
                return [3 /*break*/, 9];
            case 7:
                error_1 = _a.sent();
                console.error('Error saving settings:', error_1);
                alert('Failed to save settings');
                return [3 /*break*/, 9];
            case 8:
                saving.value = false;
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
var updatePassword = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!canUpdatePassword.value)
                    return [2 /*return*/];
                updatingPassword.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, settings_service_1.settingsService.updatePassword(passwordSettings.currentPassword, passwordSettings.newPassword)];
            case 2:
                _a.sent();
                // Reset password fields
                passwordSettings.currentPassword = '';
                passwordSettings.newPassword = '';
                passwordSettings.confirmPassword = '';
                alert('Password updated successfully');
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error('Error updating password:', error_2);
                alert('Failed to update password');
                return [3 /*break*/, 5];
            case 4:
                updatingPassword.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var toggleServiceConnection = function (service) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                if (!(service.status === 'connected')) return [3 /*break*/, 2];
                return [4 /*yield*/, settings_service_1.settingsService.disconnectService(service.id)];
            case 1:
                _a.sent();
                service.status = 'disconnected';
                return [3 /*break*/, 6];
            case 2:
                if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 4];
                // Simulate a delay
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 3:
                // Simulate a delay
                _a.sent();
                service.status = 'connected';
                return [2 /*return*/];
            case 4: return [4 /*yield*/, settings_service_1.settingsService.connectService(service.id)];
            case 5:
                _a.sent();
                service.status = 'connected';
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                console.error("Error toggling service ".concat(service.id, ":"), error_3);
                alert("Failed to ".concat(service.status === 'connected' ? 'disconnect' : 'connect', " service"));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var regenerateApiKey = function () { return __awaiter(void 0, void 0, void 0, function () {
    var newApiKey, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, settings_service_1.settingsService.regenerateApiKey()];
            case 1:
                newApiKey = _a.sent();
                integrationSettings.apiKey = newApiKey || '';
                alert('API key regenerated successfully');
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error regenerating API key:', error_4);
                alert('Failed to regenerate API key');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var copyApiKey = function () {
    navigator.clipboard.writeText(integrationSettings.apiKey);
    alert('API key copied to clipboard');
};
var copyWebhookUrl = function () {
    navigator.clipboard.writeText(webhookUrl.value);
    alert('Webhook URL copied to clipboard');
};
var verifyTwoFactor = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var success, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, settings_service_1.settingsService.verifyTwoFactor(code)];
            case 1:
                success = _a.sent();
                if (success) {
                    alert('Two-factor authentication enabled successfully');
                }
                else {
                    alert('Invalid verification code');
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error verifying two-factor code:', error_5);
                alert('Failed to verify two-factor code');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var exportUserData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, settings_service_1.settingsService.exportUserData()];
            case 1:
                _a.sent();
                alert('Data export initiated. You will receive an email with your data shortly.');
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error exporting user data:', error_6);
                alert('Failed to export user data');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var deleteAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                return [4 /*yield*/, settings_service_1.settingsService.deleteAccount()];
            case 1:
                _a.sent();
                alert('Account deleted successfully');
                // Redirect to login page
                window.location.href = '/login';
                return [3 /*break*/, 4];
            case 2:
                error_7 = _a.sent();
                console.error('Error deleting account:', error_7);
                alert('Failed to delete account');
                return [3 /*break*/, 4];
            case 3:
                showDeleteAccountModal.value = false;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var settings, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, settingsStore.fetchUserSettings()];
            case 1:
                settings = _b.sent();
                if (settings) {
                    // Update reactive objects with fetched settings
                    Object.assign(userSettings, settings.profile);
                    Object.assign(notificationSettings, settings.notifications);
                    Object.assign(appearanceSettings, settings.appearance);
                    // Update notification events
                    if (settings.notifications.events) {
                        settings.notifications.events.forEach(function (event) {
                            var existingEvent = notificationEvents.find(function (e) { return e.id === event.id; });
                            if (existingEvent) {
                                Object.assign(existingEvent, event);
                            }
                        });
                    }
                    // Update dashboard widgets
                    if (settings.appearance.dashboardWidgets) {
                        settings.appearance.dashboardWidgets.forEach(function (widget) {
                            var existingWidget = dashboardWidgets.find(function (w) { return w.id === widget.id; });
                            if (existingWidget) {
                                existingWidget.visible = widget.visible;
                            }
                        });
                    }
                    // Update security settings
                    if (settings.security) {
                        securitySettings.twoFactorEnabled = settings.security.twoFactorEnabled || false;
                        securitySettings.sessionTimeout = ((_a = settings.security.sessionTimeout) === null || _a === void 0 ? void 0 : _a.toString()) || '60';
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
                            settings.integrations.connectedServices.forEach(function (serviceId) {
                                var service = connectedServices.find(function (s) { return s.id === serviceId; });
                                if (service) {
                                    service.status = 'connected';
                                }
                            });
                        }
                    }
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error('Error loading settings:', error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-2xl font-bold text-gray-900" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-gray-600" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex space-x-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.saveAllSettings) }, { disabled: (__VLS_ctx.saving) }), { class: "bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200" }));
(__VLS_ctx.saving ? 'Saving...' : 'Save All Settings');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "border-b border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(__assign({ class: "flex space-x-8 overflow-x-auto" }));
var _loop_1 = function (tab) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.activeTab = tab.id;
        } }, { key: (tab.id) }), { class: (__VLS_ctx.activeTab === tab.id
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') }), { class: "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200" }));
    var __VLS_0 = ((tab.icon));
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-4 h-4 mr-2 inline" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 mr-2 inline" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    (tab.name);
};
for (var _i = 0, _d = __VLS_getVForSourceType((__VLS_ctx.tabs)); _i < _d.length; _i++) {
    var tab = _d[_i][0];
    _loop_1(tab);
}
if (__VLS_ctx.activeTab === 'general') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_4 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Profile Settings",
    }));
    var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([{
            title: "Profile Settings",
        }], __VLS_functionalComponentArgsRest(__VLS_4), false));
    __VLS_6.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ value: (__VLS_ctx.userSettings.name), type: "text" }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "email", disabled: true }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" }));
    (__VLS_ctx.userSettings.email);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ value: (__VLS_ctx.userSettings.department) }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.departments)); _e < _f.length; _e++) {
        var dept = _f[_e][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (dept.id),
            value: (dept.id),
        });
        (dept.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "tel" }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    (__VLS_ctx.userSettings.phone);
    var __VLS_6;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Password",
    }));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
            title: "Password",
        }], __VLS_functionalComponentArgsRest(__VLS_7), false));
    __VLS_9.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "password" }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    (__VLS_ctx.passwordSettings.currentPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "password" }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    (__VLS_ctx.passwordSettings.newPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "password" }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
    (__VLS_ctx.passwordSettings.confirmPassword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-end" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.updatePassword) }, { disabled: (!__VLS_ctx.canUpdatePassword || __VLS_ctx.updatingPassword) }), { class: "bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200" }));
    (__VLS_ctx.updatingPassword ? 'Updating...' : 'Update Password');
    var __VLS_9;
}
if (__VLS_ctx.activeTab === 'notifications') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Notification Preferences",
    }));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([{
            title: "Notification Preferences",
        }], __VLS_functionalComponentArgsRest(__VLS_10), false));
    __VLS_12.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(ToggleSwitch_vue_1.default, new ToggleSwitch_vue_1.default({
        modelValue: (__VLS_ctx.notificationSettings.emailEnabled),
    }));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.notificationSettings.emailEnabled),
        }], __VLS_functionalComponentArgsRest(__VLS_13), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent(ToggleSwitch_vue_1.default, new ToggleSwitch_vue_1.default({
        modelValue: (__VLS_ctx.notificationSettings.pushEnabled),
    }));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.notificationSettings.pushEnabled),
        }], __VLS_functionalComponentArgsRest(__VLS_16), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-gray-500" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof ToggleSwitch, ]} */ ;
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent(ToggleSwitch_vue_1.default, new ToggleSwitch_vue_1.default({
        modelValue: (__VLS_ctx.notificationSettings.smsEnabled),
    }));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.notificationSettings.smsEnabled),
        }], __VLS_functionalComponentArgsRest(__VLS_19), false));
    var __VLS_12;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_22 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Notification Events",
    }));
    var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([{
            title: "Notification Events",
        }], __VLS_functionalComponentArgsRest(__VLS_22), false));
    __VLS_24.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.notificationEvents)); _g < _h.length; _g++) {
        var event_1 = _h[_g][0];
        /** @type {[typeof NotificationEventSetting, ]} */ ;
        // @ts-ignore
        var __VLS_25 = __VLS_asFunctionalComponent(NotificationEventSetting_vue_1.default, new NotificationEventSetting_vue_1.default({
            key: (event_1.id),
            event: (event_1),
            emailEnabled: (__VLS_ctx.notificationSettings.emailEnabled),
            pushEnabled: (__VLS_ctx.notificationSettings.pushEnabled),
            smsEnabled: (__VLS_ctx.notificationSettings.smsEnabled),
        }));
        var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([{
                key: (event_1.id),
                event: (event_1),
                emailEnabled: (__VLS_ctx.notificationSettings.emailEnabled),
                pushEnabled: (__VLS_ctx.notificationSettings.pushEnabled),
                smsEnabled: (__VLS_ctx.notificationSettings.smsEnabled),
            }], __VLS_functionalComponentArgsRest(__VLS_25), false));
    }
    var __VLS_24;
}
if (__VLS_ctx.activeTab === 'appearance') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_28 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Theme Settings",
    }));
    var __VLS_29 = __VLS_28.apply(void 0, __spreadArray([{
            title: "Theme Settings",
        }], __VLS_functionalComponentArgsRest(__VLS_28), false));
    __VLS_30.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-3 gap-4" }));
    var _loop_2 = function (theme) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'appearance'))
                    return;
                __VLS_ctx.appearanceSettings.theme = theme.id;
            } }, { key: (theme.id) }), { class: "border rounded-lg p-4 cursor-pointer" }), { class: (__VLS_ctx.appearanceSettings.theme === theme.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300') }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "h-12 rounded-md mb-2" }, { class: (theme.previewClass) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm font-medium text-center" }));
        (theme.name);
    };
    for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.themes)); _j < _k.length; _j++) {
        var theme = _k[_j][0];
        _loop_2(theme);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-3 gap-4" }));
    var _loop_3 = function (density) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'appearance'))
                    return;
                __VLS_ctx.appearanceSettings.density = density.id;
            } }, { key: (density.id) }), { class: "border rounded-lg p-4 cursor-pointer" }), { class: (__VLS_ctx.appearanceSettings.density === density.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300') }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col items-center justify-center h-12 mb-2" }));
        if (density.id === 'compact') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-2 bg-gray-200 rounded mb-1" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-2 bg-gray-200 rounded mb-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-2 bg-gray-200 rounded mb-1" }));
        if (density.id === 'comfortable') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-2 bg-gray-200 rounded" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm font-medium text-center" }));
        (density.name);
    };
    for (var _l = 0, _m = __VLS_getVForSourceType((__VLS_ctx.densities)); _l < _m.length; _l++) {
        var density = _m[_l][0];
        _loop_3(density);
    }
    var __VLS_30;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_31 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Dashboard Layout",
    }));
    var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
            title: "Dashboard Layout",
        }], __VLS_functionalComponentArgsRest(__VLS_31), false));
    __VLS_33.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ value: (__VLS_ctx.appearanceSettings.defaultView) }, { class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" }));
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm font-medium text-gray-700 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-2" }));
    for (var _o = 0, _p = __VLS_getVForSourceType((__VLS_ctx.dashboardWidgets)); _o < _p.length; _o++) {
        var widget = _p[_o][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (widget.id) }, { class: "flex items-center justify-between" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm text-gray-900" }));
        (widget.name);
        /** @type {[typeof ToggleSwitch, ]} */ ;
        // @ts-ignore
        var __VLS_34 = __VLS_asFunctionalComponent(ToggleSwitch_vue_1.default, new ToggleSwitch_vue_1.default({
            modelValue: (widget.visible),
        }));
        var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
                modelValue: (widget.visible),
            }], __VLS_functionalComponentArgsRest(__VLS_34), false));
    }
    var __VLS_33;
}
if (__VLS_ctx.activeTab === 'integrations') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_37 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "Connected Services",
    }));
    var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{
            title: "Connected Services",
        }], __VLS_functionalComponentArgsRest(__VLS_37), false));
    __VLS_39.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    for (var _q = 0, _r = __VLS_getVForSourceType((__VLS_ctx.connectedServices)); _q < _r.length; _q++) {
        var service = _r[_q][0];
        /** @type {[typeof ConnectedServiceCard, ]} */ ;
        // @ts-ignore
        var __VLS_40 = __VLS_asFunctionalComponent(ConnectedServiceCard_vue_1.default, new ConnectedServiceCard_vue_1.default(__assign({ 'onToggle': {} }, { key: (service.id), service: (service) })));
        var __VLS_41 = __VLS_40.apply(void 0, __spreadArray([__assign({ 'onToggle': {} }, { key: (service.id), service: (service) })], __VLS_functionalComponentArgsRest(__VLS_40), false));
        var __VLS_43 = void 0;
        var __VLS_44 = void 0;
        var __VLS_45 = void 0;
        var __VLS_46 = {
            onToggle: (__VLS_ctx.toggleServiceConnection)
        };
        var __VLS_42;
    }
    var __VLS_39;
    /** @type {[typeof SettingsCard, typeof SettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_47 = __VLS_asFunctionalComponent(SettingsCard_vue_1.default, new SettingsCard_vue_1.default({
        title: "API Access",
    }));
    var __VLS_48 = __VLS_47.apply(void 0, __spreadArray([{
            title: "API Access",
        }], __VLS_functionalComponentArgsRest(__VLS_47), false));
    __VLS_49.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.regenerateApiKey) }, { class: "text-primary-600 hover:text-primary-700 text-sm font-medium" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "text", readonly: true, value: (__VLS_ctx.integrationSettings.apiKey) }, { class: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.copyApiKey) }, { class: "px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200" }));
    var __VLS_50 = {}.ClipboardIcon;
    /** @type {[typeof __VLS_components.ClipboardIcon, ]} */ ;
    // @ts-ignore
    var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50(__assign({ class: "w-4 h-4" })));
    var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_51), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-gray-500 mt-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-2" }));
    for (var _s = 0, _t = __VLS_getVForSourceType((__VLS_ctx.apiPermissions)); _s < _t.length; _s++) {
        var permission = _t[_s][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (permission.id) }, { class: "flex items-center justify-between" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm text-gray-900" }));
        (permission.name);
        /** @type {[typeof ToggleSwitch, ]} */ ;
        // @ts-ignore
        var __VLS_54 = __VLS_asFunctionalComponent(ToggleSwitch_vue_1.default, new ToggleSwitch_vue_1.default({
            modelValue: (permission.enabled),
        }));
        var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([{
                modelValue: (permission.enabled),
            }], __VLS_functionalComponentArgsRest(__VLS_54), false));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "text-sm font-medium text-gray-900 mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "text", readonly: true, value: (__VLS_ctx.webhookUrl) }, { class: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 font-mono text-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.copyWebhookUrl) }, { class: "px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200" }));
    var __VLS_57 = {}.ClipboardIcon;
    /** @type {[typeof __VLS_components.ClipboardIcon, ]} */ ;
    // @ts-ignore
    var __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57(__assign({ class: "w-4 h-4" })));
    var __VLS_59 = __VLS_58.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_58), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-gray-500 mt-1" }));
    var __VLS_49;
}
if (__VLS_ctx.activeTab === 'privacy') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
    /** @type {[typeof SecuritySettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_61 = __VLS_asFunctionalComponent(SecuritySettingsCard_vue_1.default, new SecuritySettingsCard_vue_1.default(__assign(__assign(__assign({ 'onUpdate:twoFactorEnabled': {} }, { 'onUpdate:sessionTimeout': {} }), { 'onVerify': {} }), { twoFactorEnabled: (__VLS_ctx.securitySettings.twoFactorEnabled), sessionTimeout: (__VLS_ctx.securitySettings.sessionTimeout) })));
    var __VLS_62 = __VLS_61.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onUpdate:twoFactorEnabled': {} }, { 'onUpdate:sessionTimeout': {} }), { 'onVerify': {} }), { twoFactorEnabled: (__VLS_ctx.securitySettings.twoFactorEnabled), sessionTimeout: (__VLS_ctx.securitySettings.sessionTimeout) })], __VLS_functionalComponentArgsRest(__VLS_61), false));
    var __VLS_64 = void 0;
    var __VLS_65 = void 0;
    var __VLS_66 = void 0;
    var __VLS_67 = {
        'onUpdate:twoFactorEnabled': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.securitySettings.twoFactorEnabled = $event;
        }
    };
    var __VLS_68 = {
        'onUpdate:sessionTimeout': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.securitySettings.sessionTimeout = $event;
        }
    };
    var __VLS_69 = {
        onVerify: (__VLS_ctx.verifyTwoFactor)
    };
    var __VLS_63;
    /** @type {[typeof PrivacySettingsCard, ]} */ ;
    // @ts-ignore
    var __VLS_70 = __VLS_asFunctionalComponent(PrivacySettingsCard_vue_1.default, new PrivacySettingsCard_vue_1.default(__assign(__assign(__assign({ 'onUpdate:analyticsEnabled': {} }, { 'onUpdate:errorReportingEnabled': {} }), { 'onUpdate:marketingEnabled': {} }), { analyticsEnabled: (__VLS_ctx.privacySettings.analyticsEnabled), errorReportingEnabled: (__VLS_ctx.privacySettings.errorReportingEnabled), marketingEnabled: (__VLS_ctx.privacySettings.marketingEnabled) })));
    var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onUpdate:analyticsEnabled': {} }, { 'onUpdate:errorReportingEnabled': {} }), { 'onUpdate:marketingEnabled': {} }), { analyticsEnabled: (__VLS_ctx.privacySettings.analyticsEnabled), errorReportingEnabled: (__VLS_ctx.privacySettings.errorReportingEnabled), marketingEnabled: (__VLS_ctx.privacySettings.marketingEnabled) })], __VLS_functionalComponentArgsRest(__VLS_70), false));
    var __VLS_73 = void 0;
    var __VLS_74 = void 0;
    var __VLS_75 = void 0;
    var __VLS_76 = {
        'onUpdate:analyticsEnabled': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.analyticsEnabled = $event;
        }
    };
    var __VLS_77 = {
        'onUpdate:errorReportingEnabled': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.errorReportingEnabled = $event;
        }
    };
    var __VLS_78 = {
        'onUpdate:marketingEnabled': function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.privacySettings.marketingEnabled = $event;
        }
    };
    var __VLS_72;
    /** @type {[typeof DataManagementCard, ]} */ ;
    // @ts-ignore
    var __VLS_79 = __VLS_asFunctionalComponent(DataManagementCard_vue_1.default, new DataManagementCard_vue_1.default(__assign({ 'onExportData': {} }, { 'onDeleteAccount': {} })));
    var __VLS_80 = __VLS_79.apply(void 0, __spreadArray([__assign({ 'onExportData': {} }, { 'onDeleteAccount': {} })], __VLS_functionalComponentArgsRest(__VLS_79), false));
    var __VLS_82 = void 0;
    var __VLS_83 = void 0;
    var __VLS_84 = void 0;
    var __VLS_85 = {
        onExportData: (__VLS_ctx.exportUserData)
    };
    var __VLS_86 = {
        onDeleteAccount: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'privacy'))
                return;
            __VLS_ctx.showDeleteAccountModal = true;
        }
    };
    var __VLS_81;
}
if (__VLS_ctx.showDeleteAccountModal) {
    /** @type {[typeof DeleteAccountModal, ]} */ ;
    // @ts-ignore
    var __VLS_87 = __VLS_asFunctionalComponent(DeleteAccountModal_vue_1.default, new DeleteAccountModal_vue_1.default(__assign({ 'onConfirm': {} }, { 'onCancel': {} })));
    var __VLS_88 = __VLS_87.apply(void 0, __spreadArray([__assign({ 'onConfirm': {} }, { 'onCancel': {} })], __VLS_functionalComponentArgsRest(__VLS_87), false));
    var __VLS_90 = void 0;
    var __VLS_91 = void 0;
    var __VLS_92 = void 0;
    var __VLS_93 = {
        onConfirm: (__VLS_ctx.deleteAccount)
    };
    var __VLS_94 = {
        onCancel: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showDeleteAccountModal))
                return;
            __VLS_ctx.showDeleteAccountModal = false;
        }
    };
    var __VLS_89;
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
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            SettingsCard: SettingsCard_vue_1.default,
            ToggleSwitch: ToggleSwitch_vue_1.default,
            SecuritySettingsCard: SecuritySettingsCard_vue_1.default,
            PrivacySettingsCard: PrivacySettingsCard_vue_1.default,
            DataManagementCard: DataManagementCard_vue_1.default,
            DeleteAccountModal: DeleteAccountModal_vue_1.default,
            NotificationEventSetting: NotificationEventSetting_vue_1.default,
            ConnectedServiceCard: ConnectedServiceCard_vue_1.default,
            ClipboardIcon: outline_1.ClipboardIcon,
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
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
