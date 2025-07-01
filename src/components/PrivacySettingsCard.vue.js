import SettingsSection from './SettingsSection.vue';
import SettingsToggle from './SettingsToggle.vue';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof SettingsSection, typeof SettingsSection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SettingsSection, new SettingsSection({
    title: "Privacy Settings",
}));
const __VLS_1 = __VLS_0({
    title: "Privacy Settings",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(SettingsToggle, new SettingsToggle({
    ...{ 'onUpdate:modelValue': {} },
    label: "Usage Analytics",
    description: "Allow us to collect anonymous usage data",
    modelValue: (__VLS_ctx.analyticsEnabled),
}));
const __VLS_5 = __VLS_4({
    ...{ 'onUpdate:modelValue': {} },
    label: "Usage Analytics",
    description: "Allow us to collect anonymous usage data",
    modelValue: (__VLS_ctx.analyticsEnabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:analyticsEnabled', $event);
    }
};
var __VLS_6;
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(SettingsToggle, new SettingsToggle({
    ...{ 'onUpdate:modelValue': {} },
    label: "Error Reporting",
    description: "Send error reports to help improve the app",
    modelValue: (__VLS_ctx.errorReportingEnabled),
}));
const __VLS_12 = __VLS_11({
    ...{ 'onUpdate:modelValue': {} },
    label: "Error Reporting",
    description: "Send error reports to help improve the app",
    modelValue: (__VLS_ctx.errorReportingEnabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_14;
let __VLS_15;
let __VLS_16;
const __VLS_17 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:errorReportingEnabled', $event);
    }
};
var __VLS_13;
/** @type {[typeof SettingsToggle, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(SettingsToggle, new SettingsToggle({
    ...{ 'onUpdate:modelValue': {} },
    label: "Marketing Communications",
    description: "Receive updates about new features and offers",
    modelValue: (__VLS_ctx.marketingEnabled),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onUpdate:modelValue': {} },
    label: "Marketing Communications",
    description: "Receive updates about new features and offers",
    modelValue: (__VLS_ctx.marketingEnabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:marketingEnabled', $event);
    }
};
var __VLS_20;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SettingsSection: SettingsSection,
            SettingsToggle: SettingsToggle,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
