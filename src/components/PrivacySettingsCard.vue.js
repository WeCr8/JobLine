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
var SettingsSection_vue_1 = require("./SettingsSection.vue");
var SettingsToggle_vue_1 = require("./SettingsToggle.vue");
var __VLS_props = defineProps();
var __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {[typeof SettingsSection, typeof SettingsSection, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(SettingsSection_vue_1.default, new SettingsSection_vue_1.default({
    title: "Privacy Settings",
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        title: "Privacy Settings",
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
var __VLS_4 = __VLS_asFunctionalComponent(SettingsToggle_vue_1.default, new SettingsToggle_vue_1.default(__assign({ 'onUpdate:modelValue': {} }, { label: "Usage Analytics", description: "Allow us to collect anonymous usage data", modelValue: (__VLS_ctx.analyticsEnabled) })));
var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { label: "Usage Analytics", description: "Allow us to collect anonymous usage data", modelValue: (__VLS_ctx.analyticsEnabled) })], __VLS_functionalComponentArgsRest(__VLS_4), false));
var __VLS_7;
var __VLS_8;
var __VLS_9;
var __VLS_10 = {
    'onUpdate:modelValue': function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('update:analyticsEnabled', $event);
    }
};
var __VLS_6;
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(SettingsToggle_vue_1.default, new SettingsToggle_vue_1.default(__assign({ 'onUpdate:modelValue': {} }, { label: "Error Reporting", description: "Send error reports to help improve the app", modelValue: (__VLS_ctx.errorReportingEnabled) })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { label: "Error Reporting", description: "Send error reports to help improve the app", modelValue: (__VLS_ctx.errorReportingEnabled) })], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14;
var __VLS_15;
var __VLS_16;
var __VLS_17 = {
    'onUpdate:modelValue': function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('update:errorReportingEnabled', $event);
    }
};
var __VLS_13;
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
var __VLS_18 = __VLS_asFunctionalComponent(SettingsToggle_vue_1.default, new SettingsToggle_vue_1.default(__assign({ 'onUpdate:modelValue': {} }, { label: "Marketing Communications", description: "Receive updates about new features and offers", modelValue: (__VLS_ctx.marketingEnabled) })));
var __VLS_19 = __VLS_18.apply(void 0, __spreadArray([__assign({ 'onUpdate:modelValue': {} }, { label: "Marketing Communications", description: "Receive updates about new features and offers", modelValue: (__VLS_ctx.marketingEnabled) })], __VLS_functionalComponentArgsRest(__VLS_18), false));
var __VLS_21;
var __VLS_22;
var __VLS_23;
var __VLS_24 = {
    'onUpdate:modelValue': function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('update:marketingEnabled', $event);
    }
};
var __VLS_20;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            SettingsSection: SettingsSection_vue_1.default,
            SettingsToggle: SettingsToggle_vue_1.default,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
