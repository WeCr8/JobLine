import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useJobsStore } from '../stores/jobs';
import { useChatStore } from '../stores/chat';
import { integrationService } from '../services/integration.service';
import { DocumentIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
const router = useRouter();
const jobsStore = useJobsStore();
const chatStore = useChatStore();
// State
const loading = ref(true);
const error = ref(null);
const success = ref(false);
const successMessage = ref('');
const sharedText = ref('');
const sharedUrl = ref('');
const sharedTitle = ref('');
const sharedFiles = ref([]);
const destination = ref('chat');
const selectedJobId = ref('');
// Computed
const jobs = computed(() => jobsStore.jobs);
const canProcess = computed(() => {
    if (destination.value === 'job') {
        return !!selectedJobId.value;
    }
    return true;
});
// Methods
const processShare = async () => {
    loading.value = true;
    error.value = null;
    try {
        switch (destination.value) {
            case 'chat':
                await processForChat();
                break;
            case 'integration':
                await processForIntegration();
                break;
            case 'job':
                await processForJob();
                break;
        }
        success.value = true;
    }
    catch (err) {
        error.value = err.message;
        console.error('Error processing share:', err);
    }
    finally {
        loading.value = false;
    }
};
const processForChat = async () => {
    // Process text for chat
    if (sharedText.value) {
        await chatStore.processUserQuery(sharedText.value);
        successMessage.value = 'Content shared to AI Assistant';
    }
    // Process URL for chat
    if (sharedUrl.value) {
        await chatStore.processUserQuery(`Check this URL: ${sharedUrl.value}`);
        successMessage.value = 'URL shared to AI Assistant';
    }
    // Process files for chat
    if (sharedFiles.value.length > 0) {
        const file = sharedFiles.value[0];
        if (file.type.startsWith('image/')) {
            await chatStore.processImageForPartLookup(file);
            successMessage.value = 'Image shared to AI Assistant for analysis';
        }
        else {
            throw new Error('Only images can be shared to the AI Assistant');
        }
    }
};
const processForIntegration = async () => {
    // Process files for integration
    if (sharedFiles.value.length > 0) {
        const file = sharedFiles.value[0];
        if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Get the first CSV upload connection
            const connections = await integrationService.fetchConnections();
            const csvConnection = connections.find(c => c.type === 'csv-upload');
            if (!csvConnection) {
                throw new Error('No CSV upload connection found');
            }
            await integrationService.processFileUpload(file, csvConnection.id, 'job-data');
            successMessage.value = 'File shared to Data Integration';
        }
        else {
            throw new Error('Only CSV or Excel files can be shared to Data Integration');
        }
    }
    else {
        throw new Error('No file shared');
    }
};
const processForJob = async () => {
    if (!selectedJobId.value) {
        throw new Error('No job selected');
    }
    // In a real implementation, this would attach the shared content to the job
    // For now, we'll just simulate success
    if (sharedFiles.value.length > 0) {
        successMessage.value = `File attached to job ${selectedJobId.value}`;
    }
    else if (sharedText.value || sharedUrl.value) {
        successMessage.value = `Note added to job ${selectedJobId.value}`;
    }
    else {
        throw new Error('No content to attach to job');
    }
};
const goToDestination = () => {
    switch (destination.value) {
        case 'chat':
            router.push('/chat');
            break;
        case 'integration':
            router.push('/integration');
            break;
        case 'job':
            router.push(`/jobs?id=${selectedJobId.value}`);
            break;
        default:
            router.push('/dashboard');
    }
};
const goBack = () => {
    router.push('/dashboard');
};
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const parseShareTarget = async () => {
    try {
        // Check if this is a share target request
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        // Get shared text, URL, and title from query parameters
        sharedText.value = params.get('text') || '';
        sharedUrl.value = params.get('url') || '';
        sharedTitle.value = params.get('title') || '';
        // Check if this is a form submission with files
        if (window.location.pathname === '/share-target') {
            try {
                const formData = await new Promise((resolve) => {
                    // Wait for the form data to be available
                    const interval = setInterval(() => {
                        const form = document.querySelector('form');
                        if (form) {
                            clearInterval(interval);
                            resolve(new FormData(form));
                        }
                    }, 100);
                });
                // Get shared files
                const files = formData.getAll('file');
                sharedFiles.value = files.filter(file => file instanceof File);
            }
            catch (err) {
                console.error('Error parsing form data:', err);
            }
        }
        // Fetch jobs for job selection
        await jobsStore.fetchJobs();
    }
    catch (err) {
        console.error('Error parsing share target:', err);
        error.value = 'Failed to process shared content';
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    parseShareTarget();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['share-target-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-error']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-success']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-error']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-success']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-content']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-text']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-url']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-title']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-files']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-destination']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-text']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-url']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-title']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-files']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-select']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "share-target" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "share-target-container" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-10 w-10 text-primary-600" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-error" },
    });
    const __VLS_0 = {}.ExclamationCircleIcon;
    /** @type {[typeof __VLS_components.ExclamationCircleIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-12 h-12 text-red-500" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-12 h-12 text-red-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goBack) },
        ...{ class: "share-target-button" },
    });
}
else if (__VLS_ctx.success) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-success" },
    });
    const __VLS_4 = {}.CheckCircleIcon;
    /** @type {[typeof __VLS_components.CheckCircleIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "w-12 h-12 text-green-500" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "w-12 h-12 text-green-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.successMessage);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goToDestination) },
        ...{ class: "share-target-button share-target-button-primary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goBack) },
        ...{ class: "share-target-button" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    if (__VLS_ctx.sharedText) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "share-target-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedText);
    }
    if (__VLS_ctx.sharedUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "share-target-url" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedUrl);
    }
    if (__VLS_ctx.sharedTitle) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "share-target-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedTitle);
    }
    if (__VLS_ctx.sharedFiles.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "share-target-files" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
        for (const [file, index] of __VLS_getVForSourceType((__VLS_ctx.sharedFiles))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (index),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "share-target-file" },
            });
            const __VLS_8 = {}.DocumentIcon;
            /** @type {[typeof __VLS_components.DocumentIcon, ]} */ ;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                ...{ class: "w-5 h-5 text-primary-600" },
            }));
            const __VLS_10 = __VLS_9({
                ...{ class: "w-5 h-5 text-primary-600" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_9));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "share-target-file-info" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "share-target-file-name" },
            });
            (file.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "share-target-file-size" },
            });
            (__VLS_ctx.formatFileSize(file.size));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-destination" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.destination),
        ...{ class: "share-target-select" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "chat",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "integration",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "job",
    });
    if (__VLS_ctx.destination === 'job') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "share-target-job-select" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "share-target-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
            value: (__VLS_ctx.selectedJobId),
            ...{ class: "share-target-select" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "",
        });
        for (const [job] of __VLS_getVForSourceType((__VLS_ctx.jobs))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (job.id),
                value: (job.id),
            });
            (job.jobNumber);
            (job.partName);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-target-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.processShare) },
        ...{ class: "share-target-button share-target-button-primary" },
        disabled: (!__VLS_ctx.canProcess),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goBack) },
        ...{ class: "share-target-button" },
    });
}
/** @type {__VLS_StyleScopedClasses['share-target']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-container']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-error']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-success']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-content']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-text']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-url']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-title']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-files']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-file']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-file-size']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-destination']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-select']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-job-select']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-label']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-select']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['share-target-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentIcon: DocumentIcon,
            ExclamationCircleIcon: ExclamationCircleIcon,
            CheckCircleIcon: CheckCircleIcon,
            loading: loading,
            error: error,
            success: success,
            successMessage: successMessage,
            sharedText: sharedText,
            sharedUrl: sharedUrl,
            sharedTitle: sharedTitle,
            sharedFiles: sharedFiles,
            destination: destination,
            selectedJobId: selectedJobId,
            jobs: jobs,
            canProcess: canProcess,
            processShare: processShare,
            goToDestination: goToDestination,
            goBack: goBack,
            formatFileSize: formatFileSize,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
