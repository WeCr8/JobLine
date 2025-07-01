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
var Button_vue_1 = require("./Button.vue");
var props = withDefaults(defineProps(), {
    title: '',
    states: function () { return []; },
    initialState: '',
    loading: false,
    error: false,
    errorMessage: '',
    retryEnabled: true,
    devices: function () { return [
        {
            id: 'desktop',
            name: 'Desktop',
            width: 1280,
            height: 800,
            icon: DesktopIcon
        },
        {
            id: 'tablet',
            name: 'Tablet',
            width: 768,
            height: 1024,
            icon: TabletIcon
        },
        {
            id: 'iphone',
            name: 'iPhone',
            width: 375,
            height: 812,
            icon: MobileIcon
        },
        {
            id: 'android',
            name: 'Android',
            width: 360,
            height: 800,
            icon: AndroidIcon
        }
    ]; },
    initialDevice: 'desktop'
});
var emit = defineEmits();
// State
var currentState = (0, vue_1.ref)(props.initialState || (props.states.length > 0 ? props.states[0].id : ''));
var currentDevice = (0, vue_1.ref)(props.initialDevice);
var darkMode = (0, vue_1.ref)(false);
var zoom = (0, vue_1.ref)(1);
// Computed
var availableDevices = (0, vue_1.computed)(function () { return props.devices; });
var currentStateData = (0, vue_1.computed)(function () {
    var state = props.states.find(function (s) { return s.id === currentState.value; });
    return (state === null || state === void 0 ? void 0 : state.data) || {};
});
var deviceStyle = (0, vue_1.computed)(function () {
    var device = props.devices.find(function (d) { return d.id === currentDevice.value; });
    if (!device)
        return {};
    return {
        width: "".concat(device.width * zoom.value, "px"),
        height: "".concat(device.height * zoom.value, "px"),
        transform: "scale(".concat(zoom.value, ")"),
        transformOrigin: 'top left'
    };
});
// Watch for changes
(0, vue_1.watch)(currentState, function (newState) {
    emit('update:state', newState);
});
(0, vue_1.watch)(currentDevice, function (newDevice) {
    emit('update:device', newDevice);
});
// Methods
var resetPreview = function () {
    currentState.value = props.initialState || (props.states.length > 0 ? props.states[0].id : '');
    currentDevice.value = props.initialDevice;
    darkMode.value = false;
    zoom.value = 1;
};
// Icons
function DesktopIcon() {
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
            d: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'
        })
    ]);
}
function TabletIcon() {
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
            d: 'M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z'
        })
    ]);
}
function MobileIcon() {
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
            d: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
        })
    ]);
}
function AndroidIcon() {
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
            d: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
        })
    ]);
}
var vue_2 = require("vue");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    title: '',
    states: function () { return []; },
    initialState: '',
    loading: false,
    error: false,
    errorMessage: '',
    retryEnabled: true,
    devices: function () { return [
        {
            id: 'desktop',
            name: 'Desktop',
            width: 1280,
            height: 800,
            icon: DesktopIcon
        },
        {
            id: 'tablet',
            name: 'Tablet',
            width: 768,
            height: 1024,
            icon: TabletIcon
        },
        {
            id: 'iphone',
            name: 'iPhone',
            width: 375,
            height: 812,
            icon: MobileIcon
        },
        {
            id: 'android',
            name: 'Android',
            width: 360,
            height: 800,
            icon: AndroidIcon
        }
    ]; },
    initialDevice: 'desktop'
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['preview-device-navigation-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-state-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-container']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-state-select']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-container" }, { class: ({ 'preview-loading': __VLS_ctx.loading, 'preview-error': __VLS_ctx.error }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-header" }));
if (__VLS_ctx.title) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "preview-title" }));
    (__VLS_ctx.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-device-selector" }));
var _loop_1 = function (device) {
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { key: (device.id), variant: (__VLS_ctx.currentDevice === device.id ? 'primary' : 'ghost'), size: "sm", 'aria-label': ("Preview on ".concat(device.name)), 'aria-pressed': (__VLS_ctx.currentDevice === device.id) })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { key: (device.id), variant: (__VLS_ctx.currentDevice === device.id ? 'primary' : 'ghost'), size: "sm", 'aria-label': ("Preview on ".concat(device.name)), 'aria-pressed': (__VLS_ctx.currentDevice === device.id) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.currentDevice = device.id;
        }
    };
    __VLS_2.slots.default;
    var __VLS_7 = ((device.icon));
    // @ts-ignore
    var __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7(__assign({ class: "w-4 h-4" })));
    var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_8), false));
};
var __VLS_2;
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.availableDevices)); _i < _a.length; _i++) {
    var device = _a[_i][0];
    _loop_1(device);
}
if (__VLS_ctx.states.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-state-selector" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.currentState) }, { class: "preview-state-select" }), { 'aria-label': ('Select view state') }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.states)); _b < _c.length; _b++) {
        var state = _c[_b][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (state.id),
            value: (state.id),
        });
        (state.name);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-content-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ class: "preview-device" }, { class: ([
        "preview-device-".concat(__VLS_ctx.currentDevice),
        { 'preview-device-dark': __VLS_ctx.darkMode }
    ]) }), { style: (__VLS_ctx.deviceStyle) }), { 'aria-busy': (__VLS_ctx.loading) }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-loading-overlay" }, { role: "status" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-8 w-8 text-primary-600" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "sr-only" }));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-error-overlay" }, { role: "alert" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-error-icon" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-8 h-8" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-error-message" }));
    (__VLS_ctx.errorMessage || 'An error occurred while loading the preview');
    if (__VLS_ctx.retryEnabled) {
        /** @type {[typeof Button, typeof Button, ]} */ ;
        // @ts-ignore
        var __VLS_11 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { variant: "primary", size: "sm" })));
        var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "primary", size: "sm" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
        var __VLS_14 = void 0;
        var __VLS_15 = void 0;
        var __VLS_16 = void 0;
        var __VLS_17 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.error))
                    return;
                if (!(__VLS_ctx.retryEnabled))
                    return;
                __VLS_ctx.$emit('retry');
            }
        };
        __VLS_13.slots.default;
        var __VLS_13;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-content" }));
    var __VLS_18 = {
        state: (__VLS_ctx.currentStateData),
    };
}
if (__VLS_ctx.currentDevice === 'iphone') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-device-notch" }));
}
if (__VLS_ctx.currentDevice === 'iphone') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-device-home-indicator" }));
}
if (__VLS_ctx.currentDevice === 'android') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-device-status-bar" }));
}
if (__VLS_ctx.currentDevice === 'android') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-device-navigation-bar" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-controls" }));
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
var __VLS_20 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", 'aria-label': (__VLS_ctx.darkMode ? 'Switch to light mode' : 'Switch to dark mode'), 'aria-pressed': (__VLS_ctx.darkMode) })));
var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", 'aria-label': (__VLS_ctx.darkMode ? 'Switch to light mode' : 'Switch to dark mode'), 'aria-pressed': (__VLS_ctx.darkMode) })], __VLS_functionalComponentArgsRest(__VLS_20), false));
var __VLS_23;
var __VLS_24;
var __VLS_25;
var __VLS_26 = {
    onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.darkMode = !__VLS_ctx.darkMode;
    }
};
__VLS_22.slots.default;
if (__VLS_ctx.darkMode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-5 h-5" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-5 h-5" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
    });
}
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "preview-zoom-controls" }));
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
var __VLS_27 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", disabled: (__VLS_ctx.zoom <= 0.5), 'aria-label': "Zoom out" })));
var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", disabled: (__VLS_ctx.zoom <= 0.5), 'aria-label': "Zoom out" })], __VLS_functionalComponentArgsRest(__VLS_27), false));
var __VLS_30;
var __VLS_31;
var __VLS_32;
var __VLS_33 = {
    onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.zoom = Math.max(0.5, __VLS_ctx.zoom - 0.1);
    }
};
__VLS_29.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-5 h-5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M19.5 12h-15",
});
var __VLS_29;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "preview-zoom-value" }));
(Math.round(__VLS_ctx.zoom * 100));
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", disabled: (__VLS_ctx.zoom >= 2), 'aria-label': "Zoom in" })));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", disabled: (__VLS_ctx.zoom >= 2), 'aria-label': "Zoom in" })], __VLS_functionalComponentArgsRest(__VLS_34), false));
var __VLS_37;
var __VLS_38;
var __VLS_39;
var __VLS_40 = {
    onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.zoom = Math.min(2, __VLS_ctx.zoom + 0.1);
    }
};
__VLS_36.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-5 h-5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M12 4.5v15m7.5-7.5h-15",
});
var __VLS_36;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(Button_vue_1.default, new Button_vue_1.default(__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", 'aria-label': "Reset preview" })));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { variant: "ghost", size: "sm", 'aria-label': "Reset preview" })], __VLS_functionalComponentArgsRest(__VLS_41), false));
var __VLS_44;
var __VLS_45;
var __VLS_46;
var __VLS_47 = {
    onClick: (__VLS_ctx.resetPreview)
};
__VLS_43.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", 'stroke-width': "1.5", stroke: "currentColor" }, { class: "w-5 h-5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
});
var __VLS_43;
/** @type {__VLS_StyleScopedClasses['preview-container']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-state-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-state-select']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-notch']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-home-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-device-navigation-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-zoom-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-zoom-value']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
// @ts-ignore
var __VLS_19 = __VLS_18;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            Button: Button_vue_1.default,
            currentState: currentState,
            currentDevice: currentDevice,
            darkMode: darkMode,
            zoom: zoom,
            availableDevices: availableDevices,
            currentStateData: currentStateData,
            deviceStyle: deviceStyle,
            resetPreview: resetPreview,
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
