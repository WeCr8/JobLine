import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ChevronDownIcon, XMarkIcon, PlusIcon, BoltIcon } from '@heroicons/vue/24/outline';
const props = withDefaults(defineProps(), {
    sourceFields: () => [],
    targetFields: () => [],
    sampleData: () => [],
    title: '',
    description: '',
    showCompliance: true,
    showAutoMap: true,
    showSampleData: true,
    disabled: false
});
const emit = defineEmits();
// Internal state
const mappings = ref([...props.modelValue]);
const activeSourceDropdown = ref(null);
const activeTargetDropdown = ref(null);
// Computed
const sampleDataFields = computed(() => {
    if (props.sampleData.length === 0)
        return [];
    return Object.keys(props.sampleData[0] || {});
});
const canAutoMap = computed(() => {
    return props.sourceFields.length > 0 && props.targetFields.length > 0;
});
// Methods
const addMapping = () => {
    mappings.value.push({
        sourceField: '',
        targetField: '',
        required: false,
        complianceFlag: false
    });
    updateModelValue();
};
const removeMapping = (index) => {
    mappings.value.splice(index, 1);
    updateModelValue();
};
const toggleSourceDropdown = (index) => {
    activeSourceDropdown.value = activeSourceDropdown.value === index ? null : index;
    activeTargetDropdown.value = null;
};
const toggleTargetDropdown = (index) => {
    activeTargetDropdown.value = activeTargetDropdown.value === index ? null : index;
    activeSourceDropdown.value = null;
};
const selectSourceField = (index, field) => {
    mappings.value[index].sourceField = field;
    activeSourceDropdown.value = null;
    updateModelValue();
};
const selectTargetField = (index, field) => {
    mappings.value[index].targetField = field;
    activeTargetDropdown.value = null;
    updateModelValue();
};
const updateModelValue = () => {
    emit('update:modelValue', [...mappings.value]);
    emit('change', [...mappings.value]);
};
const autoMap = () => {
    // Simple auto-mapping based on field name similarity
    const newMappings = [];
    // First, try exact matches
    props.sourceFields.forEach(sourceField => {
        const normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Look for exact match in target fields
        const exactMatch = props.targetFields.find(targetField => {
            const normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedSourceField === normalizedTargetField;
        });
        if (exactMatch) {
            newMappings.push({
                sourceField,
                targetField: exactMatch,
                required: false,
                complianceFlag: false
            });
        }
    });
    // Then, try partial matches for remaining fields
    props.sourceFields.forEach(sourceField => {
        // Skip if already mapped
        if (newMappings.some(m => m.sourceField === sourceField)) {
            return;
        }
        const normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Look for partial match in target fields
        const partialMatches = props.targetFields
            .filter(targetField => {
            // Skip if already used
            if (newMappings.some(m => m.targetField === targetField)) {
                return false;
            }
            const normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedSourceField.includes(normalizedTargetField) ||
                normalizedTargetField.includes(normalizedSourceField);
        })
            .sort((a, b) => {
            // Prioritize by similarity
            const aSimilarity = calculateSimilarity(sourceField, a);
            const bSimilarity = calculateSimilarity(sourceField, b);
            return bSimilarity - aSimilarity;
        });
        if (partialMatches.length > 0) {
            newMappings.push({
                sourceField,
                targetField: partialMatches[0],
                required: false,
                complianceFlag: false
            });
        }
    });
    // Set the new mappings
    mappings.value = newMappings;
    updateModelValue();
};
const calculateSimilarity = (a, b) => {
    const normalizedA = a.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedB = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Simple Levenshtein distance
    const matrix = [];
    // Initialize matrix
    for (let i = 0; i <= normalizedA.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= normalizedB.length; j++) {
        matrix[0][j] = j;
    }
    // Fill matrix
    for (let i = 1; i <= normalizedA.length; i++) {
        for (let j = 1; j <= normalizedB.length; j++) {
            if (normalizedA[i - 1] === normalizedB[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }
    // Calculate similarity (0-1)
    const maxLength = Math.max(normalizedA.length, normalizedB.length);
    if (maxLength === 0)
        return 1; // Both strings are empty
    const distance = matrix[normalizedA.length][normalizedB.length];
    return 1 - distance / maxLength;
};
// Watch for external changes
watch(() => props.modelValue, (newValue) => {
    mappings.value = [...newValue];
}, { deep: true });
// Initialize with at least one mapping
if (mappings.value.length === 0) {
    addMapping();
}
// Close dropdowns when clicking outside
const handleClickOutside = () => {
    if (activeSourceDropdown.value !== null || activeTargetDropdown.value !== null) {
        activeSourceDropdown.value = null;
        activeTargetDropdown.value = null;
    }
};
// Add event listener
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    sourceFields: () => [],
    targetFields: () => [],
    sampleData: () => [],
    title: '',
    description: '',
    showCompliance: true,
    showAutoMap: true,
    showSampleData: true,
    disabled: false
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['data-mapper-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-input']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-input']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-checkbox']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-mapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-mapper-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "data-mapper-title" },
});
(__VLS_ctx.title || 'Data Field Mapping');
if (__VLS_ctx.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "data-mapper-description" },
    });
    (__VLS_ctx.description);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-mapper-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-mapper-table-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "data-mapper-table" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
