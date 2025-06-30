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
exports.useAuthStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var auth_service_1 = require("../services/auth.service");
exports.useAuthStore = (0, pinia_1.defineStore)('auth', function () {
    var user = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var isAuthenticated = (0, vue_1.computed)(function () { return !!user.value; });
    var isPlatformAdmin = (0, vue_1.computed)(function () { var _a, _b; return ((_a = user.value) === null || _a === void 0 ? void 0 : _a.role) === 'admin' && !((_b = user.value) === null || _b === void 0 ? void 0 : _b.organization_id); });
    var isOrgAdmin = (0, vue_1.computed)(function () { var _a, _b, _c; return ((_a = user.value) === null || _a === void 0 ? void 0 : _a.role) === 'organization_admin' || (((_b = user.value) === null || _b === void 0 ? void 0 : _b.role) === 'admin' && !!((_c = user.value) === null || _c === void 0 ? void 0 : _c.organization_id)); });
    var signUp = function (email, password, name) { return __awaiter(void 0, void 0, void 0, function () {
        var result, userData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, auth_service_1.authService.signUp(email, password, name)];
                case 2:
                    result = _a.sent();
                    if (result.error) {
                        error.value = result.error;
                        return [2 /*return*/, { data: null, error: result.error }];
                    }
                    if (result.data.user) {
                        // Store demo user email for persistence
                        if (import.meta.env.VITE_DEMO_MODE === 'true') {
                            localStorage.setItem('demoUserEmail', email);
                        }
                        userData = result.data.user.user_metadata;
                        user.value = {
                            id: result.data.user.id,
                            email: result.data.user.email,
                            name: (userData === null || userData === void 0 ? void 0 : userData.name) || name,
                            role: (userData === null || userData === void 0 ? void 0 : userData.role) || 'operator',
                            department: userData === null || userData === void 0 ? void 0 : userData.department,
                            organization_id: userData === null || userData === void 0 ? void 0 : userData.organization_id,
                            is_active: true,
                            created_at: new Date().toISOString()
                        };
                    }
                    return [2 /*return*/, { data: result.data, error: null }];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    return [2 /*return*/, { data: null, error: err_1.message }];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var signIn = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var result, profile, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, auth_service_1.authService.signIn(email, password)];
                case 2:
                    result = _b.sent();
                    if (result.error) {
                        error.value = result.error;
                        return [2 /*return*/, { data: null, error: result.error }];
                    }
                    if (!result.data.user) return [3 /*break*/, 4];
                    return [4 /*yield*/, auth_service_1.authService.getCurrentUser()];
                case 3:
                    profile = _b.sent();
                    if (profile) {
                        user.value = profile;
                    }
                    else {
                        user.value = {
                            id: result.data.user.id,
                            email: result.data.user.email,
                            name: ((_a = result.data.user.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || 'User',
                            role: 'operator',
                            department: 'Manufacturing',
                            is_active: true,
                            created_at: new Date().toISOString()
                        };
                    }
                    _b.label = 4;
                case 4: return [2 /*return*/, { data: result.data, error: null }];
                case 5:
                    err_2 = _b.sent();
                    error.value = err_2.message;
                    return [2 /*return*/, { data: null, error: err_2.message }];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var signOut = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, auth_service_1.authService.signOut()];
                case 2:
                    result = _a.sent();
                    if (result.error) {
                        error.value = result.error;
                        return [2 /*return*/, { error: result.error }];
                    }
                    // Clear demo user email
                    if (import.meta.env.VITE_DEMO_MODE === 'true') {
                        localStorage.removeItem('demoUserEmail');
                    }
                    user.value = null;
                    return [2 /*return*/, { error: null }];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    return [2 /*return*/, { error: err_3.message }];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var initAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
        var session, profile, err_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loading.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, auth_service_1.authService.getSession()];
                case 2:
                    session = _b.sent();
                    if (!(session === null || session === void 0 ? void 0 : session.user)) return [3 /*break*/, 4];
                    return [4 /*yield*/, auth_service_1.authService.getCurrentUser()];
                case 3:
                    profile = _b.sent();
                    if (profile) {
                        user.value = profile;
                    }
                    else {
                        user.value = {
                            id: session.user.id,
                            email: session.user.email,
                            name: ((_a = session.user.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || 'User',
                            role: 'operator',
                            department: 'Manufacturing',
                            is_active: true,
                            created_at: new Date().toISOString()
                        };
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_4 = _b.sent();
                    console.error('Error initializing auth:', err_4);
                    error.value = err_4.message;
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7:
                    // Listen for auth changes
                    auth_service_1.authService.onAuthStateChange(function (event, session) { return __awaiter(void 0, void 0, void 0, function () {
                        var profile;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(event === 'SIGNED_IN' && (session === null || session === void 0 ? void 0 : session.user))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, auth_service_1.authService.getCurrentUser()];
                                case 1:
                                    profile = _b.sent();
                                    if (profile) {
                                        user.value = profile;
                                    }
                                    else {
                                        user.value = {
                                            id: session.user.id,
                                            email: session.user.email,
                                            name: ((_a = session.user.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || 'User',
                                            role: 'operator',
                                            department: 'Manufacturing',
                                            is_active: true,
                                            created_at: new Date().toISOString()
                                        };
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (event === 'SIGNED_OUT') {
                                        user.value = null;
                                    }
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); };
    // Legacy method for backward compatibility
    var login = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, signIn(email, password)];
        });
    }); };
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, signOut()];
        });
    }); };
    return {
        user: user,
        loading: loading,
        error: error,
        isAuthenticated: isAuthenticated,
        isPlatformAdmin: isPlatformAdmin,
        isOrgAdmin: isOrgAdmin,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        initAuth: initAuth,
        login: login,
        logout: logout
    };
});
