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
exports.organizationService = void 0;
var api_service_1 = require("./api.service");
exports.organizationService = {
    /**
     * Fetch the current user's organization
     */
    fetchOrganization: function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, userData, userError, _b, data, error, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 1:
                        user = (_c.sent()).data.user;
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('organization_id')
                                .eq('id', user.id)
                                .single()];
                    case 2:
                        _a = _c.sent(), userData = _a.data, userError = _a.error;
                        if (userError)
                            throw userError;
                        if (!(userData === null || userData === void 0 ? void 0 : userData.organization_id))
                            return [2 /*return*/, null];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('organizations')
                                .select('*')
                                .eq('id', userData.organization_id)
                                .single()];
                    case 3:
                        _b = _c.sent(), data = _b.data, error = _b.error;
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
                                primaryContactPhone: data.primary_contact_phone,
                                subscriptionId: data.subscription_id,
                                subscriptionStatus: data.subscription_status,
                                planId: data.plan_id,
                                maxUsers: data.max_users,
                                currentUserCount: data.current_user_count,
                                settings: data.settings,
                                isActive: data.is_active,
                                createdAt: data.created_at,
                                updatedAt: data.updated_at
                            }];
                    case 4:
                        err_1 = _c.sent();
                        console.error('Error fetching organization:', err_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch organization users
     */
    fetchUsers: function (organizationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('organization_id', organizationId)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                    case 2:
                        err_2 = _b.sent();
                        console.error('Error fetching organization users:', err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch pending invites
     */
    fetchInvites: function (organizationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('invites')
                                .select('*')
                                .eq('organization_id', organizationId)
                                .eq('status', 'pending')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data.map(function (invite) { return ({
                                id: invite.id,
                                organizationId: invite.organization_id,
                                email: invite.email,
                                role: invite.role,
                                department: invite.department,
                                status: invite.status,
                                createdBy: invite.created_by,
                                createdAt: invite.created_at,
                                expiresAt: invite.expires_at
                            }); }) || []];
                    case 2:
                        err_3 = _b.sent();
                        console.error('Error fetching invites:', err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Invite a user to the organization
     */
    inviteUser: function (organizationId, email, role, department) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, data, error, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('invites')
                                .insert({
                                organization_id: organizationId,
                                email: email,
                                role: role,
                                department: department,
                                created_by: user.id,
                                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
                            })
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                id: data.id,
                                organizationId: data.organization_id,
                                email: data.email,
                                role: data.role,
                                department: data.department,
                                status: data.status,
                                createdBy: data.created_by,
                                createdAt: data.created_at,
                                expiresAt: data.expires_at
                            }];
                    case 3:
                        err_4 = _b.sent();
                        console.error('Error inviting user:', err_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Cancel an invite
     */
    cancelInvite: function (inviteId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('invites')
                                .delete()
                                .eq('id', inviteId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_5 = _a.sent();
                        console.error('Error cancelling invite:', err_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update a user
     */
    updateUser: function (userId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .update({
                                name: updates.name,
                                role: updates.role,
                                department: updates.department,
                                is_active: updates.is_active,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', userId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_6 = _a.sent();
                        console.error('Error updating user:', err_6);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update organization
     */
    updateOrganization: function (organizationId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('organizations')
                                .update({
                                name: updates.name,
                                industry: updates.industry,
                                address: updates.address,
                                phone: updates.phone,
                                website: updates.website,
                                logo_url: updates.logoUrl,
                                primary_contact_name: updates.primaryContactName,
                                primary_contact_email: updates.primaryContactEmail,
                                primary_contact_phone: updates.primaryContactPhone,
                                settings: updates.settings,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', organizationId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_7 = _a.sent();
                        console.error('Error updating organization:', err_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch departments
     */
    fetchDepartments: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('departments')
                                .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                    case 2:
                        err_8 = _b.sent();
                        console.error('Error fetching departments:', err_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Add a department
     */
    addDepartment: function (department) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('departments')
                                .insert({
                                id: department.id,
                                name: department.name,
                                description: department.description,
                                department_type: department.department_type,
                                supervisor_id: department.supervisor_id
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                    case 2:
                        err_9 = _b.sent();
                        console.error('Error adding department:', err_9);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