if (__VLS_ctx.showCompliance) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
for (const [mapping, index] of __VLS_getVForSourceType((__VLS_ctx.mappings))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (index),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-mapper-field" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (mapping.sourceField),
        type: "text",
        ...{ class: "data-mapper-input" },
        placeholder: "Source field",
        disabled: (__VLS_ctx.disabled),
    });
    if (__VLS_ctx.sourceFields.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "data-mapper-dropdown" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.sourceFields.length > 0))
                        return;
                    __VLS_ctx.toggleSourceDropdown(index);
                } },
            type: "button",
            ...{ class: "data-mapper-dropdown-button" },
            disabled: (__VLS_ctx.disabled),
        });
        const __VLS_0 = {}.ChevronDownIcon;
        /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ class: "w-4 h-4" },
        }));
        const __VLS_2 = __VLS_1({
            ...{ class: "w-4 h-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        if (__VLS_ctx.activeSourceDropdown === index) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "data-mapper-dropdown-menu" },
            });
            for (const [field] of __VLS_getVForSourceType((__VLS_ctx.sourceFields))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.sourceFields.length > 0))
                                return;
                            if (!(__VLS_ctx.activeSourceDropdown === index))
                                return;
                            __VLS_ctx.selectSourceField(index, field);
                        } },
                    key: (field),
                    type: "button",
                    ...{ class: "data-mapper-dropdown-item" },
                });
                (field);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-mapper-field" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (mapping.targetField),
        type: "text",
        ...{ class: "data-mapper-input" },
        placeholder: "Target field",
        disabled: (__VLS_ctx.disabled),
    });
    if (__VLS_ctx.targetFields.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "data-mapper-dropdown" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.targetFields.length > 0))
                        return;
                    __VLS_ctx.toggleTargetDropdown(index);
                } },
            type: "button",
            ...{ class: "data-mapper-dropdown-button" },
            disabled: (__VLS_ctx.disabled),
        });
        const __VLS_4 = {}.ChevronDownIcon;
        /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ class: "w-4 h-4" },
        }));
        const __VLS_6 = __VLS_5({
            ...{ class: "w-4 h-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        if (__VLS_ctx.activeTargetDropdown === index) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "data-mapper-dropdown-menu" },
            });
            for (const [field] of __VLS_getVForSourceType((__VLS_ctx.targetFields))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.targetFields.length > 0))
                                return;
                            if (!(__VLS_ctx.activeTargetDropdown === index))
                                return;
                            __VLS_ctx.selectTargetField(index, field);
                        } },
                    key: (field),
                    type: "button",
                    ...{ class: "data-mapper-dropdown-item" },
                });
                (field);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-mapper-checkbox" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        id: (`required-${index}`),
        type: "checkbox",
        disabled: (__VLS_ctx.disabled),
    });
    (mapping.required);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (`required-${index}`),
        ...{ class: "sr-only" },
    });
    if (__VLS_ctx.showCompliance) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "data-mapper-checkbox" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            id: (`compliance-${index}`),
            type: "checkbox",
            disabled: (__VLS_ctx.disabled),
        });
        (mapping.complianceFlag);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: (`compliance-${index}`),
            ...{ class: "sr-only" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.removeMapping(index);
            } },
        type: "button",
        ...{ class: "data-mapper-action-button" },
        disabled: (__VLS_ctx.disabled),
        'aria-label': "Remove mapping",
    });
    const __VLS_8 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "data-mapper-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.addMapping) },
    type: "button",
    ...{ class: "data-mapper-add-button" },
    disabled: (__VLS_ctx.disabled),
});
const __VLS_12 = {}.PlusIcon;
/** @type {[typeof __VLS_components.PlusIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "w-4 h-4 mr-1" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "w-4 h-4 mr-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
if (__VLS_ctx.showAutoMap) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.autoMap) },
        type: "button",
        ...{ class: "data-mapper-auto-button" },
        disabled: (__VLS_ctx.disabled || !__VLS_ctx.canAutoMap),
    });
    const __VLS_16 = {}.BoltIcon;
    /** @type {[typeof __VLS_components.BoltIcon, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "w-4 h-4 mr-1" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "w-4 h-4 mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
if (__VLS_ctx.showSampleData && __VLS_ctx.sampleData.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-mapper-sample" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "data-mapper-sample-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-mapper-sample-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "data-mapper-sample-table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    for (const [field] of __VLS_getVForSourceType((__VLS_ctx.sampleDataFields))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            key: (field),
        });
        (field);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [row, rowIndex] of __VLS_getVForSourceType((__VLS_ctx.sampleData.slice(0, 3)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (rowIndex),
        });
        for (const [field] of __VLS_getVForSourceType((__VLS_ctx.sampleDataFields))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                key: (field),
            });
            (row[field]);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['data-mapper']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-header']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-description']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-field']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-input']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-field']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-input']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-auto-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-container']} */ ;
/** @type {__VLS_StyleScopedClasses['data-mapper-sample-table']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChevronDownIcon: ChevronDownIcon,
            XMarkIcon: XMarkIcon,
            PlusIcon: PlusIcon,
            BoltIcon: BoltIcon,
            mappings: mappings,
            activeSourceDropdown: activeSourceDropdown,
            activeTargetDropdown: activeTargetDropdown,
            sampleDataFields: sampleDataFields,
            canAutoMap: canAutoMap,
            addMapping: addMapping,
            removeMapping: removeMapping,
            toggleSourceDropdown: toggleSourceDropdown,
            toggleTargetDropdown: toggleTargetDropdown,
            selectSourceField: selectSourceField,
            selectTargetField: selectTargetField,
            autoMap: autoMap,
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
