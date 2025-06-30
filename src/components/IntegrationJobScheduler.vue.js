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
var vue_1 = require("vue");
var date_fns_1 = require("date-fns");
var integration_service_1 = require("../services/integration.service");
var outline_1 = require("@heroicons/vue/24/outline");
var props = withDefaults(defineProps(), {
    title: '',
    description: '',
    jobs: function () { return []; },
    machines: function () { return []; },
    operators: function () { return []; },
    departments: function () { return []; },
    loading: false
});
var emit = defineEmits();
// State
var selectedDepartment = (0, vue_1.ref)('');
var selectedJobs = (0, vue_1.ref)([]);
var optimizing = (0, vue_1.ref)(false);
var optimizationResults = (0, vue_1.ref)([]);
// Computed
var pendingJobs = (0, vue_1.computed)(function () {
    var filtered = props.jobs.filter(function (job) { return job.status === 'pending'; });
    if (selectedDepartment.value) {
        // Filter by department if a machine is assigned
        filtered = filtered.filter(function (job) {
            if (job.machine) {
                var machine = props.machines.find(function (m) { return m.id === job.machine; });
                return machine && machine.department === selectedDepartment.value;
            }
            return false;
        });
    }
    // Sort by priority and due date
    return filtered.sort(function (a, b) {
        // First by priority
        var priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
        var priorityDiff = priorityOrder[a.priority] -
            priorityOrder[b.priority];
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        // Then by due date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
});
var availableMachines = (0, vue_1.computed)(function () {
    var filtered = props.machines.filter(function (machine) { return machine.status === 'idle'; });
    if (selectedDepartment.value) {
        filtered = filtered.filter(function (machine) { return machine.department === selectedDepartment.value; });
    }
    return filtered;
});
var availableOperators = (0, vue_1.computed)(function () {
    var filtered = props.operators.filter(function (operator) { return operator.is_active; });
    if (selectedDepartment.value) {
        filtered = filtered.filter(function (operator) { return operator.department === selectedDepartment.value; });
    }
    return filtered;
});
// Methods
var toggleJobSelection = function (jobId) {
    var index = selectedJobs.value.indexOf(jobId);
    if (index === -1) {
        selectedJobs.value.push(jobId);
    }
    else {
        selectedJobs.value.splice(index, 1);
    }
};
var optimizeJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var results, _loop_2, _i, _a, jobId, err_1, errorResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (selectedJobs.value.length === 0) {
                    return [2 /*return*/];
                }
                optimizing.value = true;
                optimizationResults.value = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                results = [];
                _loop_2 = function (jobId) {
                    var job, recommendations, recommendation, machine, operator;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                job = props.jobs.find(function (j) { return j.id === jobId; });
                                if (!job) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, integration_service_1.integrationService.getJobRecommendations(job.operator || '')];
                            case 1:
                                recommendations = _c.sent();
                                recommendation = recommendations.find(function (r) { return r.id === jobId; });
                                if (recommendation && recommendation.recommendedMachine) {
                                    machine = props.machines.find(function (m) { return m.id === recommendation.recommendedMachine; });
                                    operator = props.operators.find(function (o) { return o.id === job.operator; });
                                    results.push({
                                        jobId: jobId,
                                        jobNumber: job.jobNumber,
                                        success: true,
                                        machine: (machine === null || machine === void 0 ? void 0 : machine.name) || recommendation.recommendedMachine,
                                        operator: (operator === null || operator === void 0 ? void 0 : operator.name) || 'Unassigned',
                                        status: 'setup'
                                    });
                                }
                                else {
                                    results.push({
                                        jobId: jobId,
                                        jobNumber: job.jobNumber,
                                        success: false,
                                        error: 'No suitable machine found for this job'
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = selectedJobs.value;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                jobId = _a[_i];
                return [5 /*yield**/, _loop_2(jobId)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                optimizationResults.value = results;
                emit('schedule-jobs', selectedJobs.value);
                emit('optimization-complete', results);
                return [3 /*break*/, 8];
            case 6:
                err_1 = _b.sent();
                console.error('Error optimizing jobs:', err_1);
                errorResults = selectedJobs.value.map(function (jobId) {
                    var job = props.jobs.find(function (j) { return j.id === jobId; });
                    return {
                        jobId: jobId,
                        jobNumber: (job === null || job === void 0 ? void 0 : job.jobNumber) || jobId,
                        success: false,
                        error: err_1.message || 'An error occurred during optimization'
                    };
                });
                optimizationResults.value = errorResults;
                emit('optimization-complete', errorResults);
                return [3 /*break*/, 8];
            case 7:
                optimizing.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
var autoScheduleAll = function () { return __awaiter(void 0, void 0, void 0, function () {
    var success, results, results, err_2, errorResults;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                optimizing.value = true;
                optimizationResults.value = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, integration_service_1.integrationService.optimizeJobSchedule(selectedDepartment.value)];
            case 2:
                success = _a.sent();
                if (success) {
                    results = pendingJobs.value.map(function (job) { return ({
                        jobId: job.id,
                        jobNumber: job.jobNumber,
                        success: true,
                        machine: 'Auto-assigned',
                        operator: 'Auto-assigned',
                        status: 'setup'
                    }); });
                    optimizationResults.value = results;
                    emit('auto-schedule');
                    emit('optimization-complete', results);
                }
                else {
                    results = pendingJobs.value.map(function (job) { return ({
                        jobId: job.id,
                        jobNumber: job.jobNumber,
                        success: false,
                        error: 'Failed to auto-schedule job'
                    }); });
                    optimizationResults.value = results;
                    emit('optimization-complete', results);
                }
                return [3 /*break*/, 5];
            case 3:
                err_2 = _a.sent();
                console.error('Error auto-scheduling jobs:', err_2);
                errorResults = pendingJobs.value.map(function (job) { return ({
                    jobId: job.id,
                    jobNumber: job.jobNumber,
                    success: false,
                    error: err_2.message || 'An error occurred during auto-scheduling'
                }); });
                optimizationResults.value = errorResults;
                emit('optimization-complete', errorResults);
                return [3 /*break*/, 5];
            case 4:
                optimizing.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var formatDate = function (dateString) {
    return (0, date_fns_1.format)(new Date(dateString), 'MMM dd, yyyy');
};
var formatRole = function (role) {
    if (role === 'organization_admin')
        return 'Org Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
};
var getPriorityClass = function (priority) {
    var classes = {
        'low': 'bg-gray-100 text-gray-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-orange-100 text-orange-800',
        'urgent': 'bg-red-100 text-red-800'
    };
    return classes[priority] || classes.medium;
};
var getMachineStatusClass = function (status) {
    var classes = {
        'running': 'bg-green-100 text-green-800',
        'idle': 'bg-blue-100 text-blue-800',
        'maintenance': 'bg-yellow-100 text-yellow-800',
        'down': 'bg-red-100 text-red-800'
    };
    return classes[status] || classes.idle;
};
var getDepartmentName = function (departmentId) {
    if (!departmentId)
        return 'Unassigned';
    var department = props.departments.find(function (d) { return d.id === departmentId; });
    return department ? department.name : departmentId;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    title: '',
    description: '',
    jobs: function () { return []; },
    machines: function () { return []; },
    operators: function () { return []; },
    departments: function () { return []; },
    loading: false
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['job-scheduler-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-item']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-role']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-optimize']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resources-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-checkbox']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "job-scheduler-title" }));
(__VLS_ctx.title || 'AI Job Scheduler');
if (__VLS_ctx.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "job-scheduler-description" }));
    (__VLS_ctx.description);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-filter" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "department-filter" }, { class: "job-scheduler-filter-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ id: "department-filter", value: (__VLS_ctx.selectedDepartment) }, { class: "job-scheduler-filter-select" }), { disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.departments)); _i < _a.length; _i++) {
    var dept = _a[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (dept.id),
        value: (dept.id),
    });
    (dept.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-queue" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "job-scheduler-section-title" }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-loading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-6 w-6 text-primary-600" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else if (__VLS_ctx.pendingJobs.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-empty" }));
    var __VLS_0 = {}.ClipboardDocumentCheckIcon;
    /** @type {[typeof __VLS_components.ClipboardDocumentCheckIcon, ]} */ ;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-12 h-12 text-gray-300" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-12 h-12 text-gray-300" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-list" }));
    var _loop_1 = function (job) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.pendingJobs.length === 0))
                    return;
                __VLS_ctx.toggleJobSelection(job.id);
            } }, { key: (job.id) }), { class: "job-scheduler-job-item" }), { class: ({ 'job-scheduler-job-item-selected': __VLS_ctx.selectedJobs.includes(job.id) }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-header" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-title" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-number" }));
        (job.jobNumber);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-priority" }, { class: (__VLS_ctx.getPriorityClass(job.priority)) }));
        (job.priority.toUpperCase());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-checkbox" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onClick: function () { } }, { onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.pendingJobs.length === 0))
                    return;
                __VLS_ctx.toggleJobSelection(job.id);
            } }), { id: ("job-".concat(job.id)), type: "checkbox", checked: (__VLS_ctx.selectedJobs.includes(job.id)) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: ("job-".concat(job.id)) }, { class: "sr-only" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-details" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-detail" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-label" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-value" }));
        (job.partName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-detail" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-label" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-value" }));
        (job.customer);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-detail" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-label" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-value" }));
        (__VLS_ctx.formatDate(job.dueDate));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-detail" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-label" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-detail-value" }));
        (job.quantity);
        if (job.aiRecommendation) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation-header" }));
            var __VLS_4 = {}.SparklesIcon;
            /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
            // @ts-ignore
            var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign({ class: "w-4 h-4 text-yellow-500" })));
            var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 text-yellow-500" })], __VLS_functionalComponentArgsRest(__VLS_5), false));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation-details" }));
            if (job.aiRecommendation.machine) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation-detail" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-label" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-value" }));
                (job.aiRecommendation.machine);
            }
            if (job.aiRecommendation.operator) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation-detail" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-label" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-value" }));
                (job.aiRecommendation.operator);
            }
            if (job.aiRecommendation.confidence) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-job-recommendation-detail" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-label" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-job-recommendation-value" }));
                (job.aiRecommendation.confidence);
            }
        }
    };
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.pendingJobs)); _b < _c.length; _b++) {
        var job = _c[_b][0];
        _loop_1(job);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resources" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "job-scheduler-section-title" }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-loading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-6 w-6 text-primary-600" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resources-grid" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)(__assign({ class: "job-scheduler-resource-title" }));
    if (__VLS_ctx.availableMachines.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-empty" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-list" }));
        for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.availableMachines)); _d < _e.length; _d++) {
            var machine = _e[_d][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (machine.id) }, { class: "job-scheduler-resource-item" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-header" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-name" }));
            (machine.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-status" }, { class: (__VLS_ctx.getMachineStatusClass(machine.status)) }));
            (machine.status.toUpperCase());
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-details" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-value" }));
            (machine.type);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-value" }));
            (__VLS_ctx.getDepartmentName(machine.department));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)(__assign({ class: "job-scheduler-resource-title" }));
    if (__VLS_ctx.availableOperators.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-empty" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-list" }));
        for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.availableOperators)); _f < _g.length; _f++) {
            var operator = _g[_f][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (operator.id) }, { class: "job-scheduler-resource-item" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-header" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-name" }));
            (operator.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-role" }));
            (__VLS_ctx.formatRole(operator.role));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-details" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-value" }));
            (__VLS_ctx.getDepartmentName(operator.department));
            if (operator.skills && operator.skills.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-resource-detail" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-label" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-resource-detail-value" }));
                (operator.skills.join(', '));
            }
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.optimizeJobs) }, { type: "button" }), { class: "job-scheduler-action-button job-scheduler-action-optimize" }), { disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing || __VLS_ctx.selectedJobs.length === 0) }));
if (__VLS_ctx.optimizing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-action-loading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-4 w-4" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_8 = {}.SparklesIcon;
    /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ class: "w-5 h-5 mr-1" })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5 mr-1" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.autoScheduleAll) }, { type: "button" }), { class: "job-scheduler-action-button job-scheduler-action-auto" }), { disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing || __VLS_ctx.pendingJobs.length === 0) }));
