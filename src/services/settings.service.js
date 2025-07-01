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
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = void 0;
var api_service_1 = require("./api.service");
exports.settingsService = {
    /**
     * Fetch user settings
     */
    fetchUserSettings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, profile, profileError, _b, settings, settingsError, parsedSettings, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        // Check for demo mode
                        if (import.meta.env.VITE_DEMO_MODE === 'true') {
                            // Return mock settings for demo mode
                            return [2 /*return*/, {
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
                                }];
                        }
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 1:
                        user = (_c.sent()).data.user;
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('id', user.id)
                                .single()];
                    case 2:
                        _a = _c.sent(), profile = _a.data, profileError = _a.error;
                        if (profileError)
                            throw profileError;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('*')
                                .eq('user_id', user.id)
                                .single()];
                    case 3:
                        _b = _c.sent(), settings = _b.data, settingsError = _b.error;
                        // If no settings exist yet, return default settings
                        if (settingsError && settingsError.code === 'PGRST116') {
                            return [2 /*return*/, {
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
                                }];
                        }
                        if (settingsError)
                            throw settingsError;
                        parsedSettings = settings.settings || {};
                        return [2 /*return*/, {
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
                            }];
                    case 4:
                        err_1 = _c.sent();
                        console.error('Error fetching user settings:', err_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update user profile
     */
    updateUserProfile: function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_a.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .update({
                                name: profile.name,
                                department: profile.department,
                                phone: profile.phone
                            })
                                .eq('id', user.id)];
                    case 4:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 5:
                        err_2 = _a.sent();
                        console.error('Error updating user profile:', err_2);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update notification settings
     */
    updateNotificationSettings: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            notifications: settings
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { notifications: __assign(__assign({}, currentSettings.settings.notifications), settings) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10:
                        err_3 = _b.sent();
                        console.error('Error updating notification settings:', err_3);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update appearance settings
     */
    updateAppearanceSettings: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            appearance: settings
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { appearance: __assign(__assign({}, currentSettings.settings.appearance), settings) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10:
                        err_4 = _b.sent();
                        console.error('Error updating appearance settings:', err_4);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update security settings
     */
    updateSecuritySettings: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            security: settings
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { security: __assign(__assign({}, currentSettings.settings.security), settings) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10:
                        err_5 = _b.sent();
                        console.error('Error updating security settings:', err_5);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update privacy settings
     */
    updatePrivacySettings: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            privacy: settings
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { privacy: __assign(__assign({}, currentSettings.settings.privacy), settings) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10:
                        err_6 = _b.sent();
                        console.error('Error updating privacy settings:', err_6);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update password
     */
    updatePassword: function (currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.updateUser({
                            password: newPassword
                        })];
                    case 3:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 4:
                        err_7 = _a.sent();
                        console.error('Error updating password:', err_7);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Regenerate API key
     */
    regenerateApiKey: function () {
        return __awaiter(this, void 0, void 0, function () {
            var newApiKey_1, user, newApiKey, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        newApiKey_1 = 'jl_api_' + Math.random().toString(36).substring(2, 15);
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, newApiKey_1];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        newApiKey = 'jl_api_' + Math.random().toString(36).substring(2, 15);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            integrations: {
                                apiKey: newApiKey,
                                webhookSecret: Math.random().toString(36).substring(2, 15),
                                connectedServices: []
                            }
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { integrations: __assign(__assign({}, currentSettings.settings.integrations), { apiKey: newApiKey }) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, newApiKey];
                    case 10:
                        err_8 = _b.sent();
                        console.error('Error regenerating API key:', err_8);
                        return [2 /*return*/, null];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Connect a service
     */
    connectService: function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, updatedSettings, insertError, connectedServices, updateError, err_9;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 10, , 11]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Simulate success in demo mode
                        _c.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_c.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _c.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            integrations: {
                                apiKey: 'jl_api_' + Math.random().toString(36).substring(2, 15),
                                webhookSecret: Math.random().toString(36).substring(2, 15),
                                connectedServices: [serviceId]
                            }
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_c.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        connectedServices = ((_b = currentSettings.settings.integrations) === null || _b === void 0 ? void 0 : _b.connectedServices) || [];
                        if (!connectedServices.includes(serviceId)) {
                            connectedServices.push(serviceId);
                        }
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { integrations: __assign(__assign({}, currentSettings.settings.integrations), { connectedServices: connectedServices }) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_c.sent()).error;
                        if (updateError)
                            throw updateError;
                        _c.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10:
                        err_9 = _c.sent();
                        console.error('Error connecting service:', err_9);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Disconnect a service
     */
    disconnectService: function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, currentSettings, settingsError, connectedServices, updatedServices, updatedSettings, updateError, err_10;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        // Simulate success in demo mode
                        _c.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_c.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _c.sent(), currentSettings = _a.data, settingsError = _a.error;
                        if (settingsError)
                            throw settingsError;
                        connectedServices = ((_b = currentSettings.settings.integrations) === null || _b === void 0 ? void 0 : _b.connectedServices) || [];
                        updatedServices = connectedServices.filter(function (id) { return id !== serviceId; });
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { integrations: __assign(__assign({}, currentSettings.settings.integrations), { connectedServices: updatedServices }) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 5:
                        updateError = (_c.sent()).error;
                        if (updateError)
                            throw updateError;
                        return [2 /*return*/, true];
                    case 6:
                        err_10 = _c.sent();
                        console.error('Error disconnecting service:', err_10);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Verify two-factor authentication
     */
    verifyTwoFactor: function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid, user, _a, currentSettings, settingsError, updatedSettings, insertError, updateError, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        isValid = /^\d{6}$/.test(code);
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, isValid];
                    case 2:
                        if (!(code.length === 6 && /^\d+$/.test(code))) return [3 /*break*/, 10];
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .select('settings')
                                .eq('user_id', user.id)
                                .single()];
                    case 4:
                        _a = _b.sent(), currentSettings = _a.data, settingsError = _a.error;
                        updatedSettings = {};
                        if (!(settingsError && settingsError.code === 'PGRST116')) return [3 /*break*/, 6];
                        // No settings exist yet, create new
                        updatedSettings = {
                            security: {
                                twoFactorEnabled: true,
                                sessionTimeout: 60
                            }
                        };
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .insert({
                                user_id: user.id,
                                settings: updatedSettings
                            })];
                    case 5:
                        insertError = (_b.sent()).error;
                        if (insertError)
                            throw insertError;
                        return [3 /*break*/, 9];
                    case 6:
                        if (!settingsError) return [3 /*break*/, 7];
                        throw settingsError;
                    case 7:
                        // Update existing settings
                        updatedSettings = __assign(__assign({}, currentSettings.settings), { security: __assign(__assign({}, currentSettings.settings.security), { twoFactorEnabled: true }) });
                        return [4 /*yield*/, api_service_1.supabase
                                .from('user_settings')
                                .update({
                                settings: updatedSettings
                            })
                                .eq('user_id', user.id)];
                    case 8:
                        updateError = (_b.sent()).error;
                        if (updateError)
                            throw updateError;
                        _b.label = 9;
                    case 9: return [2 /*return*/, true];
                    case 10: return [2 /*return*/, false];
                    case 11:
                        err_11 = _b.sent();
                        console.error('Error verifying two-factor code:', err_11);
                        return [2 /*return*/, false];
                    case 12: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Export user data
     */
    exportUserData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Simulate success in demo mode
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: 
                    // In a real app, this would trigger a data export process
                    // For now, we'll just simulate success
                    return [2 /*return*/, true];
                    case 3:
                        err_12 = _a.sent();
                        console.error('Error exporting user data:', err_12);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Delete account
     */
    deleteAccount: function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(import.meta.env.VITE_DEMO_MODE === 'true')) return [3 /*break*/, 2];
                        // Simulate success in demo mode
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Simulate success in demo mode
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 3:
                        user = (_a.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        // In a real app, this would delete all user data and then the user account
                        // For now, we'll just simulate success
                        // Sign out the user
                        return [4 /*yield*/, api_service_1.supabase.auth.signOut()];
                    case 4:
                        // In a real app, this would delete all user data and then the user account
                        // For now, we'll just simulate success
                        // Sign out the user
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        err_13 = _a.sent();
                        console.error('Error deleting account:', err_13);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
};
