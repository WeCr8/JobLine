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
var auth_1 = require("./stores/auth");
var AppLayout_vue_1 = require("./components/AppLayout.vue");
var FloatingChatButton_vue_1 = require("./components/FloatingChatButton.vue");
var OfflineIndicator_vue_1 = require("./components/OfflineIndicator.vue");
var InstallPrompt_vue_1 = require("./components/InstallPrompt.vue");
var platform_1 = require("./utils/platform");
var authStore = (0, auth_1.useAuthStore)();
(0, vue_1.onMounted)(function () {
    authStore.initAuth();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ id: "app" }, { class: (__VLS_ctx.getPlatformClass()) }));
/** @type {[typeof OfflineIndicator, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(OfflineIndicator_vue_1.default, new OfflineIndicator_vue_1.default({}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
/** @type {[typeof InstallPrompt, ]} */ ;
// @ts-ignore
var __VLS_3 = __VLS_asFunctionalComponent(InstallPrompt_vue_1.default, new InstallPrompt_vue_1.default({}));
var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_3), false));
if (!__VLS_ctx.authStore.isAuthenticated) {
    var __VLS_6 = {}.RouterView;
    /** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_7), false));
}
else {
    /** @type {[typeof AppLayout, ]} */ ;
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent(AppLayout_vue_1.default, new AppLayout_vue_1.default({}));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_10), false));
}
/** @type {[typeof FloatingChatButton, ]} */ ;
// @ts-ignore
var __VLS_13 = __VLS_asFunctionalComponent(FloatingChatButton_vue_1.default, new FloatingChatButton_vue_1.default({}));
var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_13), false));
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            AppLayout: AppLayout_vue_1.default,
            FloatingChatButton: FloatingChatButton_vue_1.default,
            OfflineIndicator: OfflineIndicator_vue_1.default,
            InstallPrompt: InstallPrompt_vue_1.default,
            getPlatformClass: platform_1.getPlatformClass,
            authStore: authStore,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
;
