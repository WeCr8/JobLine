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
exports.useManufacturingStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var api_service_1 = require("../services/api.service");
var demo_service_1 = require("../services/demo.service");
var auth_1 = require("./auth");
exports.useManufacturingStore = (0, pinia_1.defineStore)('manufacturing', function () {
    var departments = (0, vue_1.ref)([]);
    var machines = (0, vue_1.ref)([]);
    var workCenters = (0, vue_1.ref)([]);
    var processes = (0, vue_1.ref)([]);
    var capabilities = (0, vue_1.ref)([]);
    var digitalTwinCompliance = (0, vue_1.ref)([]);
    var toolDataIntegrity = (0, vue_1.ref)([]);
    var materialInventory = (0, vue_1.ref)([]);
    var purchaseOrders = (0, vue_1.ref)([]);
    var shippingReceiving = (0, vue_1.ref)([]);
    var programmingTasks = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var authStore = (0, auth_1.useAuthStore)();
    var fetchDepartments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loading.value = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_c = (_b = authStore.user) === null || _b === void 0 ? void 0 : _b.email) === null || _c === void 0 ? void 0 : _c.includes('demo')))) return [3 /*break*/, 2];
                    // Use hardcoded demo data
                    departments.value = demo_service_1.demoService.getDemoData('departments');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, api_service_1.supabase
                        .from('departments')
                        .select('*')];
                case 3:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Map database fields to our ManufacturingDepartment type
                    departments.value = (data || []).map(function (dept) { return ({
                        id: dept.id,
                        name: dept.name,
                        description: dept.description || '',
                        supervisor: dept.supervisor || 'Unassigned',
                        shift: dept.shift || 'day',
                        capabilities: dept.capabilities || [],
                        qualityStandards: dept.quality_standards || [],
                        machines: dept.machines || [],
                        operators: [], // Would need to fetch from users table
                        activeJobs: dept.active_jobs || 0,
                        efficiency: dept.efficiency || 0,
                        utilizationRate: dept.utilization_rate || 0,
                        kpis: [
                            { name: 'Efficiency', value: dept.efficiency || 0, target: 85, unit: '%', trend: 'up' },
                            { name: 'Utilization', value: dept.utilization_rate || 0, target: 80, unit: '%', trend: 'stable' }
                        ],
                        integrations: dept.integrations || []
                    }); });
                    _d.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _d.sent();
                    console.error('Error fetching departments:', error_1);
                    // Fallback to empty array
                    departments.value = [];
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var fetchMachines = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loading.value = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_c = (_b = authStore.user) === null || _b === void 0 ? void 0 : _b.email) === null || _c === void 0 ? void 0 : _c.includes('demo')))) return [3 /*break*/, 2];
                    // Use hardcoded demo data
                    machines.value = demo_service_1.demoService.getDemoData('machines');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, api_service_1.supabase
                        .from('machines')
                        .select('*')];
                case 3:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Map database fields to our Machine type
                    machines.value = (data || []).map(function (machine) { return ({
                        id: machine.id,
                        name: machine.name,
                        type: machine.type,
                        department: machine.department_id || '',
                        status: machine.status || 'idle',
                        capabilities: machine.capabilities || [],
                        specifications: machine.specifications || {},
                        currentJob: machine.current_job_id,
                        operator: machine.operator_id,
                        condition: machine.condition || 'idle',
                        lastMaintenance: machine.last_maintenance,
                        nextMaintenance: machine.next_maintenance,
                        utilizationRate: machine.utilization_rate || 0,
                        efficiency: machine.efficiency || 0,
                        location: machine.location || '',
                        serialNumber: machine.serial_number,
                        manufacturer: machine.manufacturer,
                        model: machine.model,
                        yearInstalled: machine.year_installed
                    }); });
                    _d.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_2 = _d.sent();
                    console.error('Error fetching machines:', error_2);
                    // Fallback to empty array
                    machines.value = [];
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var fetchWorkCenters = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_3;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loading.value = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_c = (_b = authStore.user) === null || _b === void 0 ? void 0 : _b.email) === null || _c === void 0 ? void 0 : _c.includes('demo')))) return [3 /*break*/, 2];
                    // Use hardcoded demo data - would need to implement this in demoService
                    workCenters.value = [];
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, api_service_1.supabase
                        .from('work_centers')
                        .select('*')];
                case 3:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Map database fields to our WorkCenter type
                    workCenters.value = (data || []).map(function (wc) { return ({
                        id: wc.id,
                        name: wc.name,
                        department: wc.department_id || '',
                        machines: wc.machines || [],
                        capabilities: wc.capabilities || [],
                        capacity: wc.capacity || 24,
                        currentLoad: wc.current_load || 0,
                        efficiency: wc.efficiency || 0,
                        setupTime: wc.setup_time || 0,
                        cycleTime: wc.cycle_time || 0,
                        location: wc.location || '',
                        supervisor: wc.supervisor_id || ''
                    }); });
                    _d.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_3 = _d.sent();
                    console.error('Error fetching work centers:', error_3);
                    // Fallback to empty array
                    workCenters.value = [];
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var fetchProcesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loading.value = true;
            try {
                // In a real implementation, this would fetch from the database
                // For now, we'll just set loading to false
                processes.value = [];
            }
            catch (error) {
                console.error('Error fetching processes:', error);
                processes.value = [];
            }
            finally {
                loading.value = false;
            }
            return [2 /*return*/];
        });
    }); };
    var fetchCapabilities = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loading.value = true;
            try {
                // In a real implementation, this would fetch from the database
                // For now, we'll just set loading to false
                capabilities.value = [];
            }
            catch (error) {
                console.error('Error fetching capabilities:', error);
                capabilities.value = [];
            }
            finally {
                loading.value = false;
            }
            return [2 /*return*/];
        });
    }); };
    // Computed properties
    var departmentsByType = (0, vue_1.computed)(function () {
        var production = departments.value.filter(function (d) {
            return ['cnc-machining', 'sheet-metal', 'welding', 'additive', 'assembly'].includes(d.id);
        });
        var support = departments.value.filter(function (d) {
            return ['purchasing', 'shipping-receiving', 'material-stores', 'tdit', 'digital-twin-compliance', 'programming', 'quality', 'maintenance', 'planning'].includes(d.id);
        });
        return { production: production, support: support };
    });
    var machinesByDepartment = (0, vue_1.computed)(function () {
        var byDept = {};
        machines.value.forEach(function (machine) {
            if (!byDept[machine.department])
                byDept[machine.department] = [];
            byDept[machine.department].push(machine);
        });
        return byDept;
    });
    var activeMachines = (0, vue_1.computed)(function () {
        return machines.value.filter(function (machine) { return machine.status === 'running'; });
    });
    var availableMachines = (0, vue_1.computed)(function () {
        return machines.value.filter(function (machine) { return machine.status === 'idle'; });
    });
    var overallEfficiency = (0, vue_1.computed)(function () {
        if (departments.value.length === 0)
            return 0;
        var totalEfficiency = departments.value.reduce(function (sum, dept) { return sum + dept.efficiency; }, 0);
        return Math.round(totalEfficiency / departments.value.length);
    });
    var overallUtilization = (0, vue_1.computed)(function () {
        if (departments.value.length === 0)
            return 0;
        var totalUtilization = departments.value.reduce(function (sum, dept) { return sum + dept.utilizationRate; }, 0);
        return Math.round(totalUtilization / departments.value.length);
    });
    return {
        departments: departments,
        machines: machines,
        workCenters: workCenters,
        processes: processes,
        capabilities: capabilities,
        digitalTwinCompliance: digitalTwinCompliance,
        toolDataIntegrity: toolDataIntegrity,
        materialInventory: materialInventory,
        purchaseOrders: purchaseOrders,
        shippingReceiving: shippingReceiving,
        programmingTasks: programmingTasks,
        loading: loading,
        departmentsByType: departmentsByType,
        machinesByDepartment: machinesByDepartment,
        activeMachines: activeMachines,
        availableMachines: availableMachines,
        overallEfficiency: overallEfficiency,
        overallUtilization: overallUtilization,
        fetchDepartments: fetchDepartments,
        fetchMachines: fetchMachines,
        fetchWorkCenters: fetchWorkCenters,
        fetchProcesses: fetchProcesses,
        fetchCapabilities: fetchCapabilities
    };
});
