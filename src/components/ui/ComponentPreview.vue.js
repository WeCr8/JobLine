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
var Preview_vue_1 = require("./Preview.vue");
var props = withDefaults(defineProps(), {
    code: '',
    props: function () { return []; },
    states: function () { return []; },
    initialState: '',
    loading: false,
    error: false,
    errorMessage: ''
});
var __VLS_emit = defineEmits();
var activeTab = (0, vue_1.ref)('preview');
var tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'props', label: 'Props' }
];
var previewStates = (0, vue_1.computed)(function () {
    if (props.states.length === 0) {
        return [{ id: 'default', name: 'Default' }];
    }
    return props.states;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    code: '',
    props: function () { return []; },
    states: function () { return []; },
    initialState: '',
    loading: false,
    error: false,
    errorMessage: ''
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['component-preview-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tab-active']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "component-preview-title" }));
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-tabs" }));
var _loop_1 = function (tab) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.activeTab = tab.id;
        } }, { key: (tab.id) }), { class: "component-preview-tab" }), { class: ({ 'component-preview-tab-active': __VLS_ctx.activeTab === tab.id }) }), { 'aria-selected': (__VLS_ctx.activeTab === tab.id), role: "tab" }));
    (tab.label);
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.tabs)); _i < _a.length; _i++) {
    var tab = _a[_i][0];
    _loop_1(tab);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-content" }));
if (__VLS_ctx.activeTab === 'preview') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-preview" }));
    /** @type {[typeof Preview, typeof Preview, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(Preview_vue_1.default, new Preview_vue_1.default(__assign({ 'onRetry': {} }, { states: (__VLS_ctx.previewStates), initialState: (__VLS_ctx.initialState), loading: (__VLS_ctx.loading), error: (__VLS_ctx.error), errorMessage: (__VLS_ctx.errorMessage), retryEnabled: (true) })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onRetry': {} }, { states: (__VLS_ctx.previewStates), initialState: (__VLS_ctx.initialState), loading: (__VLS_ctx.loading), error: (__VLS_ctx.error), errorMessage: (__VLS_ctx.errorMessage), retryEnabled: (true) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onRetry: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'preview'))
                return;
            __VLS_ctx.$emit('retry');
        }
    };
    __VLS_2.slots.default;
    {
        var __VLS_thisSlot = __VLS_2.slots.default;
        var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
        var __VLS_7 = {
            state: (state),
        };
    }
    var __VLS_2;
}
else if (__VLS_ctx.activeTab === 'code') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-code" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
    (__VLS_ctx.code);
}
else if (__VLS_ctx.activeTab === 'props') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-preview-props" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(__assign({ class: "component-preview-props-table" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (var _b = 0, _c = __VLS_getVForSourceType((props)); _b < _c.length; _b++) {
        var prop = _c[_b][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (prop.name),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (prop.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
        (prop.type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
        (prop.default);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (prop.description);
    }
}
/** @type {__VLS_StyleScopedClasses['component-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-tab-active']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-code']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props']} */ ;
/** @type {__VLS_StyleScopedClasses['component-preview-props-table']} */ ;
// @ts-ignore
var __VLS_8 = __VLS_7;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            Preview: Preview_vue_1.default,
            activeTab: activeTab,
            tabs: tabs,
            previewStates: previewStates,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
var __VLS_component = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
exports.default = {};
; /* PartiallyEnd: #4569/main.vue */
