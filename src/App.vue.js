import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import AppLayout from './components/AppLayout.vue';
import FloatingChatButton from './components/FloatingChatButton.vue';
import OfflineIndicator from './components/OfflineIndicator.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import { getPlatformClass } from './utils/platform';
const authStore = useAuthStore();
onMounted(() => {
    authStore.initAuth();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "app",
    ...{ class: (__VLS_ctx.getPlatformClass()) },
});
/** @type {[typeof OfflineIndicator, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(OfflineIndicator, new OfflineIndicator({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof InstallPrompt, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(InstallPrompt, new InstallPrompt({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
if (!__VLS_ctx.authStore.isAuthenticated) {
    const __VLS_6 = {}.RouterView;
    /** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
else {
    /** @type {[typeof AppLayout, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(AppLayout, new AppLayout({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
/** @type {[typeof FloatingChatButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(FloatingChatButton, new FloatingChatButton({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppLayout: AppLayout,
            FloatingChatButton: FloatingChatButton,
            OfflineIndicator: OfflineIndicator,
            InstallPrompt: InstallPrompt,
            getPlatformClass: getPlatformClass,
            authStore: authStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
