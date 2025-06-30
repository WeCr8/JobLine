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
var ui_1 = require("../components/ui");
// Button demo data
var buttonProps = [
    { name: 'variant', type: 'string', default: 'primary', description: 'Button style variant' },
    { name: 'size', type: 'string', default: 'md', description: 'Button size' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading state' },
    { name: 'loadingText', type: 'string', default: '""', description: 'Text to show while loading' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Makes button full width' },
    { name: 'iconLeft', type: 'Component', default: 'undefined', description: 'Icon to show on the left' },
    { name: 'iconRight', type: 'Component', default: 'undefined', description: 'Icon to show on the right' },
    { name: 'ripple', type: 'boolean', default: 'true', description: 'Enable ripple effect on click' }
];
var buttonStates = [
    { id: 'default', name: 'Default' },
    { id: 'hover', name: 'Hover' },
    { id: 'active', name: 'Active' },
    { id: 'focus', name: 'Focus' }
];
var buttonSizeStates = [
    { id: 'default', name: 'Default' }
];
var buttonIconStates = [
    { id: 'default', name: 'Default' }
];
var buttonStateStates = [
    { id: 'default', name: 'Default' }
];
// Slider demo data
var sliderValue = (0, vue_1.ref)(50);
var sliderRangeValue = (0, vue_1.ref)([20, 80]);
var sliderTickValue = (0, vue_1.ref)(40);
var sliderVerticalValue = (0, vue_1.ref)(60);
var sliderProps = [
    { name: 'modelValue', type: 'number | number[]', default: '0', description: 'Current value(s)' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
    { name: 'step', type: 'number', default: '1', description: 'Step increment' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider' },
    { name: 'vertical', type: 'boolean', default: 'false', description: 'Vertical orientation' },
    { name: 'range', type: 'boolean', default: 'false', description: 'Range selection mode' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Show value label' },
    { name: 'showTicks', type: 'boolean', default: 'false', description: 'Show tick marks' },
    { name: 'ticks', type: 'array', default: '[]', description: 'Custom tick marks' }
];
var sliderStates = [
    { id: 'default', name: 'Default' }
];
var sliderRangeStates = [
    { id: 'default', name: 'Default' }
];
var sliderTickStates = [
    { id: 'default', name: 'Default' }
];
var sliderVerticalStates = [
    { id: 'default', name: 'Default' }
];
// Preview demo data
var previewProps = [
    { name: 'title', type: 'string', default: '""', description: 'Preview title' },
    { name: 'states', type: 'array', default: '[]', description: 'Available view states' },
    { name: 'initialState', type: 'string', default: '""', description: 'Initial state ID' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
    { name: 'errorMessage', type: 'string', default: '""', description: 'Error message to display' },
    { name: 'devices', type: 'array', default: '[...]', description: 'Available device options' },
    { name: 'initialDevice', type: 'string', default: '"desktop"', description: 'Initial device' }
];
var previewDeviceStates = [
    { id: 'default', name: 'Default View' },
    { id: 'loading', name: 'Loading State' },
    { id: 'error', name: 'Error State' }
];
// Code examples
var buttonVariantsCode = "<Button variant=\"primary\">Primary</Button>\n<Button variant=\"secondary\">Secondary</Button>\n<Button variant=\"ghost\">Ghost</Button>\n<Button variant=\"danger\">Danger</Button>\n<Button variant=\"success\">Success</Button>\n<Button variant=\"warning\">Warning</Button>\n<Button variant=\"info\">Info</Button>";
var buttonSizesCode = "<Button size=\"xs\">Extra Small</Button>\n<Button size=\"sm\">Small</Button>\n<Button size=\"md\">Medium</Button>\n<Button size=\"lg\">Large</Button>\n<Button size=\"xl\">Extra Large</Button>";
var buttonIconsCode = "<Button :icon-left=\"SearchIcon\">Search</Button>\n<Button :icon-right=\"ArrowRightIcon\">Next</Button>\n<Button variant=\"secondary\" :icon-left=\"DownloadIcon\">Download</Button>\n<Button variant=\"ghost\" :icon-left=\"TrashIcon\">Delete</Button>";
var buttonStatesCode = "<Button>Normal</Button>\n<Button disabled>Disabled</Button>\n<Button loading>Loading</Button>\n<Button loading loading-text=\"Processing...\">Submit</Button>";
var sliderBasicCode = "<Slider v-model=\"value\" :min=\"0\" :max=\"100\" :step=\"1\" />";
var sliderRangeCode = "<Slider \n  v-model=\"rangeValue\" \n  :min=\"0\" \n  :max=\"100\" \n  :step=\"1\" \n  range \n  show-value\n/>";
var sliderTicksCode = "<Slider \n  v-model=\"value\" \n  :min=\"0\" \n  :max=\"100\" \n  :step=\"20\" \n  show-ticks\n  :ticks=\"[\n    { value: 0, label: '0%' },\n    { value: 20, label: '20%' },\n    { value: 40, label: '40%' },\n    { value: 60, label: '60%' },\n    { value: 80, label: '80%' },\n    { value: 100, label: '100%' }\n  ]\"\n/>";
var sliderVerticalCode = "<Slider \n  v-model=\"value\" \n  :min=\"0\" \n  :max=\"100\" \n  :step=\"1\" \n  vertical\n  show-value\n/>";
var previewDeviceCode = "<Preview\n  :states=\"[\n    { id: 'default', name: 'Default View' },\n    { id: 'loading', name: 'Loading State' },\n    { id: 'error', name: 'Error State' }\n  ]\"\n  :loading=\"isLoading\"\n  :error=\"hasError\"\n  error-message=\"Failed to load content\"\n>\n  <div>\n    <h3>Preview Content</h3>\n    <p>This is a responsive preview that adapts to different device sizes.</p>\n    <Button>Click Me</Button>\n  </div>\n</Preview>";
// Icon components for demo
function SearchIcon() {
    return (0, vue_2.h)('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        (0, vue_2.h)('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
        })
    ]);
}
function ArrowRightIcon() {
    return (0, vue_2.h)('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        (0, vue_2.h)('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
        })
    ]);
}
function DownloadIcon() {
    return (0, vue_2.h)('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        (0, vue_2.h)('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
        })
    ]);
}
function TrashIcon() {
    return (0, vue_2.h)('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        (0, vue_2.h)('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
        })
    ]);
}
var vue_2 = require("vue");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['preview-demo-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-demo-content']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-description']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-description']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-value']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-library" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)(__assign({ class: "component-library-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "component-library-title" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "component-library-description" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)(__assign({ class: "component-library-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "component-library-section" }, { id: "buttons" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "component-library-section-title" }));
var __VLS_0 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    title: "Button Variants",
    code: (__VLS_ctx.buttonVariantsCode),
    props: (__VLS_ctx.buttonProps),
    states: (__VLS_ctx.buttonStates),
    initialState: "default",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        title: "Button Variants",
        code: (__VLS_ctx.buttonVariantsCode),
        props: (__VLS_ctx.buttonProps),
        states: (__VLS_ctx.buttonStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_3.slots.default;
{
    var __VLS_thisSlot = __VLS_3.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-grid" }));
    var __VLS_4 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        variant: "primary",
    }));
    var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([{
            variant: "primary",
        }], __VLS_functionalComponentArgsRest(__VLS_5), false));
    __VLS_7.slots.default;
    var __VLS_7;
    var __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        variant: "secondary",
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            variant: "secondary",
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
    __VLS_11.slots.default;
    var __VLS_11;
    var __VLS_12 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        variant: "ghost",
    }));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([{
            variant: "ghost",
        }], __VLS_functionalComponentArgsRest(__VLS_13), false));
    __VLS_15.slots.default;
    var __VLS_15;
    var __VLS_16 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        variant: "danger",
    }));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
            variant: "danger",
        }], __VLS_functionalComponentArgsRest(__VLS_17), false));
    __VLS_19.slots.default;
    var __VLS_19;
    var __VLS_20 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        variant: "success",
    }));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
            variant: "success",
        }], __VLS_functionalComponentArgsRest(__VLS_21), false));
    __VLS_23.slots.default;
    var __VLS_23;
    var __VLS_24 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        variant: "warning",
    }));
    var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([{
            variant: "warning",
        }], __VLS_functionalComponentArgsRest(__VLS_25), false));
    __VLS_27.slots.default;
    var __VLS_27;
    var __VLS_28 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        variant: "info",
    }));
    var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
            variant: "info",
        }], __VLS_functionalComponentArgsRest(__VLS_29), false));
    __VLS_31.slots.default;
    var __VLS_31;
}
var __VLS_3;
var __VLS_32 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    title: "Button Sizes",
    code: (__VLS_ctx.buttonSizesCode),
    states: (__VLS_ctx.buttonSizeStates),
    initialState: "default",
}));
var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([{
        title: "Button Sizes",
        code: (__VLS_ctx.buttonSizesCode),
        states: (__VLS_ctx.buttonSizeStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_33), false));
__VLS_35.slots.default;
{
    var __VLS_thisSlot = __VLS_35.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-flex" }));
    var __VLS_36 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        size: "xs",
    }));
    var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{
            size: "xs",
        }], __VLS_functionalComponentArgsRest(__VLS_37), false));
    __VLS_39.slots.default;
    var __VLS_39;
    var __VLS_40 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "sm",
    }));
    var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
            size: "sm",
        }], __VLS_functionalComponentArgsRest(__VLS_41), false));
    __VLS_43.slots.default;
    var __VLS_43;
    var __VLS_44 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: "md",
    }));
    var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{
            size: "md",
        }], __VLS_functionalComponentArgsRest(__VLS_45), false));
    __VLS_47.slots.default;
    var __VLS_47;
    var __VLS_48 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        size: "lg",
    }));
    var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([{
            size: "lg",
        }], __VLS_functionalComponentArgsRest(__VLS_49), false));
    __VLS_51.slots.default;
    var __VLS_51;
    var __VLS_52 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        size: "xl",
    }));
    var __VLS_54 = __VLS_53.apply(void 0, __spreadArray([{
            size: "xl",
        }], __VLS_functionalComponentArgsRest(__VLS_53), false));
    __VLS_55.slots.default;
    var __VLS_55;
}
var __VLS_35;
var __VLS_56 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    title: "Button with Icons",
    code: (__VLS_ctx.buttonIconsCode),
    states: (__VLS_ctx.buttonIconStates),
    initialState: "default",
}));
var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([{
        title: "Button with Icons",
        code: (__VLS_ctx.buttonIconsCode),
        states: (__VLS_ctx.buttonIconStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_57), false));
__VLS_59.slots.default;
{
    var __VLS_thisSlot = __VLS_59.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-flex" }));
    var __VLS_60 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        iconLeft: (__VLS_ctx.SearchIcon),
    }));
    var __VLS_62 = __VLS_61.apply(void 0, __spreadArray([{
            iconLeft: (__VLS_ctx.SearchIcon),
        }], __VLS_functionalComponentArgsRest(__VLS_61), false));
    __VLS_63.slots.default;
    var __VLS_63;
    var __VLS_64 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        iconRight: (__VLS_ctx.ArrowRightIcon),
    }));
    var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([{
            iconRight: (__VLS_ctx.ArrowRightIcon),
        }], __VLS_functionalComponentArgsRest(__VLS_65), false));
    __VLS_67.slots.default;
    var __VLS_67;
    var __VLS_68 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        variant: "secondary",
        iconLeft: (__VLS_ctx.DownloadIcon),
    }));
    var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([{
            variant: "secondary",
            iconLeft: (__VLS_ctx.DownloadIcon),
        }], __VLS_functionalComponentArgsRest(__VLS_69), false));
    __VLS_71.slots.default;
    var __VLS_71;
    var __VLS_72 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        variant: "ghost",
        iconLeft: (__VLS_ctx.TrashIcon),
    }));
    var __VLS_74 = __VLS_73.apply(void 0, __spreadArray([{
            variant: "ghost",
            iconLeft: (__VLS_ctx.TrashIcon),
        }], __VLS_functionalComponentArgsRest(__VLS_73), false));
    __VLS_75.slots.default;
    var __VLS_75;
}
var __VLS_59;
var __VLS_76 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    title: "Button States",
    code: (__VLS_ctx.buttonStatesCode),
    states: (__VLS_ctx.buttonStateStates),
    initialState: "default",
}));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([{
        title: "Button States",
        code: (__VLS_ctx.buttonStatesCode),
        states: (__VLS_ctx.buttonStateStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_77), false));
__VLS_79.slots.default;
{
    var __VLS_thisSlot = __VLS_79.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-grid" }));
    var __VLS_80 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
    var __VLS_82 = __VLS_81.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_81), false));
    __VLS_83.slots.default;
    var __VLS_83;
    var __VLS_84 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        disabled: true,
    }));
    var __VLS_86 = __VLS_85.apply(void 0, __spreadArray([{
            disabled: true,
        }], __VLS_functionalComponentArgsRest(__VLS_85), false));
    __VLS_87.slots.default;
    var __VLS_87;
    var __VLS_88 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        loading: true,
    }));
    var __VLS_90 = __VLS_89.apply(void 0, __spreadArray([{
            loading: true,
        }], __VLS_functionalComponentArgsRest(__VLS_89), false));
    __VLS_91.slots.default;
    var __VLS_91;
    var __VLS_92 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        loading: true,
        loadingText: "Processing...",
    }));
    var __VLS_94 = __VLS_93.apply(void 0, __spreadArray([{
            loading: true,
            loadingText: "Processing...",
        }], __VLS_functionalComponentArgsRest(__VLS_93), false));
    __VLS_95.slots.default;
    var __VLS_95;
}
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "component-library-section" }, { id: "sliders" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "component-library-section-title" }));
var __VLS_96 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    title: "Basic Slider",
    code: (__VLS_ctx.sliderBasicCode),
    props: (__VLS_ctx.sliderProps),
    states: (__VLS_ctx.sliderStates),
    initialState: "default",
}));
var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([{
        title: "Basic Slider",
        code: (__VLS_ctx.sliderBasicCode),
        props: (__VLS_ctx.sliderProps),
        states: (__VLS_ctx.sliderStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_97), false));
__VLS_99.slots.default;
{
    var __VLS_thisSlot = __VLS_99.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-container" }));
    var __VLS_100 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    var __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.sliderValue),
        min: (0),
        max: (100),
        step: (1),
    }));
    var __VLS_102 = __VLS_101.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.sliderValue),
            min: (0),
            max: (100),
            step: (1),
        }], __VLS_functionalComponentArgsRest(__VLS_101), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-value" }));
    (__VLS_ctx.sliderValue);
}
var __VLS_99;
var __VLS_104 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    title: "Range Slider",
    code: (__VLS_ctx.sliderRangeCode),
    states: (__VLS_ctx.sliderRangeStates),
    initialState: "default",
}));
var __VLS_106 = __VLS_105.apply(void 0, __spreadArray([{
        title: "Range Slider",
        code: (__VLS_ctx.sliderRangeCode),
        states: (__VLS_ctx.sliderRangeStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_105), false));
__VLS_107.slots.default;
{
    var __VLS_thisSlot = __VLS_107.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-container" }));
    var __VLS_108 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    var __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.sliderRangeValue),
        min: (0),
        max: (100),
        step: (1),
        range: true,
        showValue: true,
    }));
    var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.sliderRangeValue),
            min: (0),
            max: (100),
            step: (1),
            range: true,
            showValue: true,
        }], __VLS_functionalComponentArgsRest(__VLS_109), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-value" }));
    (__VLS_ctx.sliderRangeValue[0]);
    (__VLS_ctx.sliderRangeValue[1]);
}
var __VLS_107;
var __VLS_112 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    title: "Slider with Ticks",
    code: (__VLS_ctx.sliderTicksCode),
    states: (__VLS_ctx.sliderTickStates),
    initialState: "default",
}));
var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([{
        title: "Slider with Ticks",
        code: (__VLS_ctx.sliderTicksCode),
        states: (__VLS_ctx.sliderTickStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_113), false));
__VLS_115.slots.default;
{
    var __VLS_thisSlot = __VLS_115.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-container" }));
    var __VLS_116 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    var __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        modelValue: (__VLS_ctx.sliderTickValue),
        min: (0),
        max: (100),
        step: (20),
        showTicks: true,
        ticks: ([
            { value: 0, label: '0%' },
            { value: 20, label: '20%' },
            { value: 40, label: '40%' },
            { value: 60, label: '60%' },
            { value: 80, label: '80%' },
            { value: 100, label: '100%' }
        ]),
    }));
    var __VLS_118 = __VLS_117.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.sliderTickValue),
            min: (0),
            max: (100),
            step: (20),
            showTicks: true,
            ticks: ([
                { value: 0, label: '0%' },
                { value: 20, label: '20%' },
                { value: 40, label: '40%' },
                { value: 60, label: '60%' },
                { value: 80, label: '80%' },
                { value: 100, label: '100%' }
            ]),
        }], __VLS_functionalComponentArgsRest(__VLS_117), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-value" }));
    (__VLS_ctx.sliderTickValue);
}
var __VLS_115;
var __VLS_120 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    title: "Vertical Slider",
    code: (__VLS_ctx.sliderVerticalCode),
    states: (__VLS_ctx.sliderVerticalStates),
    initialState: "default",
}));
var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([{
        title: "Vertical Slider",
        code: (__VLS_ctx.sliderVerticalCode),
        states: (__VLS_ctx.sliderVerticalStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_121), false));
__VLS_123.slots.default;
{
    var __VLS_thisSlot = __VLS_123.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-container" }, { style: {} }));
    var __VLS_124 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    var __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        modelValue: (__VLS_ctx.sliderVerticalValue),
        min: (0),
        max: (100),
        step: (1),
        vertical: true,
        showValue: true,
    }));
    var __VLS_126 = __VLS_125.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.sliderVerticalValue),
            min: (0),
            max: (100),
            step: (1),
            vertical: true,
            showValue: true,
        }], __VLS_functionalComponentArgsRest(__VLS_125), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "component-demo-value" }));
    (__VLS_ctx.sliderVerticalValue);
}
var __VLS_123;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "component-library-section" }, { id: "preview" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "component-library-section-title" }));
var __VLS_128 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
var __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    title: "Device Preview",
    code: (__VLS_ctx.previewDeviceCode),
    props: (__VLS_ctx.previewProps),
    states: (__VLS_ctx.previewDeviceStates),
    initialState: "default",
}));
var __VLS_130 = __VLS_129.apply(void 0, __spreadArray([{
        title: "Device Preview",
        code: (__VLS_ctx.previewDeviceCode),
        props: (__VLS_ctx.previewProps),
        states: (__VLS_ctx.previewDeviceStates),
        initialState: "default",
    }], __VLS_functionalComponentArgsRest(__VLS_129), false));
