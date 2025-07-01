import { ref } from 'vue';
import { Button, Slider, Preview, ComponentPreview } from '../components/ui';
// Button demo data
const buttonProps = [
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
const buttonStates = [
    { id: 'default', name: 'Default' },
    { id: 'hover', name: 'Hover' },
    { id: 'active', name: 'Active' },
    { id: 'focus', name: 'Focus' }
];
const buttonSizeStates = [
    { id: 'default', name: 'Default' }
];
const buttonIconStates = [
    { id: 'default', name: 'Default' }
];
const buttonStateStates = [
    { id: 'default', name: 'Default' }
];
// Slider demo data
const sliderValue = ref(50);
const sliderRangeValue = ref([20, 80]);
const sliderTickValue = ref(40);
const sliderVerticalValue = ref(60);
const sliderProps = [
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
const sliderStates = [
    { id: 'default', name: 'Default' }
];
const sliderRangeStates = [
    { id: 'default', name: 'Default' }
];
const sliderTickStates = [
    { id: 'default', name: 'Default' }
];
const sliderVerticalStates = [
    { id: 'default', name: 'Default' }
];
// Preview demo data
const previewProps = [
    { name: 'title', type: 'string', default: '""', description: 'Preview title' },
    { name: 'states', type: 'array', default: '[]', description: 'Available view states' },
    { name: 'initialState', type: 'string', default: '""', description: 'Initial state ID' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
    { name: 'errorMessage', type: 'string', default: '""', description: 'Error message to display' },
    { name: 'devices', type: 'array', default: '[...]', description: 'Available device options' },
    { name: 'initialDevice', type: 'string', default: '"desktop"', description: 'Initial device' }
];
const previewDeviceStates = [
    { id: 'default', name: 'Default View' },
    { id: 'loading', name: 'Loading State' },
    { id: 'error', name: 'Error State' }
];
// Code examples
const buttonVariantsCode = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>`;
const buttonSizesCode = `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`;
const buttonIconsCode = `<Button :icon-left="SearchIcon">Search</Button>
<Button :icon-right="ArrowRightIcon">Next</Button>
<Button variant="secondary" :icon-left="DownloadIcon">Download</Button>
<Button variant="ghost" :icon-left="TrashIcon">Delete</Button>`;
const buttonStatesCode = `<Button>Normal</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button loading loading-text="Processing...">Submit</Button>`;
const sliderBasicCode = `<Slider v-model="value" :min="0" :max="100" :step="1" />`;
const sliderRangeCode = `<Slider 
  v-model="rangeValue" 
  :min="0" 
  :max="100" 
  :step="1" 
  range 
  show-value
/>`;
const sliderTicksCode = `<Slider 
  v-model="value" 
  :min="0" 
  :max="100" 
  :step="20" 
  show-ticks
  :ticks="[
    { value: 0, label: '0%' },
    { value: 20, label: '20%' },
    { value: 40, label: '40%' },
    { value: 60, label: '60%' },
    { value: 80, label: '80%' },
    { value: 100, label: '100%' }
  ]"
/>`;
const sliderVerticalCode = `<Slider 
  v-model="value" 
  :min="0" 
  :max="100" 
  :step="1" 
  vertical
  show-value
/>`;
const previewDeviceCode = `<Preview
  :states="[
    { id: 'default', name: 'Default View' },
    { id: 'loading', name: 'Loading State' },
    { id: 'error', name: 'Error State' }
  ]"
  :loading="false"
  :error="false"
  error-message="Failed to load content"
>
  <div>
    <h3>Preview Content</h3>
    <p>This is a responsive preview that adapts to different device sizes.</p>
    <Button>Click Me</Button>
  </div>
</Preview>`;
// Icon components for demo
function SearchIcon() {
    return h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
        })
    ]);
}
function ArrowRightIcon() {
    return h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
        })
    ]);
}
function DownloadIcon() {
    return h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
        })
    ]);
}
function TrashIcon() {
    return h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        'stroke-width': '1.5',
        stroke: 'currentColor'
    }, [
        h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
        })
    ]);
}
import { h } from 'vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "component-library" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "component-library-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "component-library-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "component-library-description" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "component-library-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "component-library-section" },
    id: "buttons",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "component-library-section-title" },
});
const __VLS_0 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    title: "Button Variants",
    code: (__VLS_ctx.buttonVariantsCode),
    props: (__VLS_ctx.buttonProps),
    states: (__VLS_ctx.buttonStates),
    initialState: "default",
}));
const __VLS_2 = __VLS_1({
    title: "Button Variants",
    code: (__VLS_ctx.buttonVariantsCode),
    props: (__VLS_ctx.buttonProps),
    states: (__VLS_ctx.buttonStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-grid" },
    });
    const __VLS_4 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        variant: "primary",
    }));
    const __VLS_6 = __VLS_5({
        variant: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    var __VLS_7;
    const __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        variant: "secondary",
    }));
    const __VLS_10 = __VLS_9({
        variant: "secondary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        variant: "ghost",
    }));
    const __VLS_14 = __VLS_13({
        variant: "ghost",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
    const __VLS_16 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        variant: "danger",
    }));
    const __VLS_18 = __VLS_17({
        variant: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    var __VLS_19;
    const __VLS_20 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        variant: "success",
    }));
    const __VLS_22 = __VLS_21({
        variant: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        variant: "warning",
    }));
    const __VLS_26 = __VLS_25({
        variant: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    const __VLS_28 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        variant: "info",
    }));
    const __VLS_30 = __VLS_29({
        variant: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
}
var __VLS_3;
const __VLS_32 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    title: "Button Sizes",
    code: (__VLS_ctx.buttonSizesCode),
    states: (__VLS_ctx.buttonSizeStates),
    initialState: "default",
}));
const __VLS_34 = __VLS_33({
    title: "Button Sizes",
    code: (__VLS_ctx.buttonSizesCode),
    states: (__VLS_ctx.buttonSizeStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-flex" },
    });
    const __VLS_36 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        size: "xs",
    }));
    const __VLS_38 = __VLS_37({
        size: "xs",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_40 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "sm",
    }));
    const __VLS_42 = __VLS_41({
        size: "sm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
    const __VLS_44 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: "md",
    }));
    const __VLS_46 = __VLS_45({
        size: "md",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    var __VLS_47;
    const __VLS_48 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        size: "lg",
    }));
    const __VLS_50 = __VLS_49({
        size: "lg",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_52 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        size: "xl",
    }));
    const __VLS_54 = __VLS_53({
        size: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    var __VLS_55;
}
var __VLS_35;
const __VLS_56 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    title: "Button with Icons",
    code: (__VLS_ctx.buttonIconsCode),
    states: (__VLS_ctx.buttonIconStates),
    initialState: "default",
}));
const __VLS_58 = __VLS_57({
    title: "Button with Icons",
    code: (__VLS_ctx.buttonIconsCode),
    states: (__VLS_ctx.buttonIconStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-flex" },
    });
    const __VLS_60 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        iconLeft: (__VLS_ctx.SearchIcon),
    }));
    const __VLS_62 = __VLS_61({
        iconLeft: (__VLS_ctx.SearchIcon),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_64 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        iconRight: (__VLS_ctx.ArrowRightIcon),
    }));
    const __VLS_66 = __VLS_65({
        iconRight: (__VLS_ctx.ArrowRightIcon),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    var __VLS_67;
    const __VLS_68 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        variant: "secondary",
        iconLeft: (__VLS_ctx.DownloadIcon),
    }));
    const __VLS_70 = __VLS_69({
        variant: "secondary",
        iconLeft: (__VLS_ctx.DownloadIcon),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    var __VLS_71;
    const __VLS_72 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        variant: "ghost",
        iconLeft: (__VLS_ctx.TrashIcon),
    }));
    const __VLS_74 = __VLS_73({
        variant: "ghost",
        iconLeft: (__VLS_ctx.TrashIcon),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    var __VLS_75;
}
var __VLS_59;
const __VLS_76 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    title: "Button States",
    code: (__VLS_ctx.buttonStatesCode),
    states: (__VLS_ctx.buttonStateStates),
    initialState: "default",
}));
const __VLS_78 = __VLS_77({
    title: "Button States",
    code: (__VLS_ctx.buttonStatesCode),
    states: (__VLS_ctx.buttonStateStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-grid" },
    });
    const __VLS_80 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
    const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_84 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        disabled: true,
    }));
    const __VLS_86 = __VLS_85({
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_88 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        loading: true,
    }));
    const __VLS_90 = __VLS_89({
        loading: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    var __VLS_91;
    const __VLS_92 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        loading: true,
        loadingText: "Processing...",
    }));
    const __VLS_94 = __VLS_93({
        loading: true,
        loadingText: "Processing...",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    var __VLS_95;
}
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "component-library-section" },
    id: "sliders",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "component-library-section-title" },
});
const __VLS_96 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    title: "Basic Slider",
    code: (__VLS_ctx.sliderBasicCode),
    props: (__VLS_ctx.sliderProps),
    states: (__VLS_ctx.sliderStates),
    initialState: "default",
}));
const __VLS_98 = __VLS_97({
    title: "Basic Slider",
    code: (__VLS_ctx.sliderBasicCode),
    props: (__VLS_ctx.sliderProps),
    states: (__VLS_ctx.sliderStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-container" },
    });
    const __VLS_100 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        modelValue: (__VLS_ctx.sliderValue),
        min: (0),
        max: (100),
        step: (1),
    }));
    const __VLS_102 = __VLS_101({
        modelValue: (__VLS_ctx.sliderValue),
        min: (0),
        max: (100),
        step: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-value" },
    });
    (__VLS_ctx.sliderValue);
}
var __VLS_99;
const __VLS_104 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    title: "Range Slider",
    code: (__VLS_ctx.sliderRangeCode),
    states: (__VLS_ctx.sliderRangeStates),
    initialState: "default",
}));
const __VLS_106 = __VLS_105({
    title: "Range Slider",
    code: (__VLS_ctx.sliderRangeCode),
    states: (__VLS_ctx.sliderRangeStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-container" },
    });
    const __VLS_108 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.sliderRangeValue),
        min: (0),
        max: (100),
        step: (1),
        range: true,
        showValue: true,
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.sliderRangeValue),
        min: (0),
        max: (100),
        step: (1),
        range: true,
        showValue: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-value" },
    });
    (__VLS_ctx.sliderRangeValue[0]);
    (__VLS_ctx.sliderRangeValue[1]);
}
var __VLS_107;
const __VLS_112 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    title: "Slider with Ticks",
    code: (__VLS_ctx.sliderTicksCode),
    states: (__VLS_ctx.sliderTickStates),
    initialState: "default",
}));
const __VLS_114 = __VLS_113({
    title: "Slider with Ticks",
    code: (__VLS_ctx.sliderTicksCode),
    states: (__VLS_ctx.sliderTickStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-container" },
    });
    const __VLS_116 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
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
    const __VLS_118 = __VLS_117({
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
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-value" },
    });
    (__VLS_ctx.sliderTickValue);
}
var __VLS_115;
const __VLS_120 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    title: "Vertical Slider",
    code: (__VLS_ctx.sliderVerticalCode),
    states: (__VLS_ctx.sliderVerticalStates),
    initialState: "default",
}));
const __VLS_122 = __VLS_121({
    title: "Vertical Slider",
    code: (__VLS_ctx.sliderVerticalCode),
    states: (__VLS_ctx.sliderVerticalStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-container" },
        ...{ style: {} },
    });
    const __VLS_124 = {}.Slider;
    /** @type {[typeof __VLS_components.Slider, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        modelValue: (__VLS_ctx.sliderVerticalValue),
        min: (0),
        max: (100),
        step: (1),
        vertical: true,
        showValue: true,
    }));
    const __VLS_126 = __VLS_125({
        modelValue: (__VLS_ctx.sliderVerticalValue),
        min: (0),
        max: (100),
        step: (1),
        vertical: true,
        showValue: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-demo-value" },
    });
    (__VLS_ctx.sliderVerticalValue);
}
var __VLS_123;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "component-library-section" },
    id: "preview",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "component-library-section-title" },
});
const __VLS_128 = {}.ComponentPreview;
/** @type {[typeof __VLS_components.ComponentPreview, typeof __VLS_components.ComponentPreview, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    title: "Device Preview",
    code: (__VLS_ctx.previewDeviceCode),
    props: (__VLS_ctx.previewProps),
    states: (__VLS_ctx.previewDeviceStates),
    initialState: "default",
}));
const __VLS_130 = __VLS_129({
    title: "Device Preview",
    code: (__VLS_ctx.previewDeviceCode),
    props: (__VLS_ctx.previewProps),
    states: (__VLS_ctx.previewDeviceStates),
    initialState: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const __VLS_132 = {}.Preview;
    /** @type {[typeof __VLS_components.Preview, typeof __VLS_components.Preview, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        states: ([
            { id: 'default', name: 'Default View' },
            { id: 'loading', name: 'Loading State' },
            { id: 'error', name: 'Error State' }
        ]),
        loading: (false),
        error: (false),
        errorMessage: "Failed to load content",
    }));
    const __VLS_134 = __VLS_133({
        states: ([
            { id: 'default', name: 'Default View' },
            { id: 'loading', name: 'Loading State' },
            { id: 'error', name: 'Error State' }
        ]),
        loading: (false),
        error: (false),
        errorMessage: "Failed to load content",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-demo-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_136 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
    const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Button: Button,
            Slider: Slider,
            Preview: Preview,
            ComponentPreview: ComponentPreview,
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
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
