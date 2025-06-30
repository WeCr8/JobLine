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
exports.jobsService = void 0;
var api_service_1 = require("./api.service");
exports.jobsService = {
    /**
     * Fetch all jobs
     */
    fetchJobs: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .select("\n          *,\n          operations:job_operations(*),\n          materials:job_materials(*),\n          drawings:job_drawings(*),\n          quality_requirements:quality_requirements(*),\n          history:job_history(*)\n        ")
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        // Process the data to match the expected Job type
                        return [2 /*return*/, (data || []).map(function (job) { return ({
                                id: job.id,
                                jobNumber: job.job_number,
                                partNumber: job.part_number,
                                partName: job.part_name,
                                customer: job.customer,
                                quantity: job.quantity,
                                completedQuantity: job.completed_quantity,
                                status: job.status,
                                priority: job.priority,
                                dueDate: job.due_date,
                                startDate: job.start_date,
                                estimatedHours: job.estimated_hours,
                                actualHours: job.actual_hours,
                                operator: job.operator_id, // Would need to join with users table for name
                                machine: job.machine_id, // Would need to join with machines table for name
                                operation: job.operation || '',
                                notes: job.notes || '',
                                operations: job.operations || [],
                                dncPrograms: [], // Would need to fetch separately
                                history: job.history || [],
                                qualityRequirements: job.quality_requirements || [],
                                tooling: [], // Would need to fetch separately
                                materials: job.materials || [],
                                drawings: job.drawings || [],
                                createdAt: job.created_at,
                                updatedAt: job.updated_at
                            }); })];
                    case 2:
                        err_1 = _b.sent();
                        console.error('Error fetching jobs:', err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get a job by ID
     */
    getJobById: function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, _b, dncPrograms, dncError, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .select("\n          *,\n          operations:job_operations(*),\n          materials:job_materials(*),\n          drawings:job_drawings(*),\n          quality_requirements:quality_requirements(*),\n          history:job_history(*)\n        ")
                                .eq('id', jobId)
                                .single()];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('dnc_programs')
                                .select('*')
                                .eq('operation_id', data.operations.map(function (op) { return op.id; }))];
                    case 2:
                        _b = _c.sent(), dncPrograms = _b.data, dncError = _b.error;
                        if (dncError)
                            console.error('Error fetching DNC programs:', dncError);
                        return [2 /*return*/, {
                                id: data.id,
                                jobNumber: data.job_number,
                                partNumber: data.part_number,
                                partName: data.part_name,
                                customer: data.customer,
                                quantity: data.quantity,
                                completedQuantity: data.completed_quantity,
                                status: data.status,
                                priority: data.priority,
                                dueDate: data.due_date,
                                startDate: data.start_date,
                                estimatedHours: data.estimated_hours,
                                actualHours: data.actual_hours,
                                operator: data.operator_id, // Would need to join with users table for name
                                machine: data.machine_id, // Would need to join with machines table for name
                                operation: data.operation || '',
                                notes: data.notes || '',
                                operations: data.operations || [],
                                dncPrograms: dncPrograms || [],
                                history: data.history || [],
                                qualityRequirements: data.quality_requirements || [],
                                tooling: [], // Would need to fetch separately
                                materials: data.materials || [],
                                drawings: data.drawings || [],
                                createdAt: data.created_at,
                                updatedAt: data.updated_at
                            }];
                    case 3:
                        err_2 = _c.sent();
                        console.error('Error fetching job by ID:', err_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update job status
     */
    updateJobStatus: function (jobId, status, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .update({
                                status: status,
                                notes: notes ? notes : undefined,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', jobId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_3 = _a.sent();
                        console.error('Error updating job status:', err_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update job progress (completed quantity)
     */
    updateJobProgress: function (jobId, completedQuantity) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, job, fetchError, validQuantity, error, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .select('quantity')
                                .eq('id', jobId)
                                .single()];
                    case 1:
                        _a = _b.sent(), job = _a.data, fetchError = _a.error;
                        if (fetchError)
                            throw fetchError;
                        validQuantity = Math.min(completedQuantity, job.quantity);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .update({
                                completed_quantity: validQuantity,
                                status: validQuantity === job.quantity ? 'completed' : undefined,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', jobId)];
                    case 2:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 3:
                        err_4 = _b.sent();
                        console.error('Error updating job progress:', err_4);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update operation status
     */
    updateOperationStatus: function (operationId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('job_operations')
                                .update({
                                status: status,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', operationId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, true];
                    case 2:
                        err_5 = _a.sent();
                        console.error('Error updating operation status:', err_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Add quality check
     */
    addQualityCheck: function (check) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('quality_checks')
                                .insert({
                                requirement_id: check.requirementId,
                                operation_id: check.operationId,
                                inspector_id: check.inspector,
                                inspector_name: check.inspector,
                                result: check.result,
                                actual_value: check.actualValue,
                                notes: check.notes,
                                images: check.images
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, {
                                id: data.id,
                                requirementId: data.requirement_id,
                                operationId: data.operation_id,
                                timestamp: data.timestamp,
                                inspector: data.inspector_name,
                                result: data.result,
                                actualValue: data.actual_value,
                                notes: data.notes,
                                images: data.images
                            }];
                    case 2:
                        err_6 = _b.sent();
                        console.error('Error adding quality check:', err_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
