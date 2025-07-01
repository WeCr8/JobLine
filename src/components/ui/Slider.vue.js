import { ref, computed, onMounted, watch } from 'vue';
import { useElementSize } from '../../composables/useElementSize';
const props = withDefaults(defineProps(), {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    range: false,
    showValue: false,
    showTicks: false,
    ticks: () => [],
    id: `slider-${Math.random().toString(36).substring(2, 9)}`
});
const emit = defineEmits();
// Refs
const trackRef = ref(null);
const thumbRef = ref(null);
const minThumbRef = ref(null);
const maxThumbRef = ref(null);
const activeThumb = ref(null);
// Track size
const { width: trackWidth, height: trackHeight } = useElementSize(trackRef);
// Computed values
const normalizedValue = computed(() => {
    if (props.range) {
        const value = props.modelValue;
        return [
            Math.max(props.min, Math.min(props.max, value[0])),
            Math.max(props.min, Math.min(props.max, value[1]))
        ];
    }
    else {
        const value = props.modelValue;
        return Math.max(props.min, Math.min(props.max, value));
    }
});
const valueToPosition = (value) => {
    const range = props.max - props.min;
    const percentage = ((value - props.min) / range) * 100;
    return Math.max(0, Math.min(100, percentage));
};
const thumbStyle = computed(() => {
    if (props.vertical) {
        const position = 100 - valueToPosition(normalizedValue.value);
        return { top: `${position}%` };
    }
    else {
        const position = valueToPosition(normalizedValue.value);
        return { left: `${position}%` };
    }
});
const minThumbStyle = computed(() => {
    if (props.vertical) {
        const position = 100 - valueToPosition(normalizedValue.value[0]);
        return { top: `${position}%` };
    }
    else {
        const position = valueToPosition(normalizedValue.value[0]);
        return { left: `${position}%` };
    }
});
const maxThumbStyle = computed(() => {
    if (props.vertical) {
        const position = 100 - valueToPosition(normalizedValue.value[1]);
        return { top: `${position}%` };
    }
    else {
        const position = valueToPosition(normalizedValue.value[1]);
        return { left: `${position}%` };
    }
});
const trackFillStyle = computed(() => {
    if (props.range) {
        const minPos = valueToPosition(normalizedValue.value[0]);
        const maxPos = valueToPosition(normalizedValue.value[1]);
        if (props.vertical) {
            return {
                bottom: `${minPos}%`,
                height: `${maxPos - minPos}%`
            };
        }
        else {
            return {
                left: `${minPos}%`,
                width: `${maxPos - minPos}%`
            };
        }
    }
    else {
        const position = valueToPosition(normalizedValue.value);
        if (props.vertical) {
            return {
                height: `${100 - position}%`
            };
        }
        else {
            return {
                width: `${position}%`
            };
        }
    }
});
// Methods
const positionToValue = (position) => {
    const trackSize = props.vertical ? trackHeight.value : trackWidth.value;
    const percentage = Math.max(0, Math.min(100, (position / trackSize) * 100));
    // Adjust for vertical orientation
    const adjustedPercentage = props.vertical ? 100 - percentage : percentage;
    const range = props.max - props.min;
    let value = (adjustedPercentage / 100) * range + props.min;
    // Snap to step
    value = Math.round(value / props.step) * props.step;
    return Math.max(props.min, Math.min(props.max, value));
};
const handleTrackClick = (event) => {
    if (props.disabled)
        return;
    const rect = trackRef.value.getBoundingClientRect();
    const position = props.vertical
        ? event.clientY - rect.top
        : event.clientX - rect.left;
    const newValue = positionToValue(position);
    if (props.range) {
        const [min, max] = normalizedValue.value;
        const midpoint = (min + max) / 2;
        if (newValue <= midpoint) {
            emit('update:modelValue', [newValue, max]);
            emit('change', [newValue, max]);
        }
        else {
            emit('update:modelValue', [min, newValue]);
            emit('change', [min, newValue]);
        }
    }
    else {
        emit('update:modelValue', newValue);
        emit('change', newValue);
    }
};
const handleThumbMouseDown = (event, thumb) => {
    if (props.disabled)
        return;
    event.preventDefault();
    activeThumb.value = thumb;
    const handleMouseMove = (e) => {
        const rect = trackRef.value.getBoundingClientRect();
        const position = props.vertical
            ? e.clientY - rect.top
            : e.clientX - rect.left;
        updateValueFromPosition(position, thumb);
    };
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};
const handleThumbTouchStart = (event, thumb) => {
    if (props.disabled)
        return;
    event.preventDefault();
    activeThumb.value = thumb;
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const rect = trackRef.value.getBoundingClientRect();
        const position = props.vertical
            ? touch.clientY - rect.top
            : touch.clientX - rect.left;
        updateValueFromPosition(position, thumb);
    };
    const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
};
const updateValueFromPosition = (position, thumb) => {
    const newValue = positionToValue(position);
    if (props.range) {
        const [min, max] = normalizedValue.value;
        if (thumb === 'min') {
            // Ensure min doesn't exceed max
            const updatedValue = Math.min(newValue, max);
            emit('update:modelValue', [updatedValue, max]);
            emit('change', [updatedValue, max]);
        }
        else {
            // Ensure max doesn't go below min
            const updatedValue = Math.max(newValue, min);
            emit('update:modelValue', [min, updatedValue]);
            emit('change', [min, updatedValue]);
        }
    }
    else {
        emit('update:modelValue', newValue);
        emit('change', newValue);
    }
};
const handleKeyDown = (event, thumb) => {
    if (props.disabled)
        return;
    const step = event.shiftKey ? props.step * 10 : props.step;
    let newValue;
    if (props.range) {
        const [min, max] = normalizedValue.value;
        if (thumb === 'min') {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    newValue = [Math.min(min + step, max), max];
                    break;
                case 'ArrowLeft':
                case 'ArrowDown':
                    newValue = [Math.max(min - step, props.min), max];
                    break;
                case 'Home':
                    newValue = [props.min, max];
                    break;
                case 'End':
                    newValue = [max, max];
                    break;
                default:
                    return;
            }
        }
        else {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    newValue = [min, Math.min(max + step, props.max)];
                    break;
                case 'ArrowLeft':
                case 'ArrowDown':
                    newValue = [min, Math.max(max - step, min)];
                    break;
                case 'Home':
                    newValue = [min, min];
                    break;
                case 'End':
                    newValue = [min, props.max];
                    break;
                default:
                    return;
            }
        }
    }
    else {
        const value = normalizedValue.value;
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(value + step, props.max);
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(value - step, props.min);
                break;
            case 'Home':
                newValue = props.min;
                break;
            case 'End':
                newValue = props.max;
                break;
            default:
                return;
        }
    }
    event.preventDefault();
    emit('update:modelValue', newValue);
    emit('change', newValue);
};
// Tick marks
const isTickActive = (tickValue) => {
    if (props.range) {
        const [min, max] = normalizedValue.value;
        return tickValue >= min && tickValue <= max;
    }
    else {
        const value = normalizedValue.value;
        return tickValue <= value;
    }
};
const getTickStyle = (tickValue) => {
    const position = valueToPosition(tickValue);
    if (props.vertical) {
        return { top: `${100 - position}%` };
    }
    else {
        return { left: `${position}%` };
    }
};
// Ensure the initial value is valid
onMounted(() => {
    if (props.range) {
        const value = props.modelValue;
        if (!Array.isArray(value) || value.length !== 2) {
            console.warn('Slider: range mode requires modelValue to be an array of two numbers');
            emit('update:modelValue', [props.min, props.max]);
        }
        else if (value[0] > value[1]) {
            emit('update:modelValue', [value[1], value[0]]);
        }
    }
});
// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
    if (props.range) {
        const value = newValue;
        if (!Array.isArray(value) || value.length !== 2) {
            console.warn('Slider: range mode requires modelValue to be an array of two numbers');
            emit('update:modelValue', [props.min, props.max]);
        }
        else if (value[0] > value[1]) {
            emit('update:modelValue', [value[1], value[0]]);
        }
    }
}, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    range: false,
    showValue: false,
    showTicks: false,
    ticks: () => [],
    id: `slider-${Math.random().toString(36).substring(2, 9)}`
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['slider-container']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb-active']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-ticks-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-ticks-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick-label']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick-active']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-container" },
    ...{ class: ({ 'slider-disabled': __VLS_ctx.disabled }) },
    'data-orientation': (__VLS_ctx.vertical ? 'vertical' : 'horizontal'),
});
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (__VLS_ctx.id),
        ...{ class: "slider-label" },
    });
    (__VLS_ctx.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.handleTrackClick) },
    ref: "trackRef",
    ...{ class: "slider-track" },
    ...{ class: ({ 'slider-track-vertical': __VLS_ctx.vertical }) },
});
/** @type {typeof __VLS_ctx.trackRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-track-bg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-track-fill" },
    ...{ style: (__VLS_ctx.trackFillStyle) },
});
if (__VLS_ctx.range) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleKeyDown($event, 'min');
            } },
        ...{ onMousedown: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbMouseDown($event, 'min');
            } },
        ...{ onTouchstart: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbTouchStart($event, 'min');
            } },
        ...{ onFocus: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = 'min';
            } },
        ...{ onBlur: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = null;
            } },
        ref: "minThumbRef",
        role: "slider",
        tabindex: "0",
        id: (`${__VLS_ctx.id}-min`),
        ...{ class: "slider-thumb" },
        ...{ class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'min' }) },
        ...{ style: (__VLS_ctx.minThumbStyle) },
        'aria-valuemin': (__VLS_ctx.min),
        'aria-valuemax': (__VLS_ctx.max),
        'aria-valuenow': (Array.isArray(__VLS_ctx.modelValue) ? __VLS_ctx.modelValue[0] : __VLS_ctx.modelValue),
        'aria-labelledby': (__VLS_ctx.ariaLabelledby),
        'aria-label': (__VLS_ctx.ariaLabel ? `${__VLS_ctx.ariaLabel} minimum value` : undefined),
        'aria-disabled': (__VLS_ctx.disabled),
    });
    /** @type {typeof __VLS_ctx.minThumbRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleKeyDown($event, 'max');
            } },
        ...{ onMousedown: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbMouseDown($event, 'max');
            } },
        ...{ onTouchstart: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbTouchStart($event, 'max');
            } },
        ...{ onFocus: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = 'max';
            } },
        ...{ onBlur: (...[$event]) => {
                if (!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = null;
            } },
        ref: "maxThumbRef",
        role: "slider",
        tabindex: "0",
        id: (`${__VLS_ctx.id}-max`),
        ...{ class: "slider-thumb" },
        ...{ class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'max' }) },
        ...{ style: (__VLS_ctx.maxThumbStyle) },
        'aria-valuemin': (__VLS_ctx.min),
        'aria-valuemax': (__VLS_ctx.max),
        'aria-valuenow': (Array.isArray(__VLS_ctx.modelValue) ? __VLS_ctx.modelValue[1] : __VLS_ctx.modelValue),
        'aria-labelledby': (__VLS_ctx.ariaLabelledby),
        'aria-label': (__VLS_ctx.ariaLabel ? `${__VLS_ctx.ariaLabel} maximum value` : undefined),
        'aria-disabled': (__VLS_ctx.disabled),
    });
    /** @type {typeof __VLS_ctx.maxThumbRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onKeydown: (...[$event]) => {
                if (!!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleKeyDown($event, 'single');
            } },
        ...{ onMousedown: (...[$event]) => {
                if (!!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbMouseDown($event, 'single');
            } },
        ...{ onTouchstart: (...[$event]) => {
                if (!!(__VLS_ctx.range))
                    return;
                __VLS_ctx.handleThumbTouchStart($event, 'single');
            } },
        ...{ onFocus: (...[$event]) => {
                if (!!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = 'single';
            } },
        ...{ onBlur: (...[$event]) => {
                if (!!(__VLS_ctx.range))
                    return;
                __VLS_ctx.activeThumb = null;
            } },
        ref: "thumbRef",
        role: "slider",
        tabindex: "0",
        id: (__VLS_ctx.id),
        ...{ class: "slider-thumb" },
        ...{ class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'single' }) },
        ...{ style: (__VLS_ctx.thumbStyle) },
        'aria-valuemin': (__VLS_ctx.min),
        'aria-valuemax': (__VLS_ctx.max),
        'aria-valuenow': (Array.isArray(__VLS_ctx.modelValue) ? undefined : __VLS_ctx.modelValue),
        'aria-labelledby': (__VLS_ctx.ariaLabelledby),
        'aria-label': (__VLS_ctx.ariaLabel),
        'aria-disabled': (__VLS_ctx.disabled),
    });
    /** @type {typeof __VLS_ctx.thumbRef} */ ;
}
if (__VLS_ctx.showValue) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "slider-value" },
    });
    if (__VLS_ctx.range && Array.isArray(__VLS_ctx.modelValue)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.modelValue[0]);
        (__VLS_ctx.modelValue[1]);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.modelValue);
    }
}
if (__VLS_ctx.showTicks) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "slider-ticks" },
        ...{ class: ({ 'slider-ticks-vertical': __VLS_ctx.vertical }) },
    });
    for (const [tick] of __VLS_getVForSourceType((__VLS_ctx.ticks))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (tick.value),
            ...{ class: "slider-tick" },
            ...{ class: ({ 'slider-tick-active': __VLS_ctx.isTickActive(tick.value) }) },
            ...{ style: (__VLS_ctx.getTickStyle(tick.value)) },
        });
        if (tick.label) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "slider-tick-label" },
            });
            (tick.label);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['slider-container']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-label']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb-active']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb-active']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-thumb-active']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-value']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-ticks']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-ticks-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick-active']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-tick-label']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            trackRef: trackRef,
            thumbRef: thumbRef,
            minThumbRef: minThumbRef,
            maxThumbRef: maxThumbRef,
            activeThumb: activeThumb,
            thumbStyle: thumbStyle,
            minThumbStyle: minThumbStyle,
            maxThumbStyle: maxThumbStyle,
            trackFillStyle: trackFillStyle,
            handleTrackClick: handleTrackClick,
            handleThumbMouseDown: handleThumbMouseDown,
            handleThumbTouchStart: handleThumbTouchStart,
            handleKeyDown: handleKeyDown,
            isTickActive: isTickActive,
            getTickStyle: getTickStyle,
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
