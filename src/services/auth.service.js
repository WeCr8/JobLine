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
exports.authService = void 0;
var api_service_1 = require("./api.service");
var demo_service_1 = require("./demo.service");
// Demo accounts for testing
var demoAccounts = {
    'demo-org-admin@wecr8.info': {
        id: 'demo-admin-id',
        email: 'demo-org-admin@wecr8.info',
        name: 'Organization Admin',
        role: 'organization_admin',
        department: 'Administration',
        organization_id: 'org-1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z'
    },
    'demo-operator@wecr8.info': {
        id: 'demo-operator-id',
        email: 'demo-operator@wecr8.info',
        name: 'John Operator',
        role: 'operator',
        department: 'cnc-machining',
        organization_id: 'org-1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z'
    }
};
// Check if demo mode is enabled
var isDemoMode = function () {
    return import.meta.env.VITE_DEMO_MODE === 'true';
};
exports.authService = {
    /**
     * Sign up a new user
     */
    signUp: function (email, password, name) {
        return __awaiter(this, void 0, void 0, function () {
            var demoUser, _a, data, error, _b, inviteData, inviteError, role, organization_id, department, profileError, updateInviteError, orgUserError, err_1, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 10, , 11]);
                        // Check for demo mode
                        if (isDemoMode()) {
                            demoUser = {
                                id: "demo-".concat(Date.now()),
                                email: email,
                                name: name,
                                role: 'operator',
                                department: 'cnc-machining',
                                organization_id: 'org-1',
                                is_active: true,
                                created_at: new Date().toISOString()
                            };
                            // Store in localStorage for persistence
                            localStorage.setItem('demoUserEmail', email);
                            return [2 /*return*/, {
                                    data: {
                                        user: {
                                            id: demoUser.id,
                                            email: email,
                                            user_metadata: { name: name }
                                        }
                                    },
                                    error: null
                                }];
                        }
                        return [4 /*yield*/, api_service_1.supabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                    data: { name: name }
                                }
                            })];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('invites')
                                .select('*')
                                .eq('email', email)
                                .eq('status', 'pending')
                                .maybeSingle()];
                    case 2:
                        _b = _c.sent(), inviteData = _b.data, inviteError = _b.error;
                        if (inviteError && inviteError.code !== 'PGRST116') {
                            console.error('Error checking for invites:', inviteError);
                        }
                        role = 'operator';
                        organization_id = null;
                        department = null;
                        // If there's an invite, use its role and organization
                        if (inviteData) {
                            role = inviteData.role;
                            organization_id = inviteData.organization_id;
                            department = inviteData.department;
                        }
                        if (!data.user) return [3 /*break*/, 9];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .insert({
                                id: data.user.id,
                                email: data.user.email,
                                name: name,
                                role: role,
                                organization_id: organization_id,
                                department: department
                            })];
                    case 4:
                        profileError = (_c.sent()).error;
                        if (profileError) {
                            console.error('Error creating user profile:', profileError);
                            // Don't throw here, continue with the process
                        }
                        if (!inviteData) return [3 /*break*/, 7];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('invites')
                                .update({ status: 'accepted' })
                                .eq('id', inviteData.id)];
                    case 5:
                        updateInviteError = (_c.sent()).error;
                        if (updateInviteError) {
                            console.error('Error updating invite status:', updateInviteError);
                        }
                        if (!organization_id) return [3 /*break*/, 7];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('organization_users')
                                .insert({
                                organization_id: organization_id,
                                user_id: data.user.id,
                                role: role,
                                is_admin: role === 'organization_admin'
                            })];
                    case 6:
                        orgUserError = (_c.sent()).error;
                        if (orgUserError) {
                            console.error('Error adding user to organization:', orgUserError);
                        }
                        _c.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _c.sent();
                        console.error('Error in post-signup process:', err_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, { data: data, error: null }];
                    case 10:
                        err_2 = _c.sent();
                        console.error('Sign up error:', err_2);
                        return [2 /*return*/, { data: null, error: err_2.message }];
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Sign in a user
     */
    signIn: function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var demoDataSeeded, seedResult, _a, data, error, profileError, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        if (!(isDemoMode() && email in demoAccounts)) return [3 /*break*/, 3];
                        console.log("Using demo account for ".concat(email));
                        demoDataSeeded = localStorage.getItem('demoDataSeeded');
                        if (!!demoDataSeeded) return [3 /*break*/, 2];
                        // Seed demo data
                        console.log('Seeding demo data...');
                        return [4 /*yield*/, demo_service_1.demoService.seedDemoData()];
                    case 1:
                        seedResult = _b.sent();
                        if (seedResult.success) {
                            // Mark demo data as seeded
                            localStorage.setItem('demoDataSeeded', 'true');
                            console.log('Demo data seeded successfully');
                        }
                        else {
                            console.error('Failed to seed demo data:', seedResult.error);
                        }
                        _b.label = 2;
                    case 2:
                        localStorage.setItem('demoUserEmail', email);
                        return [2 /*return*/, {
                                data: {
                                    user: {
                                        id: demoAccounts[email].id,
                                        email: demoAccounts[email].email
                                    },
                                    session: {
                                        access_token: 'demo-token',
                                        refresh_token: 'demo-refresh-token'
                                    }
                                },
                                error: null
                            }];
                    case 3: return [4 /*yield*/, api_service_1.supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                    case 4:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user) return [3 /*break*/, 7];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('id', data.user.id)
                                .single()];
                    case 5:
                        profileError = (_b.sent()).error;
                        if (profileError) {
                            console.error('Error fetching user profile:', profileError);
                        }
                        // Update last login
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .update({ last_login: new Date().toISOString() })
                                .eq('id', data.user.id)];
                    case 6:
                        // Update last login
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, { data: data, error: null }];
                    case 8:
                        err_3 = _b.sent();
                        console.error('Sign in error:', err_3);
                        return [2 /*return*/, { data: null, error: err_3.message }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Sign out the current user
     */
    signOut: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // In demo mode, just return success
                        if (isDemoMode()) {
                            localStorage.removeItem('demoUserEmail');
                            return [2 /*return*/, { error: null }];
                        }
                        return [4 /*yield*/, api_service_1.supabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, { error: null }];
                    case 2:
                        err_4 = _a.sent();
                        console.error('Sign out error:', err_4);
                        return [2 /*return*/, { error: err_4.message }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get the current session
     */
    getSession: function () {
        return __awaiter(this, void 0, void 0, function () {
            var demoEmail, _a, data, error, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // In demo mode, return a fake session
                        if (isDemoMode()) {
                            demoEmail = localStorage.getItem('demoUserEmail');
                            if (demoEmail && demoEmail in demoAccounts) {
                                return [2 /*return*/, {
                                        access_token: 'demo-token',
                                        refresh_token: 'demo-refresh-token',
                                        user: {
                                            id: demoAccounts[demoEmail].id,
                                            email: demoEmail
                                        }
                                    }];
                            }
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, api_service_1.supabase.auth.getSession()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data.session];
                    case 2:
                        err_5 = _b.sent();
                        console.error('Get session error:', err_5);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get the current user
     */
    getCurrentUser: function () {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, _a, profile, error, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        // Check for demo mode with active session
                        if (isDemoMode()) {
                            email = localStorage.getItem('demoUserEmail');
                            if (email && email in demoAccounts) {
                                return [2 /*return*/, demoAccounts[email]];
                            }
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('id', user.id)
                                .single()];
                    case 2:
                        _a = _b.sent(), profile = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, profile];
                    case 3:
                        err_6 = _b.sent();
                        console.error('Get current user error:', err_6);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Set up auth state change listener
     */
    onAuthStateChange: function (callback) {
        // In demo mode, don't set up real listeners
        if (isDemoMode()) {
            return { data: { subscription: { unsubscribe: function () { } } } };
        }
        return api_service_1.supabase.auth.onAuthStateChange(callback);
    }
};
