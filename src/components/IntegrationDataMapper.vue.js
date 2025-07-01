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
var outline_1 = require("@heroicons/vue/24/outline");
var props = withDefaults(defineProps(), {
    sourceFields: function () { return []; },
    targetFields: function () { return []; },
    sampleData: function () { return []; },
    title: '',
    description: '',
    showCompliance: true,
    showAutoMap: true,
    showSampleData: true,
    disabled: false
});
var emit = defineEmits();
// Internal state
var mappings = (0, vue_1.ref)(__spreadArray([], props.modelValue, true));
var activeSourceDropdown = (0, vue_1.ref)(null);
var activeTargetDropdown = (0, vue_1.ref)(null);
// Computed
var sampleDataFields = (0, vue_1.computed)(function () {
    if (props.sampleData.length === 0)
        return [];
    return Object.keys(props.sampleData[0] || {});
});
var canAutoMap = (0, vue_1.computed)(function () {
    return props.sourceFields.length > 0 && props.targetFields.length > 0;
});
// Methods
var addMapping = function () {
    mappings.value.push({
        sourceField: '',
        targetField: '',
        required: false,
        complianceFlag: false
    });
    updateModelValue();
};
var removeMapping = function (index) {
    mappings.value.splice(index, 1);
    updateModelValue();
};
var toggleSourceDropdown = function (index) {
    activeSourceDropdown.value = activeSourceDropdown.value === index ? null : index;
    activeTargetDropdown.value = null;
};
var toggleTargetDropdown = function (index) {
    activeTargetDropdown.value = activeTargetDropdown.value === index ? null : index;
    activeSourceDropdown.value = null;
};
var selectSourceField = function (index, field) {
    mappings.value[index].sourceField = field;
    activeSourceDropdown.value = null;
    updateModelValue();
};
var selectTargetField = function (index, field) {
    mappings.value[index].targetField = field;
    activeTargetDropdown.value = null;
    updateModelValue();
};
var updateModelValue = function () {
    emit('update:modelValue', __spreadArray([], mappings.value, true));
    emit('change', __spreadArray([], mappings.value, true));
};
var autoMap = function () {
    // Simple auto-mapping based on field name similarity
    var newMappings = [];
    // First, try exact matches
    props.sourceFields.forEach(function (sourceField) {
        var normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Look for exact match in target fields
        var exactMatch = props.targetFields.find(function (targetField) {
            var normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedSourceField === normalizedTargetField;
        });
        if (exactMatch) {
            newMappings.push({
                sourceField: sourceField,
                targetField: exactMatch,
                required: false,
                complianceFlag: false
            });
        }
    });
    // Then, try partial matches for remaining fields
    props.sourceFields.forEach(function (sourceField) {
        // Skip if already mapped
        if (newMappings.some(function (m) { return m.sourceField === sourceField; })) {
            return;
        }
        var normalizedSourceField = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Look for partial match in target fields
        var partialMatches = props.targetFields
            .filter(function (targetField) {
            // Skip if already used
            if (newMappings.some(function (m) { return m.targetField === targetField; })) {
                return false;
            }
            var normalizedTargetField = targetField.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedSourceField.includes(normalizedTargetField) ||
                normalizedTargetField.includes(normalizedSourceField);
        })
            .sort(function (a, b) {
            // Prioritize by similarity
            var aSimilarity = calculateSimilarity(sourceField, a);
            var bSimilarity = calculateSimilarity(sourceField, b);
            return bSimilarity - aSimilarity;
        });
        if (partialMatches.length > 0) {
            newMappings.push({
                sourceField: sourceField,
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
var calculateSimilarity = function (a, b) {
    var normalizedA = a.toLowerCase().replace(/[^a-z0-9]/g, '');
    var normalizedB = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Simple Levenshtein distance
    var matrix = [];
    // Initialize matrix
    for (var i = 0; i <= normalizedA.length; i++) {
        matrix[i] = [i];
    }
    for (var j = 0; j <= normalizedB.length; j++) {
        matrix[0][j] = j;
    }
    // Fill matrix
    for (var i = 1; i <= normalizedA.length; i++) {
        for (var j = 1; j <= normalizedB.length; j++) {
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
    var maxLength = Math.max(normalizedA.length, normalizedB.length);
    if (maxLength === 0)
        return 1; // Both strings are empty
    var distance = matrix[normalizedA.length][normalizedB.length];
    return 1 - distance / maxLength;
};
// Watch for external changes
(0, vue_1.watch)(function () { return props.modelValue; }, function (newValue) {
    mappings.value = __spreadArray([], newValue, true);
}, { deep: true });
// Initialize with at least one mapping
if (mappings.value.length === 0) {
    addMapping();
}
// Close dropdowns when clicking outside
var handleClickOutside = function () {
    if (activeSourceDropdown.value !== null || activeTargetDropdown.value !== null) {
        activeSourceDropdown.value = null;
        activeTargetDropdown.value = null;
    }
};
// Add event listener
(0, vue_1.onMounted)(function () {
    document.addEventListener('click', handleClickOutside);
});
(0, vue_1.onUnmounted)(function () {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    sourceFields: function () { return []; },
    targetFields: function () { return []; },
    sampleData: function () { return []; },
    title: '',
    description: '',
    showCompliance: true,
    showAutoMap: true,
    showSampleData: true,
    disabled: false
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "data-mapper-title" }));
(__VLS_ctx.title || 'Data Field Mapping');
if (__VLS_ctx.description) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "data-mapper-description" }));
    (__VLS_ctx.description);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-table-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(__assign({ class: "data-mapper-table" }));
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
var _loop_1 = function (mapping, index) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        key: (index),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-field" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (mapping.sourceField), type: "text" }, { class: "data-mapper-input" }), { placeholder: "Source field", disabled: (__VLS_ctx.disabled) }));
    if (__VLS_ctx.sourceFields.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-dropdown" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.sourceFields.length > 0))
                    return;
                __VLS_ctx.toggleSourceDropdown(index);
            } }, { type: "button" }), { class: "data-mapper-dropdown-button" }), { disabled: (__VLS_ctx.disabled) }));
        var __VLS_0 = {}.ChevronDownIcon;
        /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
        // @ts-ignore
        var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-4 h-4" })));
        var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
        if (__VLS_ctx.activeSourceDropdown === index) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-dropdown-menu" }));
            var _loop_2 = function (field) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.sourceFields.length > 0))
                            return;
                        if (!(__VLS_ctx.activeSourceDropdown === index))
                            return;
                        __VLS_ctx.selectSourceField(index, field);
                    } }, { key: (field), type: "button" }), { class: "data-mapper-dropdown-item" }));
                (field);
            };
            for (var _k = 0, _l = __VLS_getVForSourceType((__VLS_ctx.sourceFields)); _k < _l.length; _k++) {
                var field = _l[_k][0];
                _loop_2(field);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-field" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (mapping.targetField), type: "text" }, { class: "data-mapper-input" }), { placeholder: "Target field", disabled: (__VLS_ctx.disabled) }));
    if (__VLS_ctx.targetFields.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-dropdown" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.targetFields.length > 0))
                    return;
                __VLS_ctx.toggleTargetDropdown(index);
            } }, { type: "button" }), { class: "data-mapper-dropdown-button" }), { disabled: (__VLS_ctx.disabled) }));
        var __VLS_4 = {}.ChevronDownIcon;
        /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
        // @ts-ignore
        var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign({ class: "w-4 h-4" })));
        var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_5), false));
        if (__VLS_ctx.activeTargetDropdown === index) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-dropdown-menu" }));
            var _loop_3 = function (field) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.targetFields.length > 0))
                            return;
                        if (!(__VLS_ctx.activeTargetDropdown === index))
                            return;
                        __VLS_ctx.selectTargetField(index, field);
                    } }, { key: (field), type: "button" }), { class: "data-mapper-dropdown-item" }));
                (field);
            };
            for (var _m = 0, _o = __VLS_getVForSourceType((__VLS_ctx.targetFields)); _m < _o.length; _m++) {
                var field = _o[_m][0];
                _loop_3(field);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-checkbox" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        id: ("required-".concat(index)),
        type: "checkbox",
        disabled: (__VLS_ctx.disabled),
    });
    (mapping.required);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: ("required-".concat(index)) }, { class: "sr-only" }));
    if (__VLS_ctx.showCompliance) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-checkbox" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            id: ("compliance-".concat(index)),
            type: "checkbox",
            disabled: (__VLS_ctx.disabled),
        });
        (mapping.complianceFlag);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: ("compliance-".concat(index)) }, { class: "sr-only" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.removeMapping(index);
        } }, { type: "button" }), { class: "data-mapper-action-button" }), { disabled: (__VLS_ctx.disabled), 'aria-label': "Remove mapping" }));
    var __VLS_8 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ class: "w-4 h-4" })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.mappings)); _i < _a.length; _i++) {
    var _b = _a[_i], mapping = _b[0], index = _b[1];
    _loop_1(mapping, index);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.addMapping) }, { type: "button" }), { class: "data-mapper-add-button" }), { disabled: (__VLS_ctx.disabled) }));
