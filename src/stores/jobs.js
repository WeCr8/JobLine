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
exports.useJobsStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var jobs_service_1 = require("../services/jobs.service");
var demo_service_1 = require("../services/demo.service");
var auth_1 = require("./auth");
exports.useJobsStore = (0, pinia_1.defineStore)('jobs', function () {
    var jobs = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var authStore = (0, auth_1.useAuthStore)();
    var fetchJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedJobs, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_b = (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.includes('demo')))) return [3 /*break*/, 2];
                    // Use hardcoded demo data
                    jobs.value = demo_service_1.demoService.getDemoData('jobs');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, jobs_service_1.jobsService.fetchJobs()];
                case 3:
                    fetchedJobs = _c.sent();
                    jobs.value = fetchedJobs;
                    _c.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_1 = _c.sent();
                    error.value = err_1.message;
                    console.error('Error fetching jobs:', err_1);
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var updateJobStatus = function (jobId, status, notes) { return __awaiter(void 0, void 0, void 0, function () {
        var job, oldStatus, historyEntry, success, job, oldStatus, historyEntry, err_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_b = (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.includes('demo')))) return [3 /*break*/, 2];
                    job = jobs.value.find(function (j) { return j.id === jobId; });
                    if (job) {
                        oldStatus = job.status;
                        job.status = status;
                        job.updatedAt = new Date().toISOString();
                        if (notes)
                            job.notes = notes;
                        historyEntry = {
                            id: Date.now().toString(),
                            timestamp: new Date().toISOString(),
                            userId: 'current-user',
                            userName: ((_c = authStore.user) === null || _c === void 0 ? void 0 : _c.name) || 'Demo User',
                            action: 'status-changed',
                            field: 'status',
                            oldValue: oldStatus,
                            newValue: status,
                            notes: notes
                        };
                        job.history.unshift(historyEntry);
                    }
                    return [2 /*return*/, true];
                case 2: return [4 /*yield*/, jobs_service_1.jobsService.updateJobStatus(jobId, status, notes)];
                case 3:
                    success = _e.sent();
                    if (success) {
                        job = jobs.value.find(function (j) { return j.id === jobId; });
                        if (job) {
                            oldStatus = job.status;
                            job.status = status;
                            job.updatedAt = new Date().toISOString();
                            if (notes)
                                job.notes = notes;
                            historyEntry = {
                                id: Date.now().toString(),
                                timestamp: new Date().toISOString(),
                                userId: 'current-user',
                                userName: ((_d = authStore.user) === null || _d === void 0 ? void 0 : _d.name) || 'Current User',
                                action: 'status-changed',
                                field: 'status',
                                oldValue: oldStatus,
                                newValue: status,
                                notes: notes
                            };
                            job.history.unshift(historyEntry);
                        }
                    }
                    return [2 /*return*/, success];
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_2 = _e.sent();
                    error.value = err_2.message;
                    console.error('Error updating job status:', err_2);
                    return [2 /*return*/, false];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var updateJobProgress = function (jobId, completedQuantity) { return __awaiter(void 0, void 0, void 0, function () {
        var job, oldQuantity, historyEntry, success, job, oldQuantity, historyEntry, err_3;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_b = (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.includes('demo')))) return [3 /*break*/, 2];
                    job = jobs.value.find(function (j) { return j.id === jobId; });
                    if (job) {
                        oldQuantity = job.completedQuantity;
                        job.completedQuantity = Math.min(completedQuantity, job.quantity);
                        job.updatedAt = new Date().toISOString();
                        if (job.completedQuantity === job.quantity) {
                            job.status = 'completed';
                        }
                        historyEntry = {
                            id: Date.now().toString(),
                            timestamp: new Date().toISOString(),
                            userId: 'current-user',
                            userName: ((_c = authStore.user) === null || _c === void 0 ? void 0 : _c.name) || 'Demo User',
                            action: 'quantity-updated',
                            field: 'completedQuantity',
                            oldValue: oldQuantity,
                            newValue: completedQuantity,
                            notes: "Updated completed quantity from ".concat(oldQuantity, " to ").concat(completedQuantity)
                        };
                        job.history.unshift(historyEntry);
                    }
                    return [2 /*return*/, true];
                case 2: return [4 /*yield*/, jobs_service_1.jobsService.updateJobProgress(jobId, completedQuantity)];
                case 3:
                    success = _e.sent();
                    if (success) {
                        job = jobs.value.find(function (j) { return j.id === jobId; });
                        if (job) {
                            oldQuantity = job.completedQuantity;
                            job.completedQuantity = Math.min(completedQuantity, job.quantity);
                            job.updatedAt = new Date().toISOString();
                            if (job.completedQuantity === job.quantity) {
                                job.status = 'completed';
                            }
                            historyEntry = {
                                id: Date.now().toString(),
                                timestamp: new Date().toISOString(),
                                userId: 'current-user',
                                userName: ((_d = authStore.user) === null || _d === void 0 ? void 0 : _d.name) || 'Current User',
                                action: 'quantity-updated',
                                field: 'completedQuantity',
                                oldValue: oldQuantity,
                                newValue: completedQuantity,
                                notes: "Updated completed quantity from ".concat(oldQuantity, " to ").concat(completedQuantity)
                            };
                            job.history.unshift(historyEntry);
                        }
                    }
                    return [2 /*return*/, success];
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_3 = _e.sent();
                    error.value = err_3.message;
                    console.error('Error updating job progress:', err_3);
                    return [2 /*return*/, false];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getJobById = function (jobId) {
        return jobs.value.find(function (job) { return job.id === jobId; });
    };
    // Computed properties
    var activeJobs = (0, vue_1.computed)(function () {
        return jobs.value.filter(function (job) { return ['running', 'setup', 'on-hold'].includes(job.status); });
    });
    var completedJobs = (0, vue_1.computed)(function () {
        return jobs.value.filter(function (job) { return job.status === 'completed'; });
    });
    var urgentJobs = (0, vue_1.computed)(function () {
        return jobs.value.filter(function (job) { return job.priority === 'urgent' && job.status !== 'completed'; });
    });
    var jobsByStatus = (0, vue_1.computed)(function () {
        var statusCounts = {
            pending: 0,
            setup: 0,
            running: 0,
            'on-hold': 0,
            completed: 0
        };
        jobs.value.forEach(function (job) {
            statusCounts[job.status]++;
        });
        return statusCounts;
    });
    return {
        jobs: jobs,
        loading: loading,
        error: error,
        activeJobs: activeJobs,
        completedJobs: completedJobs,
        urgentJobs: urgentJobs,
        jobsByStatus: jobsByStatus,
        fetchJobs: fetchJobs,
        updateJobStatus: updateJobStatus,
        updateJobProgress: updateJobProgress,
        getJobById: getJobById
    };
});
