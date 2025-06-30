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
var accessibility_1 = require("../../utils/accessibility");
var props = withDefaults(defineProps(), {
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
var emit = defineEmits();
// Ripple effect
var rippleRef = (0, vue_1.ref)(null);
var rippleEnabled = (0, vue_1.computed)(function () { return props.ripple && !(0, accessibility_1.prefersReducedMotion)(); });
// Button classes
var buttonClasses = (0, vue_1.computed)(function () {
    return [
        'button',
        "button-".concat(props.variant),
        "button-".concat(props.size),
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
var handleClick = function (event) {
    if (props.disabled || props.loading)
        return;
    if (rippleEnabled.value && rippleRef.value) {
        createRippleEffect(event);
    }
    emit('click', event);
};
// Create ripple effect
var createRippleEffect = function (event) {
    var button = event.currentTarget;
    var rippleContainer = rippleRef.value;
    var diameter = Math.max(button.clientWidth, button.clientHeight);
    var radius = diameter / 2;
    var rect = button.getBoundingClientRect();
    var left = event.clientX - rect.left - radius;
    var top = event.clientY - rect.top - radius;
    var ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = "".concat(diameter, "px");
    ripple.style.left = "".concat(left, "px");
    ripple.style.top = "".concat(top, "px");
    ripple.classList.add('button-ripple');
    // Remove existing ripples
    var existingRipples = rippleContainer.querySelectorAll('.button-ripple');
    existingRipples.forEach(function (r) { return r.remove(); });
    rippleContainer.appendChild(ripple);
    // Remove ripple after animation
    setTimeout(function () {
        ripple.remove();
    }, 600);
};
// Clean up any remaining ripples
(0, vue_1.onUnmounted)(function () {
    if (rippleRef.value) {
        var ripples = rippleRef.value.querySelectorAll('.button-ripple');
        ripples.forEach(function (r) { return r.remove(); });
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
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
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
var __VLS_0 = ((__VLS_ctx.as));
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onClick': {} }, { type: (__VLS_ctx.type) }), { class: (__VLS_ctx.buttonClasses) }), { disabled: (__VLS_ctx.disabled || __VLS_ctx.loading) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onClick': {} }, { type: (__VLS_ctx.type) }), { class: (__VLS_ctx.buttonClasses) }), { disabled: (__VLS_ctx.disabled || __VLS_ctx.loading) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6;
var __VLS_7 = {
    onClick: (__VLS_ctx.handleClick)
};
var __VLS_8 = {};
__VLS_3.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "button-spinner" }, { 'aria-hidden': "true" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-4 w-4" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
}
if (__VLS_ctx.iconLeft && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "button-icon button-icon-left" }));
    var __VLS_9 = ((__VLS_ctx.iconLeft));
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_10), false));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "button-content" }, { class: ({ 'sr-only': __VLS_ctx.loading && __VLS_ctx.loadingText }) }));
var __VLS_13 = {};
(__VLS_ctx.label);
if (__VLS_ctx.loading && __VLS_ctx.loadingText) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "button-loading-text" }));
    (__VLS_ctx.loadingText);
}
if (__VLS_ctx.iconRight && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "button-icon button-icon-right" }));
    var __VLS_15 = ((__VLS_ctx.iconRight));
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_16), false));
}
if (__VLS_ctx.ripple) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ ref: "rippleRef" }, { class: "button-ripple-container" }));
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
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
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
