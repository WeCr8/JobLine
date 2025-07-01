import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { integrationService } from '../services/integration.service';
import { ClipboardDocumentCheckIcon, SparklesIcon, BoltIcon } from '@heroicons/vue/24/outline';
const props = withDefaults(defineProps(), {
    title: '',
    description: '',
    jobs: () => [],
    machines: () => [],
    operators: () => [],
    departments: () => [],
    loading: false
});
const emit = defineEmits();
// State
const selectedDepartment = ref('');
const selectedJobs = ref([]);
const optimizing = ref(false);
const optimizationResults = ref([]);
// Computed
const pendingJobs = computed(() => {
    let filtered = props.jobs.filter(job => job.status === 'pending');
    if (selectedDepartment.value) {
        // Filter by department if a machine is assigned
        filtered = filtered.filter(job => {
            if (job.machine) {
                const machine = props.machines.find(m => m.id === job.machine);
                return machine && machine.department === selectedDepartment.value;
            }
            return false;
        });
    }
    // Sort by priority and due date
    return filtered.sort((a, b) => {
        // First by priority
        const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
        const priorityDiff = priorityOrder[a.priority] -
            priorityOrder[b.priority];
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        // Then by due date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
});
const availableMachines = computed(() => {
    let filtered = props.machines.filter(machine => machine.status === 'idle');
    if (selectedDepartment.value) {
        filtered = filtered.filter(machine => machine.department === selectedDepartment.value);
    }
    return filtered;
});
const availableOperators = computed(() => {
    let filtered = props.operators.filter(operator => operator.is_active);
    if (selectedDepartment.value) {
        filtered = filtered.filter(operator => operator.department === selectedDepartment.value);
    }
    return filtered;
});
// Methods
const toggleJobSelection = (jobId) => {
    const index = selectedJobs.value.indexOf(jobId);
    if (index === -1) {
        selectedJobs.value.push(jobId);
    }
    else {
        selectedJobs.value.splice(index, 1);
    }
};
const optimizeJobs = async () => {
    if (selectedJobs.value.length === 0) {
        return;
    }
    optimizing.value = true;
    optimizationResults.value = [];
    try {
        // Call the API to optimize job schedule
        const results = [];
        for (const jobId of selectedJobs.value) {
            const job = props.jobs.find(j => j.id === jobId);
            if (!job) {
                continue;
            }
            // Get AI recommendations for this job
            const recommendations = await integrationService.getJobRecommendations(job.operator || '');
            // Find the recommendation for this job
            const recommendation = recommendations.find(r => r.id === jobId);
            if (recommendation && recommendation.recommendedMachine) {
                // Apply the recommendation
                const machine = props.machines.find(m => m.id === recommendation.recommendedMachine);
                const operator = props.operators.find(o => o.id === job.operator);
                results.push({
                    jobId,
                    jobNumber: job.jobNumber,
                    success: true,
                    machine: machine?.name || recommendation.recommendedMachine,
                    operator: operator?.name || 'Unassigned',
                    status: 'setup'
                });
            }
            else {
                results.push({
                    jobId,
                    jobNumber: job.jobNumber,
                    success: false,
                    error: 'No suitable machine found for this job'
                });
            }
        }
        optimizationResults.value = results;
        emit('schedule-jobs', selectedJobs.value);
        emit('optimization-complete', results);
    }
    catch (err) {
        console.error('Error optimizing jobs:', err);
        // Add error results
        const errorResults = selectedJobs.value.map(jobId => {
            const job = props.jobs.find(j => j.id === jobId);
            return {
                jobId,
                jobNumber: job?.jobNumber || jobId,
                success: false,
                error: err.message || 'An error occurred during optimization'
            };
        });
        optimizationResults.value = errorResults;
        emit('optimization-complete', errorResults);
    }
    finally {
        optimizing.value = false;
    }
};
const autoScheduleAll = async () => {
    optimizing.value = true;
    optimizationResults.value = [];
    try {
        // Call the API to auto-schedule all jobs
        const success = await integrationService.optimizeJobSchedule(selectedDepartment.value);
        if (success) {
            // Create success results for all pending jobs
            const results = pendingJobs.value.map(job => ({
                jobId: job.id,
                jobNumber: job.jobNumber,
                success: true,
                machine: 'Auto-assigned',
                operator: 'Auto-assigned',
                status: 'setup'
            }));
            optimizationResults.value = results;
            emit('auto-schedule');
            emit('optimization-complete', results);
        }
        else {
            // Create error results
            const results = pendingJobs.value.map(job => ({
                jobId: job.id,
                jobNumber: job.jobNumber,
                success: false,
                error: 'Failed to auto-schedule job'
            }));
            optimizationResults.value = results;
            emit('optimization-complete', results);
        }
    }
    catch (err) {
        console.error('Error auto-scheduling jobs:', err);
        // Add error results
        const errorResults = pendingJobs.value.map(job => ({
            jobId: job.id,
            jobNumber: job.jobNumber,
            success: false,
            error: err.message || 'An error occurred during auto-scheduling'
        }));
        optimizationResults.value = errorResults;
        emit('optimization-complete', errorResults);
    }
    finally {
        optimizing.value = false;
    }
};
const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
};
const formatRole = (role) => {
    if (role === 'organization_admin')
        return 'Org Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
};
const getPriorityClass = (priority) => {
    const classes = {
        'low': 'bg-gray-100 text-gray-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-orange-100 text-orange-800',
        'urgent': 'bg-red-100 text-red-800'
    };
    return classes[priority] || classes.medium;
};
const getMachineStatusClass = (status) => {
    const classes = {
        'running': 'bg-green-100 text-green-800',
        'idle': 'bg-blue-100 text-blue-800',
        'maintenance': 'bg-yellow-100 text-yellow-800',
        'down': 'bg-red-100 text-red-800'
    };
    return classes[status] || classes.idle;
};
const getDepartmentName = (departmentId) => {
    if (!departmentId)
        return 'Unassigned';
    const department = props.departments.find(d => d.id === departmentId);
    return department ? department.name : departmentId;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    title: '',
    description: '',
    jobs: () => [],
    machines: () => [],
    operators: () => [],
    departments: () => [],
    loading: false
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "job-scheduler-title" },
});
(__VLS_ctx.title || 'AI Job Scheduler');
if (__VLS_ctx.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "job-scheduler-description" },
    });
    (__VLS_ctx.description);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-filter" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "department-filter",
    ...{ class: "job-scheduler-filter-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    id: "department-filter",
    value: (__VLS_ctx.selectedDepartment),
    ...{ class: "job-scheduler-filter-select" },
    disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [dept] of __VLS_getVForSourceType((__VLS_ctx.departments))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (dept.id),
        value: (dept.id),
    });
    (dept.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-queue" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "job-scheduler-section-title" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-6 w-6 text-primary-600" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else if (__VLS_ctx.pendingJobs.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-empty" },
    });
    const __VLS_0 = {}.ClipboardDocumentCheckIcon;
    /** @type {[typeof __VLS_components.ClipboardDocumentCheckIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-12 h-12 text-gray-300" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-12 h-12 text-gray-300" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-job-list" },
    });
    for (const [job] of __VLS_getVForSourceType((__VLS_ctx.pendingJobs))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.pendingJobs.length === 0))
                        return;
                    __VLS_ctx.toggleJobSelection(job.id);
                } },
            key: (job.id),
            ...{ class: "job-scheduler-job-item" },
            ...{ class: ({ 'job-scheduler-job-item-selected': __VLS_ctx.selectedJobs.includes(job.id) }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-number" },
        });
        (job.jobNumber);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-priority" },
            ...{ class: (__VLS_ctx.getPriorityClass(job.priority)) },
        });
        (job.priority.toUpperCase());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-checkbox" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onClick: () => { } },
            ...{ onChange: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.pendingJobs.length === 0))
                        return;
                    __VLS_ctx.toggleJobSelection(job.id);
                } },
            id: (`job-${job.id}`),
            type: "checkbox",
            checked: (__VLS_ctx.selectedJobs.includes(job.id)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: (`job-${job.id}`),
            ...{ class: "sr-only" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-details" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-detail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-value" },
        });
        (job.partName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-detail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-value" },
        });
        (job.customer);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-detail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-value" },
        });
        (__VLS_ctx.formatDate(job.dueDate));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-job-detail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "job-scheduler-job-detail-value" },
        });
        (job.quantity);
        if (job.aiRecommendation) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-job-recommendation" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-job-recommendation-header" },
            });
            const __VLS_4 = {}.SparklesIcon;
            /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
            // @ts-ignore
            const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
                ...{ class: "w-4 h-4 text-yellow-500" },
            }));
            const __VLS_6 = __VLS_5({
                ...{ class: "w-4 h-4 text-yellow-500" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_5));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-job-recommendation-details" },
            });
            if (job.aiRecommendation.machine) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "job-scheduler-job-recommendation-detail" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-value" },
                });
                (job.aiRecommendation.machine);
            }
            if (job.aiRecommendation.operator) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "job-scheduler-job-recommendation-detail" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-value" },
                });
                (job.aiRecommendation.operator);
            }
            if (job.aiRecommendation.confidence) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "job-scheduler-job-recommendation-detail" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-job-recommendation-value" },
                });
                (job.aiRecommendation.confidence);
            }
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-resources" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "job-scheduler-section-title" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-6 w-6 text-primary-600" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-resources-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-resource-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "job-scheduler-resource-title" },
    });
    if (__VLS_ctx.availableMachines.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-resource-empty" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-resource-list" },
        });
        for (const [machine] of __VLS_getVForSourceType((__VLS_ctx.availableMachines))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (machine.id),
                ...{ class: "job-scheduler-resource-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-name" },
            });
            (machine.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-status" },
                ...{ class: (__VLS_ctx.getMachineStatusClass(machine.status)) },
            });
            (machine.status.toUpperCase());
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-value" },
            });
            (machine.type);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-value" },
            });
            (__VLS_ctx.getDepartmentName(machine.department));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-resource-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "job-scheduler-resource-title" },
    });
    if (__VLS_ctx.availableOperators.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-resource-empty" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-resource-list" },
        });
        for (const [operator] of __VLS_getVForSourceType((__VLS_ctx.availableOperators))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (operator.id),
                ...{ class: "job-scheduler-resource-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-name" },
            });
            (operator.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-role" },
            });
            (__VLS_ctx.formatRole(operator.role));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-resource-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-resource-detail-value" },
            });
            (__VLS_ctx.getDepartmentName(operator.department));
            if (operator.skills && operator.skills.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "job-scheduler-resource-detail" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-resource-detail-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "job-scheduler-resource-detail-value" },
                });
                (operator.skills.join(', '));
            }
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "job-scheduler-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.optimizeJobs) },
    type: "button",
    ...{ class: "job-scheduler-action-button job-scheduler-action-optimize" },
    disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing || __VLS_ctx.selectedJobs.length === 0),
});
if (__VLS_ctx.optimizing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "job-scheduler-action-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-4 w-4" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_8 = {}.SparklesIcon;
    /** @type {[typeof __VLS_components.SparklesIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "w-5 h-5 mr-1" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "w-5 h-5 mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.autoScheduleAll) },
    type: "button",
    ...{ class: "job-scheduler-action-button job-scheduler-action-auto" },
    disabled: (__VLS_ctx.loading || __VLS_ctx.optimizing || __VLS_ctx.pendingJobs.length === 0),
});
if (__VLS_ctx.optimizing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "job-scheduler-action-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-4 w-4" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_12 = {}.BoltIcon;
    /** @type {[typeof __VLS_components.BoltIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "w-5 h-5 mr-1" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "w-5 h-5 mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
if (__VLS_ctx.optimizationResults.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-results" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "job-scheduler-section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "job-scheduler-results-list" },
    });
    for (const [result] of __VLS_getVForSourceType((__VLS_ctx.optimizationResults))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (result.jobId),
            ...{ class: "job-scheduler-result-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-result-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-result-title" },
        });
        (result.jobNumber);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "job-scheduler-result-status" },
            ...{ class: (result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') },
        });
        (result.success ? 'SCHEDULED' : 'FAILED');
        if (result.success) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-result-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-result-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-value" },
            });
            (result.machine);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-result-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-value" },
            });
            (result.operator);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-result-detail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "job-scheduler-result-detail-value" },
            });
            (result.status);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "job-scheduler-result-error" },
            });
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ClipboardDocumentCheckIcon: ClipboardDocumentCheckIcon,
            SparklesIcon: SparklesIcon,
            BoltIcon: BoltIcon,
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
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
