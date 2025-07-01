import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { addSwipeGesture, addTapGesture } from '../utils/gesture';
import { createAccessibleFocusTrap, lockBodyScroll } from '../utils/accessibility';
import { isIOS, isMobile } from '../utils/platform';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/outline';
const isOpen = ref(false);
const messages = ref([]);
const inputMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref();
const chatButton = ref();
const chatPanel = ref();
const chatInput = ref();
// Focus trap for accessibility
let focusTrap = null;
// Body scroll lock for mobile
let unlockBodyScroll = null;
// Gesture cleanup
let cleanupSwipeGesture = null;
const quickSuggestions = [
    'Show job status',
    'Machine status',
    'Due dates',
    'Urgent jobs'
];
const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        nextTick(() => {
            scrollToBottom();
            // Set up focus trap for accessibility
            if (chatPanel.value) {
                focusTrap = createAccessibleFocusTrap(chatPanel.value);
                focusTrap.activate();
                // Focus the input field
                if (chatInput.value) {
                    chatInput.value.focus();
                }
                // Lock body scroll on mobile
                if (isMobile() && chatPanel.value) {
                    unlockBodyScroll = lockBodyScroll(chatPanel.value);
                }
                // Add swipe gesture to close on mobile
                if (isMobile() && chatPanel.value) {
                    cleanupSwipeGesture = addSwipeGesture(chatPanel.value, (direction) => {
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
const handleSubmit = async () => {
    if (!inputMessage.value.trim())
        return;
    const message = inputMessage.value.trim();
    inputMessage.value = '';
    await sendMessage(message);
};
const sendMessage = async (message) => {
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Generate response based on query
    const response = generateResponse(message);
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
};
const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
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
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};
const formatMessage = (content) => {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
};
const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm');
};
// Handle keyboard shortcuts
const handleKeyDown = (event) => {
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
const handleClickOutside = (event) => {
    if (isOpen.value && chatPanel.value && chatButton.value) {
        if (!chatPanel.value.contains(event.target) &&
            !chatButton.value.contains(event.target)) {
            toggleChat();
        }
    }
};
// Auto-scroll when new messages arrive
watch(() => messages.value.length, scrollToBottom);
// Add iOS specific styles
const applyIOSStyles = () => {
    if (isIOS()) {
        // Add iOS-specific styles
        document.documentElement.classList.add('ios-device');
        // Fix for iOS input zoom
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
};
onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    // Apply platform-specific styles
    applyIOSStyles();
    // Add tap gesture for mobile
    if (chatButton.value) {
        addTapGesture(chatButton.value, () => {
            toggleChat();
        });
    }
});
onUnmounted(() => {
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
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-open']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 safe-area-right safe-area-bottom" },
    ...{ class: ({ 'chat-open': __VLS_ctx.isOpen }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleChat) },
    ...{ class: "w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" },
    ...{ class: ({ 'rotate-45 transform': __VLS_ctx.isOpen }) },
    'aria-label': "Chat with AI Assistant",
    ref: "chatButton",
});
/** @type {typeof __VLS_ctx.chatButton} */ ;
if (!__VLS_ctx.isOpen) {
    const __VLS_0 = {}.ChatBubbleLeftRightIcon;
    /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-6 h-6" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-6 h-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else {
    const __VLS_4 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "w-6 h-6" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "w-6 h-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-bottom-right" },
        ref: "chatPanel",
        role: "dialog",
        'aria-modal': "true",
        'aria-labelledby': "chat-title",
    });
    /** @type {typeof __VLS_ctx.chatPanel} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-primary-600 text-white p-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center" },
    });
    const __VLS_8 = {}.ChatBubbleLeftRightIcon;
    /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        id: "chat-title",
        ...{ class: "font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-primary-100" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "messagesContainer",
        ...{ class: "h-80 overflow-y-auto p-4 space-y-3" },
        'aria-live': "polite",
    });
    /** @type {typeof __VLS_ctx.messagesContainer} */ ;
    if (__VLS_ctx.messages.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2" },
        });
        const __VLS_12 = {}.ChatBubbleLeftRightIcon;
        /** @type {[typeof __VLS_components.ChatBubbleLeftRightIcon, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ class: "w-6 h-6 text-primary-600" },
        }));
        const __VLS_14 = __VLS_13({
            ...{ class: "w-6 h-6 text-primary-600" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-wrap gap-2 justify-center mt-3" },
        });
        for (const [suggestion] of __VLS_getVForSourceType((__VLS_ctx.quickSuggestions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isOpen))
                            return;
                        if (!(__VLS_ctx.messages.length === 0))
                            return;
                        __VLS_ctx.sendMessage(suggestion);
                    } },
                key: (suggestion),
                ...{ class: "px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200" },
            });
            (suggestion);
        }
    }
    for (const [message] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (message.id),
            ...{ class: (message.isUser ? 'flex justify-end' : 'flex justify-start') },
            ...{ class: "animate-fade-in" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "max-w-xs px-3 py-2 rounded-lg" },
            ...{ class: (message.isUser
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900') },
            'aria-label': (message.isUser ? 'Your message' : 'Assistant message'),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formatMessage(message.content)) }, null, null);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-xs mt-1 opacity-75" },
            ...{ class: (message.isUser ? 'text-primary-100' : 'text-gray-500') },
        });
        (__VLS_ctx.formatTime(message.timestamp));
    }
    if (__VLS_ctx.isTyping) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-start animate-fade-in" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gray-100 text-gray-900 px-3 py-2 rounded-lg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex space-x-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" },
            ...{ style: {} },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-3 border-t border-gray-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
        ...{ class: "flex space-x-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (__VLS_ctx.inputMessage),
        type: "text",
        placeholder: "Type your message...",
        ...{ class: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" },
        disabled: (__VLS_ctx.isTyping),
        'aria-label': "Type your message",
        ref: "chatInput",
    });
    /** @type {typeof __VLS_ctx.chatInput} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        disabled: (!__VLS_ctx.inputMessage.trim() || __VLS_ctx.isTyping),
        ...{ class: "px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" },
        'aria-label': "Send message",
    });
    const __VLS_16 = {}.PaperAirplaneIcon;
    /** @type {[typeof __VLS_components.PaperAirplaneIcon, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChatBubbleLeftRightIcon: ChatBubbleLeftRightIcon,
            PaperAirplaneIcon: PaperAirplaneIcon,
            XMarkIcon: XMarkIcon,
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
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
