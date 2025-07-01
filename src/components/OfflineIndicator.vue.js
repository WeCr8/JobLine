import { ref, onMounted, onUnmounted } from 'vue';
import { WifiIcon } from '@heroicons/vue/24/outline';
import { addConnectivityListeners } from '../utils/offline';
const isOnline = ref(navigator.onLine);
const handleOnline = () => {
    isOnline.value = true;
};
const handleOffline = () => {
    isOnline.value = false;
};
onMounted(() => {
    // Set initial state
    isOnline.value = navigator.onLine;
    // Add listeners
    const cleanup = addConnectivityListeners(handleOnline, handleOffline);
    onUnmounted(() => {
        cleanup();
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (!__VLS_ctx.isOnline) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "offline-indicator safe-area-top" },
        role: "alert",
        'aria-live': "assertive",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-center space-x-2 py-1" },
    });
    const __VLS_0 = {}.WifiIcon;
    /** @type {[typeof __VLS_components.WifiIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
/** @type {__VLS_StyleScopedClasses['offline-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-top']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            WifiIcon: WifiIcon,
            isOnline: isOnline,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
