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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var date_fns_1 = require("date-fns");
var gesture_1 = require("../utils/gesture");
var accessibility_1 = require("../utils/accessibility");
var platform_1 = require("../utils/platform");
var outline_1 = require("@heroicons/vue/24/outline");
var isOpen = (0, vue_1.ref)(false);
var messages = (0, vue_1.ref)([]);
var inputMessage = (0, vue_1.ref)('');
var isTyping = (0, vue_1.ref)(false);
var messagesContainer = (0, vue_1.ref)();
var chatButton = (0, vue_1.ref)();
var chatPanel = (0, vue_1.ref)();
var chatInput = (0, vue_1.ref)();
// Focus trap for accessibility
var focusTrap = null;
// Body scroll lock for mobile
var unlockBodyScroll = null;
// Gesture cleanup
var cleanupSwipeGesture = null;
var quickSuggestions = [
    'Show job status',
    'Machine status',
    'Due dates',
    'Urgent jobs'
];
var toggleChat = function () {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        (0, vue_1.nextTick)(function () {
            scrollToBottom();
            // Set up focus trap for accessibility
            if (chatPanel.value) {
                focusTrap = (0, accessibility_1.createAccessibleFocusTrap)(chatPanel.value);
                focusTrap.activate();
                // Focus the input field
                if (chatInput.value) {
                    chatInput.value.focus();
                }
                // Lock body scroll on mobile
                if ((0, platform_1.isMobile)() && chatPanel.value) {
                    unlockBodyScroll = (0, accessibility_1.lockBodyScroll)(chatPanel.value);
                }
                // Add swipe gesture to close on mobile
                if ((0, platform_1.isMobile)() && chatPanel.value) {
                    cleanupSwipeGesture = (0, gesture_1.addSwipeGesture)(chatPanel.value, function (direction) {
                        if (direction === 'down') {
                            toggleChat();
                        }
                    });
                }
            }
        });
    }
    else {
        // Clean up when closing
        if (focusTrap) {
            focusTrap.deactivate();
            focusTrap = null;
        }
        if (unlockBodyScroll) {
            unlockBodyScroll();
            unlockBodyScroll = null;
        }
        if (cleanupSwipeGesture) {
            cleanupSwipeGesture();
            cleanupSwipeGesture = null;
        }
        // Return focus to chat button
        if (chatButton.value) {
            chatButton.value.focus();
        }
    }
};
var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!inputMessage.value.trim())
                    return [2 /*return*/];
                message = inputMessage.value.trim();
                inputMessage.value = '';
                return [4 /*yield*/, sendMessage(message)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sendMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Add user message
                messages.value.push({
                    id: Date.now().toString(),
                    content: message,
                    isUser: true,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                });
                scrollToBottom();
                // Simulate AI thinking
                isTyping.value = true;
                // Simulate delay
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 1:
                // Simulate delay
                _a.sent();
                response = generateResponse(message);
                // Add AI response
                messages.value.push({
                    id: Date.now().toString(),
                    content: response,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                });
                isTyping.value = false;
                scrollToBottom();
                return [2 /*return*/];
        }
    });
}); };
var generateResponse = function (query) {
    var lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('job status') || lowerQuery.includes('show job')) {
        return "We have 5 jobs running, 2 in setup, and 1 on hold. The most urgent job is J2024-004 for Acme Corp, due tomorrow.";
    }
    if (lowerQuery.includes('machine') || lowerQuery.includes('equipment')) {
        return "Currently, 7 machines are running, 3 are idle, and 1 is in maintenance. CNC-001 is running job J2024-001 with John Smith as operator.";
    }
    if (lowerQuery.includes('due date') || lowerQuery.includes('deadline')) {
        return "This week we have 3 jobs due: J2024-001 (Wednesday), J2024-003 (Thursday), and J2024-004 (Friday). All are currently on schedule.";
    }
    if (lowerQuery.includes('urgent') || lowerQuery.includes('priority')) {
        return "There is 1 urgent job: J2024-004 (Valve Body) for Fluid Dynamics Company. It's currently on hold due to material issues.";
    }
    // Default response
    return "I can help with job status, machine assignments, schedules, and more. What specific information are you looking for?";
};
var scrollToBottom = function () {
    (0, vue_1.nextTick)(function () {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};
var formatMessage = function (content) {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
};
var formatTime = function (timestamp) {
    return (0, date_fns_1.format)(new Date(timestamp), 'HH:mm');
};
// Handle keyboard shortcuts
var handleKeyDown = function (event) {
    // Alt+C to toggle chat
    if (event.altKey && event.key === 'c') {
        toggleChat();
    }
    // Escape to close chat
    if (event.key === 'Escape' && isOpen.value) {
        toggleChat();
    }
};
// Handle clicks outside to close
var handleClickOutside = function (event) {
    if (isOpen.value && chatPanel.value && chatButton.value) {
        if (!chatPanel.value.contains(event.target) &&
            !chatButton.value.contains(event.target)) {
            toggleChat();
        }
    }
};
// Auto-scroll when new messages arrive
(0, vue_1.watch)(function () { return messages.value.length; }, scrollToBottom);
// Add iOS specific styles
var applyIOSStyles = function () {
    if ((0, platform_1.isIOS)()) {
        // Add iOS-specific styles
        document.documentElement.classList.add('ios-device');
        // Fix for iOS input zoom
        var viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
};
(0, vue_1.onMounted)(function () {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    // Apply platform-specific styles
    applyIOSStyles();
    // Add tap gesture for mobile
    if (chatButton.value) {
        (0, gesture_1.addTapGesture)(chatButton.value, function () {
            toggleChat();
        });
    }
});
(0, vue_1.onUnmounted)(function () {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClickOutside);
    // Clean up any remaining handlers
    if (focusTrap) {
        focusTrap.deactivate();
    }
    if (unlockBodyScroll) {
        unlockBodyScroll();
    }
    if (cleanupSwipeGesture) {
        cleanupSwipeGesture();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 safe-area-right safe-area-bottom" }, { class: ({ 'chat-open': __VLS_ctx.isOpen }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.toggleChat) }, { class: "w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" }), { class: ({ 'rotate-45 transform': __VLS_ctx.isOpen }) }), { 'aria-label': "Chat with AI Assistant", ref: "chatButton" }));
/** @type {typeof __VLS_ctx.chatButton} */ ;
if (!__VLS_ctx.isOpen) {
    var __VLS_0 = {}.ChatBubbleLeftRightIcon;
    /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-6 h-6" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-6 h-6" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
}
else {
    var __VLS_4 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign({ class: "w-6 h-6" })));
    var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign({ class: "w-6 h-6" })], __VLS_functionalComponentArgsRest(__VLS_5), false));
}
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-bottom-right" }, { ref: "chatPanel", role: "dialog", 'aria-modal': "true", 'aria-labelledby': "chat-title" }));
    /** @type {typeof __VLS_ctx.chatPanel} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-primary-600 text-white p-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center space-x-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center" }));
    var __VLS_8 = {}.ChatBubbleLeftRightIcon;
    /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ class: "w-4 h-4" })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ id: "chat-title" }, { class: "font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-primary-100" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ ref: "messagesContainer" }, { class: "h-80 overflow-y-auto p-4 space-y-3" }), { 'aria-live': "polite" }));
    /** @type {typeof __VLS_ctx.messagesContainer} */ ;
    if (__VLS_ctx.messages.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2" }));
        var __VLS_12 = {}.ChatBubbleLeftRightIcon;
        /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
        // @ts-ignore
        var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign({ class: "w-6 h-6 text-primary-600" })));
        var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "w-6 h-6 text-primary-600" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-gray-600" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-wrap gap-2 justify-center mt-3" }));
        var _loop_1 = function (suggestion) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isOpen))
                        return;
                    if (!(__VLS_ctx.messages.length === 0))
                        return;
                    __VLS_ctx.sendMessage(suggestion);
                } }, { key: (suggestion) }), { class: "px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200" }));
            (suggestion);
        };
        for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.quickSuggestions)); _i < _a.length; _i++) {
            var suggestion = _a[_i][0];
            _loop_1(suggestion);
        }
    }
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.messages)); _b < _c.length; _b++) {
        var message = _c[_b][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ key: (message.id) }, { class: (message.isUser ? 'flex justify-end' : 'flex justify-start') }), { class: "animate-fade-in" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ class: "max-w-xs px-3 py-2 rounded-lg" }, { class: (message.isUser
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900') }), { 'aria-label': (message.isUser ? 'Your message' : 'Assistant message') }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.formatMessage(message.content)) }), null, null);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-xs mt-1 opacity-75" }, { class: (message.isUser ? 'text-primary-100' : 'text-gray-500') }));
        (__VLS_ctx.formatTime(message.timestamp));
    }
    if (__VLS_ctx.isTyping) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-start animate-fade-in" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-gray-100 text-gray-900 px-3 py-2 rounded-lg" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex space-x-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" }, { style: {} }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" }, { style: {} }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-3 border-t border-gray-200" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.handleSubmit) }, { class: "flex space-x-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.inputMessage), type: "text", placeholder: "Type your message..." }, { class: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), { disabled: (__VLS_ctx.isTyping), 'aria-label': "Type your message", ref: "chatInput" }));
    /** @type {typeof __VLS_ctx.chatInput} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ type: "submit", disabled: (!__VLS_ctx.inputMessage.trim() || __VLS_ctx.isTyping) }, { class: "px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" }), { 'aria-label': "Send message" }));
    var __VLS_16 = {}.PaperAirplaneIcon;
    /** @type {[typeof __VLS_components.PaperAirplaneIcon, ]} */ ;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16(__assign({ class: "w-5 h-5" })));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5" })], __VLS_functionalComponentArgsRest(__VLS_17), false));
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-20']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:bottom-8']} */ ;
/** @type {__VLS_StyleScopedClasses['md:right-8']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-right']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-offset-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-45']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-16']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-96']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['origin-bottom-right']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-100']} */ ;
/** @type {__VLS_StyleScopedClasses['h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            ChatBubbleLeftRightIcon: outline_1.ChatBubbleLeftRightIcon,
            PaperAirplaneIcon: outline_1.PaperAirplaneIcon,
            XMarkIcon: outline_1.XMarkIcon,
            isOpen: isOpen,
            messages: messages,
            inputMessage: inputMessage,
            isTyping: isTyping,
            messagesContainer: messagesContainer,
            chatButton: chatButton,
            chatPanel: chatPanel,
            chatInput: chatInput,
            quickSuggestions: quickSuggestions,
            toggleChat: toggleChat,
            handleSubmit: handleSubmit,
            sendMessage: sendMessage,
            formatMessage: formatMessage,
            formatTime: formatTime,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
