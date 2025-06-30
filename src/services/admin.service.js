"use strict";
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
exports.adminService = void 0;
var api_service_1 = require("./api.service");
exports.adminService = {
    /**
     * Fetch all subscription plans
     */
    fetchSubscriptionPlans: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('subscription_plans')
                                .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (plan) { return ({
                                id: plan.id,
                                name: plan.name,
                                description: plan.description,
                                price: plan.price,
                                interval: plan.interval,
                                stripePriceId: plan.stripe_price_id,
                                active: plan.is_active,
                                features: plan.features || [],
                                subscriberCount: plan.subscriber_count || 0,
                                createdAt: plan.created_at,
                                updatedAt: plan.updated_at
                            }); })];
                    case 2:
                        err_1 = _b.sent();
                        console.error('Error fetching subscription plans:', err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch all users
     */
    fetchUsers: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                    case 2:
                        err_2 = _b.sent();
                        console.error('Error fetching users:', err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch all organizations
     */
    fetchOrganizations: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('organizations')
                                .select("\n          *,\n          users:organization_users(*)\n        ")];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (org) { return ({
                                id: org.id,
                                name: org.name,
                                industry: org.industry,
                                address: org.address,
                                phone: org.phone,
                                website: org.website,
                                logoUrl: org.logo_url,
                                primaryContactName: org.primary_contact_name,
                                primaryContactEmail: org.primary_contact_email,
                                subscriptionId: org.subscription_id,
                                subscriptionStatus: org.subscription_status,
                                planId: org.plan_id,
                                planName: '', // Would need to join with plans table
                                maxUsers: org.max_users,
                                currentUserCount: org.current_user_count,
                                isActive: org.is_active,
                                createdAt: org.created_at,
                                updatedAt: org.updated_at
                            }); })];
                    case 2:
                        err_3 = _b.sent();
                        console.error('Error fetching organizations:', err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch system logs
     */
    fetchSystemLogs: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var _a, data, error, err_4;
            if (limit === void 0) { limit = 100; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('system_logs')
                                .select('*')
                                .order('timestamp', { ascending: false })
                                .limit(limit)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (log) { return ({
                                id: log.id,
                                level: log.level,
                                message: log.message,
                                context: log.context,
                                userId: log.user_id,
                                ipAddress: log.ip_address,
                                timestamp: log.timestamp
                            }); })];
                    case 2:
                        err_4 = _b.sent();
                        console.error('Error fetching system logs:', err_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch system settings
     */
    fetchSystemSettings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, settingsMap_1, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('system_settings')
                                .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data || data.length === 0)
                            return [2 /*return*/, null];
                        settingsMap_1 = {};
                        data.forEach(function (setting) {
                            settingsMap_1[setting.key] = setting.value;
                        });
                        return [2 /*return*/, {
                                stripeSecretKey: settingsMap_1.stripe_secret_key || '********',
                                stripeWebhookSecret: settingsMap_1.stripe_webhook_secret || '********',
                                openaiApiKey: settingsMap_1.openai_api_key || '********',
                                ai: {
                                    defaultModel: settingsMap_1.ai_default_model || 'gpt-4',
                                    temperature: parseFloat(settingsMap_1.ai_temperature || '0.7'),
                                    maxTokens: parseInt(settingsMap_1.ai_max_tokens || '2000'),
                                    timeout: parseInt(settingsMap_1.ai_timeout || '30000')
                                },
                                backup: {
                                    enabled: settingsMap_1.backup_enabled === 'true',
                                    frequency: settingsMap_1.backup_frequency || 'daily',
                                    retentionDays: parseInt(settingsMap_1.backup_retention_days || '30')
                                }
                            }];
                    case 2:
                        err_5 = _b.sent();
                        console.error('Error fetching system settings:', err_5);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Save subscription plan
     */
    saveSubscriptionPlan: function (plan) {
        return __awaiter(this, void 0, void 0, function () {
            var error, _a, data, error, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!plan.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('subscription_plans')
                                .update({
                                name: plan.name,
                                description: plan.description,
                                price: plan.price,
                                interval: plan.interval,
                                stripe_price_id: plan.stripePriceId,
                                is_active: plan.active,
                                features: plan.features,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', plan.id)];
                    case 1:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, plan];
                    case 2: return [4 /*yield*/, api_service_1.supabase
                            .from('subscription_plans')
                            .insert({
                            name: plan.name,
                            description: plan.description,
                            price: plan.price,
                            interval: plan.interval,
                            stripe_price_id: plan.stripePriceId,
                            is_active: plan.active,
                            features: plan.features
                        })
                            .select()
                            .single()];
                    case 3:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                id: data.id,
                                name: data.name,
                                description: data.description,
                                price: data.price,
                                interval: data.interval,
                                stripePriceId: data.stripe_price_id,
                                active: data.is_active,
                                features: data.features || [],
                                subscriberCount: 0,
                                createdAt: data.created_at,
                                updatedAt: data.updated_at
                            }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_6 = _b.sent();
                        console.error('Error saving subscription plan:', err_6);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update user
     */
    updateUser: function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .update({
                                name: user.name,
                                role: user.role,
                                department: user.department,
                                is_active: user.is_active,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', user.id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_7 = _a.sent();
                        console.error('Error updating user:', err_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Save organization
     */
    saveOrganization: function (organization) {
        return __awaiter(this, void 0, void 0, function () {
            var error, _a, data, error, err_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!organization.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('organizations')
                                .update({
                                name: organization.name,
                                industry: organization.industry,
                                address: organization.address,
                                phone: organization.phone,
                                website: organization.website,
                                logo_url: organization.logoUrl,
                                primary_contact_name: organization.primaryContactName,
                                primary_contact_email: organization.primaryContactEmail,
                                max_users: organization.maxUsers,
                                is_active: organization.isActive,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', organization.id)];
                    case 1:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, organization];
                    case 2: return [4 /*yield*/, api_service_1.supabase
                            .from('organizations')
                            .insert({
                            name: organization.name,
                            industry: organization.industry,
                            address: organization.address,
                            phone: organization.phone,
                            website: organization.website,
                            logo_url: organization.logoUrl,
                            primary_contact_name: organization.primaryContactName,
                            primary_contact_email: organization.primaryContactEmail,
                            max_users: organization.maxUsers,
                            is_active: organization.isActive
                        })
                            .select()
                            .single()];
                    case 3:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                id: data.id,
                                name: data.name,
                                industry: data.industry,
                                address: data.address,
                                phone: data.phone,
                                website: data.website,
                                logoUrl: data.logo_url,
                                primaryContactName: data.primary_contact_name,
                                primaryContactEmail: data.primary_contact_email,
                                maxUsers: data.max_users,
                                currentUserCount: 0,
                                isActive: data.is_active,
                                createdAt: data.created_at,
                                updatedAt: data.updated_at
                            }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_8 = _b.sent();
                        console.error('Error saving organization:', err_8);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Save system settings
     */
    saveSystemSettings: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var settingsToUpdate, _i, settingsToUpdate_1, setting, updateError, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        settingsToUpdate = [
                            { key: 'stripe_secret_key', value: settings.stripeSecretKey, encrypted: true, category: 'payment' },
                            { key: 'stripe_webhook_secret', value: settings.stripeWebhookSecret, encrypted: true, category: 'payment' },
                            { key: 'openai_api_key', value: settings.openaiApiKey, encrypted: true, category: 'ai' },
                            { key: 'ai_default_model', value: settings.ai.defaultModel, encrypted: false, category: 'ai' },
                            { key: 'ai_temperature', value: settings.ai.temperature.toString(), encrypted: false, category: 'ai' },
                            { key: 'ai_max_tokens', value: settings.ai.maxTokens.toString(), encrypted: false, category: 'ai' },
                            { key: 'ai_timeout', value: settings.ai.timeout.toString(), encrypted: false, category: 'ai' },
                            { key: 'backup_enabled', value: settings.backup.enabled.toString(), encrypted: false, category: 'backup' },
                            { key: 'backup_frequency', value: settings.backup.frequency, encrypted: false, category: 'backup' },
                            { key: 'backup_retention_days', value: settings.backup.retentionDays.toString(), encrypted: false, category: 'backup' }
                        ];
                        _i = 0, settingsToUpdate_1 = settingsToUpdate;
                        _a.label = 1;
                    case 1:
                        if (!(_i < settingsToUpdate_1.length)) return [3 /*break*/, 4];
                        setting = settingsToUpdate_1[_i];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('system_settings')
                                .update({
                                value: setting.value,
                                updated_at: new Date().toISOString()
                            })
                                .eq('key', setting.key)];
                    case 2:
                        updateError = (_a.sent()).error;
                        if (updateError) {
                            console.error("Error updating setting ".concat(setting.key, ":"), updateError);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                    case 5:
                        err_9 = _a.sent();
                        console.error('Error saving system settings:', err_9);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Trigger manual backup
     */
    triggerManualBackup: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('system_logs')
                                .insert({
                                level: 'INFO',
                                message: 'Manual backup triggered by admin',
                                context: { source: 'admin-panel', type: 'manual-backup' }
                            })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        // Simulate backup process
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                    case 2:
                        // Simulate backup process
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_10 = _a.sent();
                        console.error('Error triggering manual backup:', err_10);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
