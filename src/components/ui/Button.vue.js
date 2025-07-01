import { computed, ref } from 'vue';
import { prefersReducedMotion } from '../../utils/accessibility';
const props = withDefaults(defineProps(), {
    variant: 'primary',
    size: 'md',
    as: 'button',
    type: 'button',
    disabled: false,
    loading: false,
    loadingText: '',
    fullWidth: false,
    rounded: false,
    ripple: true
});
const emit = defineEmits();
// Ripple effect
const rippleRef = ref(null);
const rippleEnabled = computed(() => props.ripple && !prefersReducedMotion());
// Button classes
const buttonClasses = computed(() => {
    return [
        'button',
        `button-${props.variant}`,
        `button-${props.size}`,
        {
            'button-disabled': props.disabled,
            'button-loading': props.loading,
            'button-full-width': props.fullWidth,
            'button-rounded': props.rounded,
            'button-with-icon-left': props.iconLeft,
            'button-with-icon-right': props.iconRight,
            'button-with-ripple': rippleEnabled.value
        }
    ];
});
// Handle click with ripple effect
const handleClick = (event) => {
    if (props.disabled || props.loading)
        return;
    if (rippleEnabled.value && rippleRef.value) {
        createRippleEffect(event);
    }
    emit('click', event);
};
// Create ripple effect
const createRippleEffect = (event) => {
    const button = event.currentTarget;
    const rippleContainer = rippleRef.value;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    const left = event.clientX - rect.left - radius;
    const top = event.clientY - rect.top - radius;
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${left}px`;
    ripple.style.top = `${top}px`;
    ripple.classList.add('button-ripple');
    // Remove existing ripples
    const existingRipples = rippleContainer.querySelectorAll('.button-ripple');
    existingRipples.forEach(r => r.remove());
    rippleContainer.appendChild(ripple);
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    variant: 'primary',
    size: 'md',
    as: 'button',
    type: 'button',
    disabled: false,
    loading: false,
    loadingText: '',
    fullWidth: false,
    rounded: false,
    ripple: true
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['button-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-success']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-success']} */ ;
/** @type {__VLS_StyleScopedClasses['button-success']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['button-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-info']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-info']} */ ;
/** @type {__VLS_StyleScopedClasses['button-info']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ripple']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['button-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['button-success']} */ ;
/** @type {__VLS_StyleScopedClasses['button-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['button-info']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = ((__VLS_ctx.as));
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.type),
    ...{ class: (__VLS_ctx.buttonClasses) },
    disabled: (__VLS_ctx.disabled || __VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.type),
    ...{ class: (__VLS_ctx.buttonClasses) },
    disabled: (__VLS_ctx.disabled || __VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleClick)
};
var __VLS_8 = {};
__VLS_3.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "button-spinner" },
        'aria-hidden': "true",
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
if (__VLS_ctx.iconLeft && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "button-icon button-icon-left" },
    });
    const __VLS_9 = ((__VLS_ctx.iconLeft));
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "button-content" },
    ...{ class: ({ 'sr-only': __VLS_ctx.loading && __VLS_ctx.loadingText }) },
});
var __VLS_13 = {};
(__VLS_ctx.label);
if (__VLS_ctx.loading && __VLS_ctx.loadingText) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "button-loading-text" },
    });
    (__VLS_ctx.loadingText);
}
if (__VLS_ctx.iconRight && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "button-icon button-icon-right" },
    });
    const __VLS_15 = ((__VLS_ctx.iconRight));
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
    const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
}
if (__VLS_ctx.ripple) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ref: "rippleRef",
        ...{ class: "button-ripple-container" },
    });
    /** @type {typeof __VLS_ctx.rippleRef} */ ;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['button-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['button-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['button-icon-left']} */ ;
/** @type {__VLS_StyleScopedClasses['button-content']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['button-loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['button-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['button-icon-right']} */ ;
/** @type {__VLS_StyleScopedClasses['button-ripple-container']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
[__VLS_dollars.$attrs,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            rippleRef: rippleRef,
            buttonClasses: buttonClasses,
            handleClick: handleClick,
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
