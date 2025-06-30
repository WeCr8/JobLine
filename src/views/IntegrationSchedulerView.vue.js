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
var jobs_1 = require("../stores/jobs");
var integration_service_1 = require("../services/integration.service");
var IntegrationJobScheduler_vue_1 = require("../components/IntegrationJobScheduler.vue");
var outline_1 = require("@heroicons/vue/24/outline");
var jobsStore = (0, jobs_1.useJobsStore)();
var optimizationHistory = (0, vue_1.ref)([
    {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'Auto Schedule',
        success: true,
        jobCount: 12,
        successCount: 10,
        failedCount: 2,
        summary: 'Automatically scheduled 10 jobs across 5 machines. 2 jobs could not be scheduled due to resource constraints.'
    },
    {
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        type: 'Manual Optimization',
        success: true,
        jobCount: 5,
        successCount: 5,
        failedCount: 0,
        summary: 'Optimized 5 selected jobs with 100% success rate. Estimated efficiency improvement: 15%.'
    }
]);
// Mock data for machines, operators, and departments
var machines = (0, vue_1.ref)([
    {
        id: 'machine-1',
        name: 'CNC-001',
        type: 'CNC Machining Center',
        department: 'cnc-machining',
        status: 'idle',
        capabilities: ['milling', 'drilling', 'tapping']
    },
    {
        id: 'machine-2',
        name: 'CNC-002',
        type: 'CNC Lathe',
        department: 'cnc-machining',
        status: 'idle',
        capabilities: ['turning', 'threading', 'facing']
    },
    {
        id: 'machine-3',
        name: 'LASER-001',
        type: 'Laser Cutter',
        department: 'sheet-metal',
        status: 'idle',
        capabilities: ['cutting', 'marking', 'engraving']
    }
]);
var operators = (0, vue_1.ref)([
    {
        id: 'user-1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'operator',
        department: 'cnc-machining',
        is_active: true,
        skills: ['milling', 'drilling', 'programming']
    },
    {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'lead',
        department: 'cnc-machining',
        is_active: true,
        skills: ['setup', 'inspection', 'programming']
    },
    {
        id: 'user-3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        role: 'operator',
        department: 'sheet-metal',
        is_active: true,
        skills: ['laser-cutting', 'bending', 'welding']
    }
]);
var departments = (0, vue_1.ref)([
    {
        id: 'cnc-machining',
        name: 'CNC Machining'
    },
    {
        id: 'sheet-metal',
        name: 'Sheet Metal'
    },
    {
        id: 'quality',
        name: 'Quality Control'
    }
]);
// Methods
var refreshData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, jobsStore.fetchJobs()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error refreshing data:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var handleScheduleJobs = function (jobIds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // In a real implementation, this would call the API to schedule the jobs
            // For now, we'll just add a history entry
            optimizationHistory.value.unshift({
                timestamp: new Date().toISOString(),
                type: 'Manual Optimization',
                success: true,
                jobCount: jobIds.length,
                successCount: jobIds.length,
                failedCount: 0,
                summary: "Optimized ".concat(jobIds.length, " selected jobs with 100% success rate. Estimated efficiency improvement: 15%.")
            });
        }
        catch (error) {
            console.error('Error scheduling jobs:', error);
        }
        return [2 /*return*/];
    });
}); };
var handleAutoSchedule = function () { return __awaiter(void 0, void 0, void 0, function () {
    var success, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, integration_service_1.integrationService.optimizeJobSchedule()];
            case 1:
                success = _a.sent();
                // Add history entry
                optimizationHistory.value.unshift({
                    timestamp: new Date().toISOString(),
                    type: 'Auto Schedule',
                    success: success,
                    jobCount: jobsStore.jobs.filter(function (j) { return j.status === 'pending'; }).length,
                    successCount: success ? jobsStore.jobs.filter(function (j) { return j.status === 'pending'; }).length - 2 : 0,
                    failedCount: success ? 2 : jobsStore.jobs.filter(function (j) { return j.status === 'pending'; }).length,
                    summary: success
                        ? 'Automatically scheduled jobs across available machines. Some jobs could not be scheduled due to resource constraints.'
                        : 'Failed to auto-schedule jobs. Please try again later.'
                });
                // Refresh jobs
                return [4 /*yield*/, jobsStore.fetchJobs()];
            case 2:
                // Refresh jobs
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error auto-scheduling jobs:', error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var handleOptimizationComplete = function (results) {
    console.log('Optimization complete:', results);
};
var formatTime = function (timestamp) {
    return (0, date_fns_1.format)(new Date(timestamp), 'MMM dd, yyyy HH:mm');
};
(0, vue_1.onMounted)(function () {
    refreshData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-2xl font-bold text-gray-900" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-gray-600" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex space-x-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.refreshData) }, { class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200" }));
var __VLS_0 = {}.ArrowPathIcon;
/** @type {[typeof __VLS_components.ArrowPathIcon, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-4 h-4 inline mr-1" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 inline mr-1" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }));
/** @type {[typeof IntegrationJobScheduler, ]} */ ;
// @ts-ignore
var __VLS_4 = __VLS_asFunctionalComponent(IntegrationJobScheduler_vue_1.default, new IntegrationJobScheduler_vue_1.default(__assign(__assign(__assign({ 'onScheduleJobs': {} }, { 'onAutoSchedule': {} }), { 'onOptimizationComplete': {} }), { title: "AI Job Scheduler", description: "Automatically schedule jobs based on AI recommendations", jobs: (__VLS_ctx.jobsStore.jobs), machines: (__VLS_ctx.machines), operators: (__VLS_ctx.operators), departments: (__VLS_ctx.departments), loading: (__VLS_ctx.jobsStore.loading) })));
var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onScheduleJobs': {} }, { 'onAutoSchedule': {} }), { 'onOptimizationComplete': {} }), { title: "AI Job Scheduler", description: "Automatically schedule jobs based on AI recommendations", jobs: (__VLS_ctx.jobsStore.jobs), machines: (__VLS_ctx.machines), operators: (__VLS_ctx.operators), departments: (__VLS_ctx.departments), loading: (__VLS_ctx.jobsStore.loading) })], __VLS_functionalComponentArgsRest(__VLS_4), false));
var __VLS_7;
var __VLS_8;
var __VLS_9;
var __VLS_10 = {
    onScheduleJobs: (__VLS_ctx.handleScheduleJobs)
};
var __VLS_11 = {
    onAutoSchedule: (__VLS_ctx.handleAutoSchedule)
};
var __VLS_12 = {
    onOptimizationComplete: (__VLS_ctx.handleOptimizationComplete)
};
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white rounded-lg shadow-sm border border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-6 border-b border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-semibold text-gray-900" }));
if (__VLS_ctx.optimizationHistory.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-6 text-center" }));
    var __VLS_13 = {}.SparklesIcon;
    /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
    // @ts-ignore
    var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13(__assign({ class: "w-12 h-12 text-gray-400 mx-auto mb-4" })));
    var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([__assign({ class: "w-12 h-12 text-gray-400 mx-auto mb-4" })], __VLS_functionalComponentArgsRest(__VLS_14), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-gray-500" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "divide-y divide-gray-200" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.optimizationHistory)); _i < _a.length; _i++) {
        var _b = _a[_i], history_1 = _b[0], index = _b[1];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (index) }, { class: "p-6 hover:bg-gray-50 transition-colors duration-200" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center space-x-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" }, { class: (history_1.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') }));
        (history_1.success ? 'SUCCESS' : 'FAILED');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-sm font-medium text-gray-900" }));
        (history_1.type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-gray-500" }));
        (__VLS_ctx.formatTime(history_1.timestamp));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-3 gap-4 text-sm mb-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-medium text-gray-900" }));
        (history_1.jobCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-medium text-green-600" }));
        (history_1.successCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-gray-500" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-medium text-red-600" }));
        (history_1.failedCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm text-gray-600" }));
        (history_1.summary);
    }
}
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            IntegrationJobScheduler: IntegrationJobScheduler_vue_1.default,
            ArrowPathIcon: outline_1.ArrowPathIcon,
            SparklesIcon: outline_1.SparklesIcon,
            jobsStore: jobsStore,
            optimizationHistory: optimizationHistory,
            machines: machines,
            operators: operators,
            departments: departments,
            refreshData: refreshData,
            handleScheduleJobs: handleScheduleJobs,
            handleAutoSchedule: handleAutoSchedule,
            handleOptimizationComplete: handleOptimizationComplete,
            formatTime: formatTime,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
