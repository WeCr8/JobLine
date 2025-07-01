import { ref, onMounted, onUnmounted } from 'vue';
import { isIOS, isAndroid, isStandalone } from '../utils/platform';
const showInstallPrompt = ref(false);
// Check if the app is already installed
const isAppInstalled = () => {
    return isStandalone();
};
// Check if the install prompt was previously dismissed
const wasPromptDismissed = () => {
    return localStorage.getItem('installPromptDismissed') === 'true';
};
// Show iOS specific install instructions
const showIOSInstructions = () => {
    // For iOS, we need to show custom instructions since there's no install API
    if (isIOS() && !isAppInstalled() && !wasPromptDismissed()) {
        showInstallPrompt.value = true;
    }
};
// Handle install button click
const installApp = () => {
    if (isIOS()) {
        // Show iOS-specific instructions
        alert('To install this app on your iPhone:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top-right corner');
    }
    else {
        // For Android/Chrome, use the Web App Install API
        window.installPWA();
    }
    showInstallPrompt.value = false;
};
// Dismiss the install prompt
const dismissInstallPrompt = () => {
    showInstallPrompt.value = false;
    localStorage.setItem('installPromptDismissed', 'true');
};
// Handle the beforeinstallprompt event
const handleBeforeInstallPrompt = () => {
    // Only show for Android, as iOS uses different mechanism
    if (isAndroid() && !isAppInstalled() && !wasPromptDismissed()) {
        showInstallPrompt.value = true;
    }
};
onMounted(() => {
    // Don't show if already installed
    if (isAppInstalled()) {
        return;
    }
    // Don't show if previously dismissed
    if (wasPromptDismissed()) {
        return;
    }
    // For iOS, show custom instructions
    if (isIOS()) {
        // Delay showing the prompt to avoid overwhelming the user
        setTimeout(showIOSInstructions, 3000);
    }
    // For Android/Chrome, listen for the beforeinstallprompt event
    window.addEventListener('pwaInstallable', handleBeforeInstallPrompt);
    // Hide prompt if app gets installed
    window.addEventListener('pwaInstalled', () => {
        showInstallPrompt.value = false;
    });
});
onUnmounted(() => {
    window.removeEventListener('pwaInstallable', handleBeforeInstallPrompt);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.showInstallPrompt) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed top-4 left-4 right-4 bg-primary-600 text-white p-3 rounded-lg z-40 safe-area-top" },
        role: "alert",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs opacity-90" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex space-x-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.installApp) },
        ...{ class: "bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs transition-colors duration-200" },
        'aria-label': "Install app",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.dismissInstallPrompt) },
        ...{ class: "bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs transition-colors duration-200" },
        'aria-label': "Dismiss installation prompt",
    });
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-40']} */ ;
/** @type {__VLS_StyleScopedClasses['safe-area-top']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            showInstallPrompt: showInstallPrompt,
            installApp: installApp,
            dismissInstallPrompt: dismissInstallPrompt,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
