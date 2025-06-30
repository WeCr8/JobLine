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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var useElementSize_1 = require("../../composables/useElementSize");
var props = withDefaults(defineProps(), {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    range: false,
    showValue: false,
    showTicks: false,
    ticks: function () { return []; },
    id: "slider-".concat(Math.random().toString(36).substring(2, 9))
});
var emit = defineEmits();
// Refs
var trackRef = (0, vue_1.ref)(null);
var thumbRef = (0, vue_1.ref)(null);
var minThumbRef = (0, vue_1.ref)(null);
var maxThumbRef = (0, vue_1.ref)(null);
var activeThumb = (0, vue_1.ref)(null);
// Track size
var _a = (0, useElementSize_1.useElementSize)(trackRef), trackWidth = _a.width, trackHeight = _a.height;
// Computed values
var normalizedValue = (0, vue_1.computed)(function () {
    if (props.range) {
        var value = props.modelValue;
        return [
            Math.max(props.min, Math.min(props.max, value[0])),
            Math.max(props.min, Math.min(props.max, value[1]))
        ];
    }
    else {
        var value = props.modelValue;
        return Math.max(props.min, Math.min(props.max, value));
    }
});
var valueToPosition = function (value) {
    var range = props.max - props.min;
    var percentage = ((value - props.min) / range) * 100;
    return Math.max(0, Math.min(100, percentage));
};
var thumbStyle = (0, vue_1.computed)(function () {
    if (props.vertical) {
        var position = 100 - valueToPosition(normalizedValue.value);
        return { top: "".concat(position, "%") };
    }
    else {
        var position = valueToPosition(normalizedValue.value);
        return { left: "".concat(position, "%") };
    }
});
var minThumbStyle = (0, vue_1.computed)(function () {
    if (props.vertical) {
        var position = 100 - valueToPosition(normalizedValue.value[0]);
        return { top: "".concat(position, "%") };
    }
    else {
        var position = valueToPosition(normalizedValue.value[0]);
        return { left: "".concat(position, "%") };
    }
});
var maxThumbStyle = (0, vue_1.computed)(function () {
    if (props.vertical) {
        var position = 100 - valueToPosition(normalizedValue.value[1]);
        return { top: "".concat(position, "%") };
    }
    else {
        var position = valueToPosition(normalizedValue.value[1]);
        return { left: "".concat(position, "%") };
    }
});
var trackFillStyle = (0, vue_1.computed)(function () {
    if (props.range) {
        var minPos = valueToPosition(normalizedValue.value[0]);
        var maxPos = valueToPosition(normalizedValue.value[1]);
        if (props.vertical) {
            return {
                bottom: "".concat(minPos, "%"),
                height: "".concat(maxPos - minPos, "%")
            };
        }
        else {
            return {
                left: "".concat(minPos, "%"),
                width: "".concat(maxPos - minPos, "%")
            };
        }
    }
    else {
        var position = valueToPosition(normalizedValue.value);
        if (props.vertical) {
            return {
                height: "".concat(100 - position, "%")
            };
        }
        else {
            return {
                width: "".concat(position, "%")
            };
        }
    }
});
// Methods
var positionToValue = function (position) {
    var trackSize = props.vertical ? trackHeight.value : trackWidth.value;
    var percentage = Math.max(0, Math.min(100, (position / trackSize) * 100));
    // Adjust for vertical orientation
    var adjustedPercentage = props.vertical ? 100 - percentage : percentage;
    var range = props.max - props.min;
    var value = (adjustedPercentage / 100) * range + props.min;
    // Snap to step
    value = Math.round(value / props.step) * props.step;
    return Math.max(props.min, Math.min(props.max, value));
};
var handleTrackClick = function (event) {
    if (props.disabled)
        return;
    var rect = trackRef.value.getBoundingClientRect();
    var position = props.vertical
        ? event.clientY - rect.top
        : event.clientX - rect.left;
    var newValue = positionToValue(position);
    if (props.range) {
        var _a = normalizedValue.value, min = _a[0], max = _a[1];
        var midpoint = (min + max) / 2;
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
var handleThumbMouseDown = function (event, thumb) {
    if (props.disabled)
        return;
    event.preventDefault();
    activeThumb.value = thumb;
    var handleMouseMove = function (e) {
        var rect = trackRef.value.getBoundingClientRect();
        var position = props.vertical
            ? e.clientY - rect.top
            : e.clientX - rect.left;
        updateValueFromPosition(position, thumb);
    };
    var handleMouseUp = function () {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};
var handleThumbTouchStart = function (event, thumb) {
    if (props.disabled)
        return;
    event.preventDefault();
    activeThumb.value = thumb;
    var handleTouchMove = function (e) {
        var touch = e.touches[0];
        var rect = trackRef.value.getBoundingClientRect();
        var position = props.vertical
            ? touch.clientY - rect.top
            : touch.clientX - rect.left;
        updateValueFromPosition(position, thumb);
    };
    var handleTouchEnd = function () {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
};
var updateValueFromPosition = function (position, thumb) {
    var newValue = positionToValue(position);
    if (props.range) {
        var _a = normalizedValue.value, min = _a[0], max = _a[1];
        if (thumb === 'min') {
            // Ensure min doesn't exceed max
            var updatedValue = Math.min(newValue, max);
            emit('update:modelValue', [updatedValue, max]);
            emit('change', [updatedValue, max]);
        }
        else {
            // Ensure max doesn't go below min
            var updatedValue = Math.max(newValue, min);
            emit('update:modelValue', [min, updatedValue]);
            emit('change', [min, updatedValue]);
        }
    }
    else {
        emit('update:modelValue', newValue);
        emit('change', newValue);
    }
};
var handleKeyDown = function (event, thumb) {
    if (props.disabled)
        return;
    var step = event.shiftKey ? props.step * 10 : props.step;
    var newValue;
    if (props.range) {
        var _a = normalizedValue.value, min = _a[0], max = _a[1];
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
        var value = normalizedValue.value;
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
var isTickActive = function (tickValue) {
    if (props.range) {
        var _a = normalizedValue.value, min = _a[0], max = _a[1];
        return tickValue >= min && tickValue <= max;
    }
    else {
        var value = normalizedValue.value;
        return tickValue <= value;
    }
};
var getTickStyle = function (tickValue) {
    var position = valueToPosition(tickValue);
    if (props.vertical) {
        return { top: "".concat(100 - position, "%") };
    }
    else {
        return { left: "".concat(position, "%") };
    }
};
// Ensure the initial value is valid
(0, vue_1.onMounted)(function () {
    if (props.range) {
        var value = props.modelValue;
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
(0, vue_1.watch)(function () { return props.modelValue; }, function (newValue) {
    if (props.range) {
        var value = newValue;
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
var __VLS_withDefaultsArg = (function (t) { return t; })({
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    vertical: false,
    range: false,
    showValue: false,
    showTicks: false,
    ticks: function () { return []; },
    id: "slider-".concat(Math.random().toString(36).substring(2, 9))
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ class: "slider-container" }, { class: ({ 'slider-disabled': __VLS_ctx.disabled }) }), { 'data-orientation': (__VLS_ctx.vertical ? 'vertical' : 'horizontal') }));
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: (__VLS_ctx.id) }, { class: "slider-label" }));
    (__VLS_ctx.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: (__VLS_ctx.handleTrackClick) }, { ref: "trackRef" }), { class: "slider-track" }), { class: ({ 'slider-track-vertical': __VLS_ctx.vertical }) }));
/** @type {typeof __VLS_ctx.trackRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slider-track-bg" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slider-track-fill" }, { style: (__VLS_ctx.trackFillStyle) }));
if (__VLS_ctx.range) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleKeyDown($event, 'min');
        } }, { onMousedown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbMouseDown($event, 'min');
        } }), { onTouchstart: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbTouchStart($event, 'min');
        } }), { onFocus: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = 'min';
        } }), { onBlur: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = null;
        } }), { ref: "minThumbRef", role: "slider", tabindex: "0", id: ("".concat(__VLS_ctx.id, "-min")) }), { class: "slider-thumb" }), { class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'min' }) }), { style: (__VLS_ctx.minThumbStyle) }), { 'aria-valuemin': (__VLS_ctx.min), 'aria-valuemax': (__VLS_ctx.max), 'aria-valuenow': (__VLS_ctx.modelValue[0]), 'aria-labelledby': (__VLS_ctx.ariaLabelledby), 'aria-label': (__VLS_ctx.ariaLabel ? "".concat(__VLS_ctx.ariaLabel, " minimum value") : undefined), 'aria-disabled': (__VLS_ctx.disabled) }));
    /** @type {typeof __VLS_ctx.minThumbRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleKeyDown($event, 'max');
        } }, { onMousedown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbMouseDown($event, 'max');
        } }), { onTouchstart: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbTouchStart($event, 'max');
        } }), { onFocus: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = 'max';
        } }), { onBlur: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = null;
        } }), { ref: "maxThumbRef", role: "slider", tabindex: "0", id: ("".concat(__VLS_ctx.id, "-max")) }), { class: "slider-thumb" }), { class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'max' }) }), { style: (__VLS_ctx.maxThumbStyle) }), { 'aria-valuemin': (__VLS_ctx.min), 'aria-valuemax': (__VLS_ctx.max), 'aria-valuenow': (__VLS_ctx.modelValue[1]), 'aria-labelledby': (__VLS_ctx.ariaLabelledby), 'aria-label': (__VLS_ctx.ariaLabel ? "".concat(__VLS_ctx.ariaLabel, " maximum value") : undefined), 'aria-disabled': (__VLS_ctx.disabled) }));
    /** @type {typeof __VLS_ctx.maxThumbRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleKeyDown($event, 'single');
        } }, { onMousedown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbMouseDown($event, 'single');
        } }), { onTouchstart: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.range))
                return;
            __VLS_ctx.handleThumbTouchStart($event, 'single');
        } }), { onFocus: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = 'single';
        } }), { onBlur: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.range))
                return;
            __VLS_ctx.activeThumb = null;
        } }), { ref: "thumbRef", role: "slider", tabindex: "0", id: (__VLS_ctx.id) }), { class: "slider-thumb" }), { class: ({ 'slider-thumb-active': __VLS_ctx.activeThumb === 'single' }) }), { style: (__VLS_ctx.thumbStyle) }), { 'aria-valuemin': (__VLS_ctx.min), 'aria-valuemax': (__VLS_ctx.max), 'aria-valuenow': (__VLS_ctx.modelValue), 'aria-labelledby': (__VLS_ctx.ariaLabelledby), 'aria-label': (__VLS_ctx.ariaLabel), 'aria-disabled': (__VLS_ctx.disabled) }));
    /** @type {typeof __VLS_ctx.thumbRef} */ ;
}
if (__VLS_ctx.showValue) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slider-value" }));
    if (__VLS_ctx.range) {
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "slider-ticks" }, { class: ({ 'slider-ticks-vertical': __VLS_ctx.vertical }) }));
    for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.ticks)); _i < _b.length; _i++) {
        var tick = _b[_i][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ key: (tick.value) }, { class: "slider-tick" }), { class: ({ 'slider-tick-active': __VLS_ctx.isTickActive(tick.value) }) }), { style: (__VLS_ctx.getTickStyle(tick.value)) }));
        if (tick.label) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "slider-tick-label" }));
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
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
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
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
