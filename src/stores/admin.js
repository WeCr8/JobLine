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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var admin_service_1 = require("../services/admin.service");
exports.useAdminStore = (0, pinia_1.defineStore)('admin', function () {
    var subscriptionPlans = (0, vue_1.ref)([]);
    var activeSubscriptions = (0, vue_1.ref)([]);
    var users = (0, vue_1.ref)([]);
    var organizations = (0, vue_1.ref)([]);
    var systemLogs = (0, vue_1.ref)([]);
    var analytics = (0, vue_1.ref)({
        totalRevenue: 0,
        revenueGrowth: 0,
        activeUsers: 0,
        userGrowth: 0,
        conversionRate: 0,
        conversionGrowth: 0,
        churnRate: 0,
        churnChange: 0,
        monthlyRevenue: [],
        monthlyUsers: [],
        planDistribution: {}
    });
    var systemSettings = (0, vue_1.ref)({
        stripeSecretKey: '',
        stripeWebhookSecret: '',
        openaiApiKey: '',
        ai: {
            defaultModel: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2000,
            timeout: 30000
        },
        backup: {
            enabled: true,
            frequency: 'daily',
            retentionDays: 30
        }
    });
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    // Fetch subscription plans
    var fetchSubscriptionPlans = function () { return __awaiter(void 0, void 0, void 0, function () {
        var plans, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.fetchSubscriptionPlans()];
                case 2:
                    plans = _a.sent();
                    subscriptionPlans.value = plans;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    console.error('Error fetching subscription plans:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch active subscriptions
    var fetchActiveSubscriptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loading.value = true;
            error.value = null;
            try {
                // In a real app, you would fetch from the database with a join
                // For now, we'll use mock data
                activeSubscriptions.value = [
                    {
                        id: '1',
                        userId: 'user-1',
                        userName: 'John Smith',
                        userEmail: 'john@example.com',
                        customerId: 'cus_123456',
                        subscriptionId: 'sub_123456',
                        planName: 'Basic Plan',
                        priceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
                        status: 'active',
                        startDate: '2024-01-01T00:00:00Z',
                        nextBillingDate: '2024-02-01T00:00:00Z',
                        amount: 2999,
                        interval: 'monthly',
                        cancelAtPeriodEnd: false,
                        paymentMethodBrand: 'visa',
                        paymentMethodLast4: '4242',
                        customerSince: '2024-01-01T00:00:00Z',
                        invoices: [
                            {
                                id: 'in_123456',
                                date: '2024-01-01T00:00:00Z',
                                amount: 2999,
                                status: 'paid'
                            }
                        ]
                    },
                    {
                        id: '2',
                        userId: 'user-2',
                        userName: 'Sarah Johnson',
                        userEmail: 'sarah@example.com',
                        customerId: 'cus_234567',
                        subscriptionId: 'sub_234567',
                        planName: 'Pro Plan',
                        priceId: 'price_2RbnOfE7qtcuEIptjDemZiVn',
                        status: 'active',
                        startDate: '2024-01-15T00:00:00Z',
                        nextBillingDate: '2024-02-15T00:00:00Z',
                        amount: 4999,
                        interval: 'monthly',
                        cancelAtPeriodEnd: false,
                        paymentMethodBrand: 'mastercard',
                        paymentMethodLast4: '5678',
                        customerSince: '2024-01-15T00:00:00Z',
                        invoices: [
                            {
                                id: 'in_234567',
                                date: '2024-01-15T00:00:00Z',
                                amount: 4999,
                                status: 'paid'
                            }
                        ]
                    }
                ];
            }
            catch (err) {
                error.value = err.message;
                console.error('Error fetching active subscriptions:', err);
            }
            finally {
                loading.value = false;
            }
            return [2 /*return*/];
        });
    }); };
    // Fetch users
    var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedUsers, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.fetchUsers()];
                case 2:
                    fetchedUsers = _a.sent();
                    users.value = fetchedUsers;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    error.value = err_2.message;
                    console.error('Error fetching users:', err_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch organizations
    var fetchOrganizations = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedOrgs, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.fetchOrganizations()];
                case 2:
                    fetchedOrgs = _a.sent();
                    organizations.value = fetchedOrgs;
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    console.error('Error fetching organizations:', err_3);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch analytics data
    var fetchAnalytics = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loading.value = true;
            error.value = null;
            try {
                // In a real app, you would calculate analytics from database data
                // For now, we'll use mock data
                analytics.value = {
                    totalRevenue: 12500,
                    revenueGrowth: 15,
                    activeUsers: 85,
                    userGrowth: 12,
                    conversionRate: 8.5,
                    conversionGrowth: 2.3,
                    churnRate: 3.2,
                    churnChange: -0.5,
                    monthlyRevenue: [8500, 9200, 10100, 9800, 11200, 12500],
                    monthlyUsers: [65, 70, 72, 78, 80, 85],
                    planDistribution: {
                        'Basic Plan': 45,
                        'Pro Plan': 28,
                        'Enterprise Plan': 12
                    }
                };
            }
            catch (err) {
                error.value = err.message;
                console.error('Error fetching analytics:', err);
            }
            finally {
                loading.value = false;
            }
            return [2 /*return*/];
        });
    }); };
    // Fetch system settings
    var fetchSystemSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.fetchSystemSettings()];
                case 2:
                    settings = _a.sent();
                    if (settings) {
                        systemSettings.value = settings;
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    error.value = err_4.message;
                    console.error('Error fetching system settings:', err_4);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch system logs
    var fetchSystemLogs = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (limit) {
            var logs, err_5;
            if (limit === void 0) { limit = 100; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, admin_service_1.adminService.fetchSystemLogs(limit)];
                    case 2:
                        logs = _a.sent();
                        systemLogs.value = logs;
                        return [3 /*break*/, 5];
                    case 3:
                        err_5 = _a.sent();
                        error.value = err_5.message;
                        console.error('Error fetching system logs:', err_5);
                        return [3 /*break*/, 5];
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Create or update subscription plan
    var saveSubscriptionPlan = function (plan) { return __awaiter(void 0, void 0, void 0, function () {
        var savedPlan, index, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.saveSubscriptionPlan(plan)];
                case 2:
                    savedPlan = _a.sent();
                    if (!savedPlan) {
                        throw new Error('Failed to save subscription plan');
                    }
                    if (plan.id) {
                        index = subscriptionPlans.value.findIndex(function (p) { return p.id === plan.id; });
                        if (index !== -1) {
                            subscriptionPlans.value[index] = savedPlan;
                        }
                    }
                    else {
                        // Add to local state
                        subscriptionPlans.value.push(savedPlan);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_6 = _a.sent();
                    error.value = err_6.message;
                    console.error('Error saving subscription plan:', err_6);
                    throw err_6;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update user
    var updateUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var success, index, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.updateUser(user)];
                case 2:
                    success = _a.sent();
                    if (!success) {
                        throw new Error('Failed to update user');
                    }
                    index = users.value.findIndex(function (u) { return u.id === user.id; });
                    if (index !== -1) {
                        users.value[index] = __assign({}, user);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_7 = _a.sent();
                    error.value = err_7.message;
                    console.error('Error updating user:', err_7);
                    throw err_7;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Create or update organization
    var saveOrganization = function (organization) { return __awaiter(void 0, void 0, void 0, function () {
        var savedOrg, index, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.saveOrganization(organization)];
                case 2:
                    savedOrg = _a.sent();
                    if (!savedOrg) {
                        throw new Error('Failed to save organization');
                    }
                    if (organization.id) {
                        index = organizations.value.findIndex(function (o) { return o.id === organization.id; });
                        if (index !== -1) {
                            organizations.value[index] = __assign({}, savedOrg);
                        }
                    }
                    else {
                        // Add to local state
                        organizations.value.push(savedOrg);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_8 = _a.sent();
                    error.value = err_8.message;
                    console.error('Error saving organization:', err_8);
                    throw err_8;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Cancel subscription
    var cancelSubscription = function (subscriptionId) { return __awaiter(void 0, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            loading.value = true;
            error.value = null;
            try {
                index = activeSubscriptions.value.findIndex(function (s) { return s.subscriptionId === subscriptionId; });
                if (index !== -1) {
                    activeSubscriptions.value[index].status = 'canceled';
                    activeSubscriptions.value[index].cancelAtPeriodEnd = true;
                }
            }
            catch (err) {
                error.value = err.message;
                console.error('Error cancelling subscription:', err);
                throw err;
            }
            finally {
                loading.value = false;
            }
            return [2 /*return*/];
        });
    }); };
    // Save system settings
    var saveSystemSettings = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.saveSystemSettings(settings)];
                case 2:
                    success = _a.sent();
                    if (!success) {
                        throw new Error('Failed to save system settings');
                    }
                    // Update local state
                    systemSettings.value = __assign({}, settings);
                    return [3 /*break*/, 5];
                case 3:
                    err_9 = _a.sent();
                    error.value = err_9.message;
                    console.error('Error saving system settings:', err_9);
                    throw err_9;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Trigger manual backup
    var triggerManualBackup = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, admin_service_1.adminService.triggerManualBackup()];
                case 2:
                    success = _a.sent();
                    if (!success) {
                        throw new Error('Failed to trigger manual backup');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_10 = _a.sent();
                    error.value = err_10.message;
                    console.error('Error triggering manual backup:', err_10);
                    throw err_10;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Computed properties
    var totalUsers = (0, vue_1.computed)(function () { return users.value.length; });
    var activeUsers = (0, vue_1.computed)(function () { return users.value.filter(function (u) { return u.is_active; }).length; });
    var totalRevenue = (0, vue_1.computed)(function () {
        return activeSubscriptions.value.reduce(function (total, sub) { return total + sub.amount; }, 0);
    });
    var platformAdmins = (0, vue_1.computed)(function () {
        return users.value.filter(function (u) { return u.role === 'admin' && !u.organization_id; });
    });
    var organizationAdmins = (0, vue_1.computed)(function () {
        return users.value.filter(function (u) { return u.role === 'organization_admin'; });
    });
    return {
        subscriptionPlans: subscriptionPlans,
        activeSubscriptions: activeSubscriptions,
        users: users,
        organizations: organizations,
        systemLogs: systemLogs,
        analytics: analytics,
        systemSettings: systemSettings,
        loading: loading,
        error: error,
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        totalRevenue: totalRevenue,
        platformAdmins: platformAdmins,
        organizationAdmins: organizationAdmins,
        fetchSubscriptionPlans: fetchSubscriptionPlans,
        fetchActiveSubscriptions: fetchActiveSubscriptions,
        fetchUsers: fetchUsers,
        fetchOrganizations: fetchOrganizations,
        fetchAnalytics: fetchAnalytics,
        fetchSystemSettings: fetchSystemSettings,
        fetchSystemLogs: fetchSystemLogs,
        saveSubscriptionPlan: saveSubscriptionPlan,
        updateUser: updateUser,
        saveOrganization: saveOrganization,
        cancelSubscription: cancelSubscription,
        saveSystemSettings: saveSystemSettings,
        triggerManualBackup: triggerManualBackup
    };
});
