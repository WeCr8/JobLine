import { ref, computed } from 'vue';
import Preview from './Preview.vue';
const props = withDefaults(defineProps(), {
    code: '',
    props: () => [],
    states: () => [],
    initialState: '',
    loading: false,
    error: false,
    errorMessage: ''
});
const __VLS_emit = defineEmits();
const activeTab = ref('preview');
const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'props', label: 'Props' }
];
const previewStates = computed(() => {
    if (props.states.length === 0) {
        return [{ id: 'default', name: 'Default' }];
    }
    return props.states;
});
const filteredProps = computed(() => {
    if (Array.isArray(props) && props.length && typeof props[0] === 'object' && 'name' in props[0]) {
        return props;
    }
    return [];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    code: '',
    props: () => [],
    states: () => [],
    initialState: '',
    loading: false,
    error: false,
    errorMessage: ''
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-preview-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "component-preview-title" },
});
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-preview-tabs" },
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.tabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.id;
            } },
        key: (tab.id),
        ...{ class: "component-preview-tab" },
        ...{ class: ({ 'component-preview-tab-active': __VLS_ctx.activeTab === tab.id }) },
        'aria-selected': (__VLS_ctx.activeTab === tab.id),
        role: "tab",
    });
    (tab.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-preview-content" },
});
if (__VLS_ctx.activeTab === 'preview') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-preview-preview" },
    });
    /** @type {[typeof Preview, typeof Preview, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(Preview, new Preview({
        ...{ 'onRetry': {} },
        states: (__VLS_ctx.previewStates),
        initialState: (__VLS_ctx.initialState),
        loading: (__VLS_ctx.loading),
        error: (__VLS_ctx.error),
        errorMessage: (__VLS_ctx.errorMessage),
        retryEnabled: (true),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onRetry': {} },
        states: (__VLS_ctx.previewStates),
        initialState: (__VLS_ctx.initialState),
        loading: (__VLS_ctx.loading),
        error: (__VLS_ctx.error),
        errorMessage: (__VLS_ctx.errorMessage),
        retryEnabled: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onRetry: (...[$event]) => {
            if (!(__VLS_ctx.activeTab === 'preview'))
                return;
            __VLS_ctx.$emit('retry');
        }
    };
    __VLS_2.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_2.slots;
        const [{ state }] = __VLS_getSlotParams(__VLS_thisSlot);
        var __VLS_7 = {
            state: (state),
        };
    }
    var __VLS_2;
}
else if (__VLS_ctx.activeTab === 'code') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-preview-code" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
    (__VLS_ctx.code);
}
else if (__VLS_ctx.activeTab === 'props') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-preview-props" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "component-preview-props-table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [prop] of __VLS_getVForSourceType((__VLS_ctx.filteredProps))) {
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Preview: Preview,
            activeTab: activeTab,
            tabs: tabs,
            previewStates: previewStates,
            filteredProps: filteredProps,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
