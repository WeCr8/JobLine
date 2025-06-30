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
exports.useOrganizationStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var organization_service_1 = require("../services/organization.service");
exports.useOrganizationStore = (0, pinia_1.defineStore)('organization', function () {
    var organization = (0, vue_1.ref)(null);
    var users = (0, vue_1.ref)([]);
    var invites = (0, vue_1.ref)([]);
    var departments = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    // Fetch current user's organization
    var fetchOrganization = function () { return __awaiter(void 0, void 0, void 0, function () {
        var org, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.fetchOrganization()];
                case 2:
                    org = _a.sent();
                    organization.value = org;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    console.error('Error fetching organization:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch organization users
    var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedUsers, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!organization.value)
                        return [2 /*return*/];
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.fetchUsers(organization.value.id)];
                case 2:
                    fetchedUsers = _a.sent();
                    users.value = fetchedUsers;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    error.value = err_2.message;
                    console.error('Error fetching organization users:', err_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch pending invites
    var fetchInvites = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedInvites, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!organization.value)
                        return [2 /*return*/];
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.fetchInvites(organization.value.id)];
                case 2:
                    fetchedInvites = _a.sent();
                    invites.value = fetchedInvites;
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    console.error('Error fetching invites:', err_3);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch departments
    var fetchDepartments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedDepartments, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.fetchDepartments()];
                case 2:
                    fetchedDepartments = _a.sent();
                    departments.value = fetchedDepartments;
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    error.value = err_4.message;
                    console.error('Error fetching departments:', err_4);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update organization
    var updateOrganization = function (updates) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!organization.value)
                        return [2 /*return*/, false];
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.updateOrganization(organization.value.id, updates)];
                case 2:
                    success = _a.sent();
                    if (success && organization.value) {
                        organization.value = __assign(__assign({}, organization.value), updates);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_5 = _a.sent();
                    error.value = err_5.message;
                    console.error('Error updating organization:', err_5);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Invite user to organization
    var inviteUser = function (email, role, department) { return __awaiter(void 0, void 0, void 0, function () {
        var invite, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!organization.value)
                        return [2 /*return*/, null];
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.inviteUser(organization.value.id, email, role, department)];
                case 2:
                    invite = _a.sent();
                    if (invite) {
                        invites.value.push(invite);
                    }
                    return [2 /*return*/, invite];
                case 3:
                    err_6 = _a.sent();
                    error.value = err_6.message;
                    console.error('Error inviting user:', err_6);
                    return [2 /*return*/, null];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Cancel invite
    var cancelInvite = function (inviteId) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.cancelInvite(inviteId)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        invites.value = invites.value.filter(function (invite) { return invite.id !== inviteId; });
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_7 = _a.sent();
                    error.value = err_7.message;
                    console.error('Error cancelling invite:', err_7);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update user
    var updateUser = function (userId, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var success, index, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.updateUser(userId, updates)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        index = users.value.findIndex(function (u) { return u.id === userId; });
                        if (index !== -1) {
                            users.value[index] = __assign(__assign({}, users.value[index]), updates);
                        }
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_8 = _a.sent();
                    error.value = err_8.message;
                    console.error('Error updating user:', err_8);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Add department
    var addDepartment = function (department) { return __awaiter(void 0, void 0, void 0, function () {
        var newDept, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, organization_service_1.organizationService.addDepartment(department)];
                case 2:
                    newDept = _a.sent();
                    if (newDept) {
                        departments.value.push(newDept);
                    }
                    return [2 /*return*/, newDept];
                case 3:
                    err_9 = _a.sent();
                    error.value = err_9.message;
                    console.error('Error adding department:', err_9);
                    return [2 /*return*/, null];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Computed properties
    var organizationName = (0, vue_1.computed)(function () { var _a; return ((_a = organization.value) === null || _a === void 0 ? void 0 : _a.name) || 'Organization'; });
    var userCount = (0, vue_1.computed)(function () { return users.value.length; });
    var activeUserCount = (0, vue_1.computed)(function () { return users.value.filter(function (u) { return u.is_active; }).length; });
    var pendingInviteCount = (0, vue_1.computed)(function () { return invites.value.length; });
    return {
        organization: organization,
        users: users,
        invites: invites,
        departments: departments,
        loading: loading,
        error: error,
        organizationName: organizationName,
        userCount: userCount,
        activeUserCount: activeUserCount,
        pendingInviteCount: pendingInviteCount,
        fetchOrganization: fetchOrganization,
        fetchUsers: fetchUsers,
        fetchInvites: fetchInvites,
        fetchDepartments: fetchDepartments,
        updateOrganization: updateOrganization,
        inviteUser: inviteUser,
        cancelInvite: cancelInvite,
        updateUser: updateUser,
        addDepartment: addDepartment
    };
});