if (__VLS_ctx.optimizing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-action-loading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-4 w-4" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_12 = {}.BoltIcon;
    /** @type {[typeof __VLS_components.BoltIcon, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign({ class: "w-5 h-5 mr-1" })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5 mr-1" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
}
if (__VLS_ctx.optimizationResults.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-results" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "job-scheduler-section-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-results-list" }));
    for (var _h = 0, _j = __VLS_getVForSourceType((__VLS_ctx.optimizationResults)); _h < _j.length; _h++) {
        var result = _j[_h][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (result.jobId) }, { class: "job-scheduler-result-item" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-header" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-title" }));
        (result.jobNumber);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-status" }, { class: (result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') }));
        (result.success ? 'SCHEDULED' : 'FAILED');
        if (result.success) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-details" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-value" }));
            (result.machine);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-value" }));
            (result.operator);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-detail" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-label" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "job-scheduler-result-detail-value" }));
            (result.status);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "job-scheduler-result-error" }));
            (result.error);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['job-scheduler']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-header']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-description']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-content']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-queue']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-list']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-item']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-item-selected']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-header']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-number']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-priority']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-header']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-job-recommendation-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resources']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resources-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-section']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-list']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-item']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-header']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-name']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-status']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-section']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-list']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-item']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-header']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-name']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-role']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-resource-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-optimize']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-action-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-results']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-results-list']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-item']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-header']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-title']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-status']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-details']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['job-scheduler-result-error']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            ClipboardDocumentCheckIcon: outline_1.ClipboardDocumentCheckIcon,
            SparklesIcon: outline_1.SparklesIcon,
            BoltIcon: outline_1.BoltIcon,
            selectedDepartment: selectedDepartment,
            selectedJobs: selectedJobs,
            optimizing: optimizing,
            optimizationResults: optimizationResults,
            pendingJobs: pendingJobs,
            availableMachines: availableMachines,
            availableOperators: availableOperators,
            toggleJobSelection: toggleJobSelection,
            optimizeJobs: optimizeJobs,
            autoScheduleAll: autoScheduleAll,
            formatDate: formatDate,
            formatRole: formatRole,
            getPriorityClass: getPriorityClass,
            getMachineStatusClass: getMachineStatusClass,
            getDepartmentName: getDepartmentName,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
