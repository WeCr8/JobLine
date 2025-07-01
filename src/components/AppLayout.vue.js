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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var auth_1 = require("../stores/auth");
var performance_1 = require("../stores/performance");
var subscription_1 = require("../stores/subscription");
var MobileNavigation_vue_1 = require("./MobileNavigation.vue");
var outline_1 = require("@heroicons/vue/24/outline");
var router = (0, vue_router_1.useRouter)();
var authStore = (0, auth_1.useAuthStore)();
var performanceStore = (0, performance_1.usePerformanceStore)();
var subscriptionStore = (0, subscription_1.useSubscriptionStore)();
var showUserMenu = (0, vue_1.ref)(false);
var navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: outline_1.HomeIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Jobs', href: '/jobs', icon: outline_1.BriefcaseIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Chat', href: '/chat', icon: outline_1.ChatBubbleLeftRightIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Machines', href: '/machines', icon: outline_1.CogIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Passdown', href: '/passdown', icon: outline_1.DocumentTextIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Performance', href: '/performance', icon: outline_1.TrophyIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Optimization', href: '/optimization', icon: outline_1.LightBulbIcon, roles: ['lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Integration', href: '/integration', icon: outline_1.CircleStackIcon, roles: ['manager', 'admin', 'organization_admin'] },
    { name: 'Settings', href: '/settings', icon: outline_1.UserIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
    { name: 'Admin', href: '/admin/dashboard', icon: outline_1.Cog6ToothIcon, roles: ['admin'] },
];
var visibleNavigation = (0, vue_1.computed)(function () {
    if (!authStore.user)
        return [];
    return navigation.filter(function (item) { return item.roles.includes(authStore.user.role); });
});
var isPlatformAdmin = (0, vue_1.computed)(function () {
    return authStore.isPlatformAdmin;
});
var isOrgAdmin = (0, vue_1.computed)(function () {
    return authStore.isOrgAdmin;
});
var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authStore.signOut()];
            case 1:
                _a.sent();
                router.push('/login');
                showUserMenu.value = false;
                return [2 /*return*/];
        }
    });
}); };
var handleClickOutside = function (event) {
    var target = event.target;
    if (!target.closest('.relative')) {
        showUserMenu.value = false;
    }
};
(0, vue_1.onMounted)(function () {
    document.addEventListener('click', handleClickOutside);
    // Load user performance data
    if (authStore.user) {
        performanceStore.fetchUserMetrics(authStore.user.id);
        subscriptionStore.fetchSubscription();
    }
});
(0, vue_1.onUnmounted)(function () {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "min-h-screen bg-gray-50" }));
/** @type {[typeof MobileNavigation, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(MobileNavigation_vue_1.default, new MobileNavigation_vue_1.default({}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(__assign({ class: "hidden md:block bg-white shadow-sm border-b border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between h-16" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-shrink-0 flex items-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-white font-bold text-sm" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "ml-2 text-xl font-semibold text-gray-900" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hidden md:ml-10 md:flex md:space-x-8" }));
for (var _i = 0, _e = __VLS_getVForSourceType((__VLS_ctx.visibleNavigation)); _i < _e.length; _i++) {
    var item = _e[_i][0];
    var __VLS_3 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    var __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3(__assign(__assign({ key: (item.name), to: (item.href) }, { class: "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200" }), { class: (__VLS_ctx.$route.path.startsWith(item.href)
            ? 'border-b-2 border-primary-500 text-gray-900'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300') })));
    var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign(__assign({ key: (item.name), to: (item.href) }, { class: "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200" }), { class: (__VLS_ctx.$route.path.startsWith(item.href)
                ? 'border-b-2 border-primary-500 text-gray-900'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300') })], __VLS_functionalComponentArgsRest(__VLS_4), false));
    __VLS_6.slots.default;
    var __VLS_7 = ((item.icon));
    // @ts-ignore
    var __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7(__assign({ class: "w-4 h-4 mr-2" })));
    var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 mr-2" })], __VLS_functionalComponentArgsRest(__VLS_8), false));
    (item.name);
    var __VLS_6;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center space-x-4" }));
if (__VLS_ctx.subscriptionStore.currentPlan) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full" }));
    var __VLS_11 = {}.CheckCircleIcon;
    /** @type {[typeof __VLS_components.CheckCircleIcon, ]} */ ;
    // @ts-ignore
    var __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11(__assign({ class: "w-4 h-4 text-green-600" })));
    var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 text-green-600" })], __VLS_functionalComponentArgsRest(__VLS_12), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm font-medium text-green-900" }));
    (__VLS_ctx.subscriptionStore.currentPlan.name);
}
if (__VLS_ctx.performanceStore.userMetrics) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hidden lg:flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full" }));
    var __VLS_15 = {}.TrophyIcon;
    /** @type {[typeof __VLS_components.TrophyIcon, ]} */ ;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15(__assign({ class: "w-4 h-4 text-purple-600" })));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 text-purple-600" })], __VLS_functionalComponentArgsRest(__VLS_16), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm font-medium text-purple-900" }));
    (__VLS_ctx.performanceStore.userMetrics.totalScore);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-purple-600" }));
    (__VLS_ctx.performanceStore.userLevel);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ class: "p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200" }));