var __VLS_12 = {}.PlusIcon;
/** @type {[typeof __VLS_components.PlusIcon, ]} */ ;
// @ts-ignore
var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign({ class: "w-4 h-4 mr-1" })));
var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 mr-1" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
if (__VLS_ctx.showAutoMap) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.autoMap) }, { type: "button" }), { class: "data-mapper-auto-button" }), { disabled: (__VLS_ctx.disabled || !__VLS_ctx.canAutoMap) }));
    var __VLS_16 = {}.BoltIcon;
    /** @type {[typeof __VLS_components.BoltIcon, ]} */ ;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16(__assign({ class: "w-4 h-4 mr-1" })));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 mr-1" })], __VLS_functionalComponentArgsRest(__VLS_17), false));
}
if (__VLS_ctx.showSampleData && __VLS_ctx.sampleData.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-sample" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "data-mapper-sample-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "data-mapper-sample-container" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(__assign({ class: "data-mapper-sample-table" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.sampleDataFields)); _c < _d.length; _c++) {
        var field = _d[_c][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            key: (field),
        });
        (field);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.sampleData.slice(0, 3))); _e < _f.length; _e++) {
        var _g = _f[_e], row = _g[0], rowIndex = _g[1];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (rowIndex),
        });
        for (var _h = 0, _j = __VLS_getVForSourceType((__VLS_ctx.sampleDataFields)); _h < _j.length; _h++) {
            var field = _j[_h][0];
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
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            ChevronDownIcon: outline_1.ChevronDownIcon,
            XMarkIcon: outline_1.XMarkIcon,
            PlusIcon: outline_1.PlusIcon,
            BoltIcon: outline_1.BoltIcon,
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
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