__VLS_131.slots.default;
{
    var __VLS_thisSlot = __VLS_131.slots.default;
    var state = __VLS_getSlotParams(__VLS_thisSlot)[0].state;
    var __VLS_132 = {}.Preview;
    /** @type {[typeof __VLS_components.Preview, typeof __VLS_components.Preview, ]} */ ;
    // @ts-ignore
    var __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        states: ([
            { id: 'default', name: 'Default View' },
            { id: 'loading', name: 'Loading State' },
            { id: 'error', name: 'Error State' }
        ]),
        loading: (state.id === 'loading'),
        error: (state.id === 'error'),
        errorMessage: "Failed to load content",
    }));
    var __VLS_134 = __VLS_133.apply(void 0, __spreadArray([{
            states: ([
                { id: 'default', name: 'Default View' },
                { id: 'loading', name: 'Loading State' },
                { id: 'error', name: 'Error State' }
            ]),
            loading: (state.id === 'loading'),
            error: (state.id === 'error'),
            errorMessage: "Failed to load content",
        }], __VLS_functionalComponentArgsRest(__VLS_133), false));
    __VLS_135.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-demo-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    var __VLS_136 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    var __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
    var __VLS_138 = __VLS_137.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_137), false));
    __VLS_139.slots.default;
    var __VLS_139;
    var __VLS_135;
}
var __VLS_131;
/** @type {__VLS_StyleScopedClasses['component-library']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-header']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-description']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-content']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-value']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-value']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-value']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-demo-value']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section']} */ ;
/** @type {__VLS_StyleScopedClasses['component-library-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-demo-content']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            Button: ui_1.Button,
            Slider: ui_1.Slider,
            Preview: ui_1.Preview,
            ComponentPreview: ui_1.ComponentPreview,
            buttonProps: buttonProps,
            buttonStates: buttonStates,
            buttonSizeStates: buttonSizeStates,
            buttonIconStates: buttonIconStates,
            buttonStateStates: buttonStateStates,
            sliderValue: sliderValue,
            sliderRangeValue: sliderRangeValue,
            sliderTickValue: sliderTickValue,
            sliderVerticalValue: sliderVerticalValue,
            sliderProps: sliderProps,
            sliderStates: sliderStates,
            sliderRangeStates: sliderRangeStates,
            sliderTickStates: sliderTickStates,
            sliderVerticalStates: sliderVerticalStates,
            previewProps: previewProps,
            previewDeviceStates: previewDeviceStates,
            buttonVariantsCode: buttonVariantsCode,
            buttonSizesCode: buttonSizesCode,
            buttonIconsCode: buttonIconsCode,
            buttonStatesCode: buttonStatesCode,
            sliderBasicCode: sliderBasicCode,
            sliderRangeCode: sliderRangeCode,
            sliderTicksCode: sliderTicksCode,
            sliderVerticalCode: sliderVerticalCode,
            previewDeviceCode: previewDeviceCode,
            SearchIcon: SearchIcon,
            ArrowRightIcon: ArrowRightIcon,
            DownloadIcon: DownloadIcon,
            TrashIcon: TrashIcon,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