var __VLS_19 = {}.BellIcon;
/** @type {[typeof __VLS_components.BellIcon, ]} */ ;
// @ts-ignore
var __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19(__assign({ class: "w-5 h-5" })));
var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5" })], __VLS_functionalComponentArgsRest(__VLS_20), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showUserMenu = !__VLS_ctx.showUserMenu;
    } }, { class: "flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-primary-600 font-medium text-sm" }));
((_b = (_a = __VLS_ctx.authStore.user) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.charAt(0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "hidden md:block text-gray-700 font-medium" }));
((_c = __VLS_ctx.authStore.user) === null || _c === void 0 ? void 0 : _c.name);
var __VLS_23 = {}.ChevronDownIcon;
/** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23(__assign({ class: "w-4 h-4 text-gray-400" })));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4 text-gray-400" })], __VLS_functionalComponentArgsRest(__VLS_24), false));
if (__VLS_ctx.showUserMenu) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "px-4 py-2 text-sm text-gray-500 border-b border-gray-100" }));
    ((_d = __VLS_ctx.authStore.user) === null || _d === void 0 ? void 0 : _d.email);
    var __VLS_27 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    var __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27(__assign(__assign({ 'onClick': {} }, { to: "/settings" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })));
    var __VLS_29 = __VLS_28.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: "/settings" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })], __VLS_functionalComponentArgsRest(__VLS_28), false));
    var __VLS_31 = void 0;
    var __VLS_32 = void 0;
    var __VLS_33 = void 0;
    var __VLS_34 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUserMenu))
                return;
            __VLS_ctx.showUserMenu = false;
        }
    };
    __VLS_30.slots.default;
    var __VLS_30;
    var __VLS_35 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35(__assign(__assign({ 'onClick': {} }, { to: "/performance" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })));
    var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: "/performance" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })], __VLS_functionalComponentArgsRest(__VLS_36), false));
    var __VLS_39 = void 0;
    var __VLS_40 = void 0;
    var __VLS_41 = void 0;
    var __VLS_42 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUserMenu))
                return;
            __VLS_ctx.showUserMenu = false;
        }
    };
    __VLS_38.slots.default;
    var __VLS_38;
    var __VLS_43 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43(__assign(__assign({ 'onClick': {} }, { to: "/pricing" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })));
    var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: "/pricing" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })], __VLS_functionalComponentArgsRest(__VLS_44), false));
    var __VLS_47 = void 0;
    var __VLS_48 = void 0;
    var __VLS_49 = void 0;
    var __VLS_50 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUserMenu))
                return;
            __VLS_ctx.showUserMenu = false;
        }
    };
    __VLS_46.slots.default;
    var __VLS_46;
    if (__VLS_ctx.isPlatformAdmin) {
        var __VLS_51 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        var __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51(__assign(__assign({ 'onClick': {} }, { to: "/admin/dashboard" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })));
        var __VLS_53 = __VLS_52.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: "/admin/dashboard" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })], __VLS_functionalComponentArgsRest(__VLS_52), false));
        var __VLS_55 = void 0;
        var __VLS_56 = void 0;
        var __VLS_57 = void 0;
        var __VLS_58 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showUserMenu))
                    return;
                if (!(__VLS_ctx.isPlatformAdmin))
                    return;
                __VLS_ctx.showUserMenu = false;
            }
        };
        __VLS_54.slots.default;
        var __VLS_54;
    }
    if (__VLS_ctx.isOrgAdmin) {
        var __VLS_59 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        var __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59(__assign(__assign({ 'onClick': {} }, { to: "/org/dashboard" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })));
        var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: "/org/dashboard" }), { class: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" })], __VLS_functionalComponentArgsRest(__VLS_60), false));
        var __VLS_63 = void 0;
        var __VLS_64 = void 0;
        var __VLS_65 = void 0;
        var __VLS_66 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showUserMenu))
                    return;
                if (!(__VLS_ctx.isOrgAdmin))
                    return;
                __VLS_ctx.showUserMenu = false;
            }
        };
        __VLS_62.slots.default;
        var __VLS_62;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)(__assign({ class: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6 safe-area-left safe-area-right" }));
var __VLS_67 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
var __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({}));
var __VLS_69 = __VLS_68.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_68), false));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:ml-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['md:space-x-8']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-900']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-left']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-right']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            MobileNavigation: MobileNavigation_vue_1.default,
            BellIcon: outline_1.BellIcon,
            ChevronDownIcon: outline_1.ChevronDownIcon,
            TrophyIcon: outline_1.TrophyIcon,
            CheckCircleIcon: outline_1.CheckCircleIcon,
            authStore: authStore,
            performanceStore: performanceStore,
            subscriptionStore: subscriptionStore,
            showUserMenu: showUserMenu,
            visibleNavigation: visibleNavigation,
            isPlatformAdmin: isPlatformAdmin,
            isOrgAdmin: isOrgAdmin,
            handleLogout: handleLogout,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
