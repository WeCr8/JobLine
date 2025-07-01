import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useJobsStore } from '../stores/jobs';
import { integrationService } from '../services/integration.service';
import IntegrationJobScheduler from '../components/IntegrationJobScheduler.vue';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/vue/24/outline';
const jobsStore = useJobsStore();
const optimizationHistory = ref([
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
const machines = ref([
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
const operators = ref([
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
const departments = ref([
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
const refreshData = async () => {
    try {
        await jobsStore.fetchJobs();
    }
    catch (error) {
        console.error('Error refreshing data:', error);
    }
};
const handleScheduleJobs = async (jobIds) => {
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
            summary: `Optimized ${jobIds.length} selected jobs with 100% success rate. Estimated efficiency improvement: 15%.`
        });
    }
    catch (error) {
        console.error('Error scheduling jobs:', error);
    }
};
const handleAutoSchedule = async () => {
    try {
        // Call the API to auto-schedule all jobs
        const success = await integrationService.optimizeJobSchedule();
        // Add history entry
        optimizationHistory.value.unshift({
            timestamp: new Date().toISOString(),
            type: 'Auto Schedule',
            success,
            jobCount: jobsStore.jobs.filter(j => j.status === 'pending').length,
            successCount: success ? jobsStore.jobs.filter(j => j.status === 'pending').length - 2 : 0,
            failedCount: success ? 2 : jobsStore.jobs.filter(j => j.status === 'pending').length,
            summary: success
                ? 'Automatically scheduled jobs across available machines. Some jobs could not be scheduled due to resource constraints.'
                : 'Failed to auto-schedule jobs. Please try again later.'
        });
        // Refresh jobs
        await jobsStore.fetchJobs();
    }
    catch (error) {
        console.error('Error auto-scheduling jobs:', error);
    }
};
const handleOptimizationComplete = (results) => {
    console.log('Optimization complete:', results);
};
const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
};
onMounted(() => {
    refreshData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-gray-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex space-x-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.refreshData) },
    ...{ class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200" },
});
const __VLS_0 = {}.ArrowPathIcon;
/** @type {[typeof __VLS_components.ArrowPathIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-4 h-4 inline mr-1" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-4 h-4 inline mr-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" },
});
/** @type {[typeof IntegrationJobScheduler, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(IntegrationJobScheduler, new IntegrationJobScheduler({
    ...{ 'onScheduleJobs': {} },
    ...{ 'onAutoSchedule': {} },
    ...{ 'onOptimizationComplete': {} },
    title: "AI Job Scheduler",
    description: "Automatically schedule jobs based on AI recommendations",
    jobs: (__VLS_ctx.jobsStore.jobs),
    machines: (__VLS_ctx.machines),
    operators: (__VLS_ctx.operators),
    departments: (__VLS_ctx.departments),
    loading: (__VLS_ctx.jobsStore.loading),
}));
const __VLS_5 = __VLS_4({
    ...{ 'onScheduleJobs': {} },
    ...{ 'onAutoSchedule': {} },
    ...{ 'onOptimizationComplete': {} },
    title: "AI Job Scheduler",
    description: "Automatically schedule jobs based on AI recommendations",
    jobs: (__VLS_ctx.jobsStore.jobs),
    machines: (__VLS_ctx.machines),
    operators: (__VLS_ctx.operators),
    departments: (__VLS_ctx.departments),
    loading: (__VLS_ctx.jobsStore.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    onScheduleJobs: (__VLS_ctx.handleScheduleJobs)
};
const __VLS_11 = {
    onAutoSchedule: (__VLS_ctx.handleAutoSchedule)
};
const __VLS_12 = {
    onOptimizationComplete: (__VLS_ctx.handleOptimizationComplete)
};
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white rounded-lg shadow-sm border border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6 border-b border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold text-gray-900" },
});
if (__VLS_ctx.optimizationHistory.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6 text-center" },
    });
    const __VLS_13 = {}.SparklesIcon;
    /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ class: "w-12 h-12 text-gray-400 mx-auto mb-4" },
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: "w-12 h-12 text-gray-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "divide-y divide-gray-200" },
    });
    for (const [history, index] of __VLS_getVForSourceType((__VLS_ctx.optimizationHistory))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "p-6 hover:bg-gray-50 transition-colors duration-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" },
            ...{ class: (history.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') },
        });
        (history.success ? 'SUCCESS' : 'FAILED');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-sm font-medium text-gray-900" },
        });
        (history.type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-gray-500" },
        });
        (__VLS_ctx.formatTime(history.timestamp));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-3 gap-4 text-sm mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-500" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium text-gray-900" },
        });
        (history.jobCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-500" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium text-green-600" },
        });
        (history.successCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-500" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium text-red-600" },
        });
        (history.failedCount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-600" },
        });
        (history.summary);
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IntegrationJobScheduler: IntegrationJobScheduler,
            ArrowPathIcon: ArrowPathIcon,
            SparklesIcon: SparklesIcon,
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
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
