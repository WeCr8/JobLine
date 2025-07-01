import { ref, computed, onMounted } from 'vue';
import { integrationService } from '../services/integration.service';
import { DocumentArrowUpIcon, DocumentIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
const props = withDefaults(defineProps(), {
    acceptedFormats: () => ['csv', 'xlsx', 'xls'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    description: '',
    disabled: false,
    defaultConnectionId: '',
    defaultImportType: 'job-data'
});
const emit = defineEmits();
// State
const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref(null);
const connections = ref([]);
const selectedConnectionId = ref(props.defaultConnectionId);
const importType = ref(props.defaultImportType);
// Computed
const acceptedFileTypes = computed(() => {
    return props.acceptedFormats.map(format => {
        if (format === 'csv')
            return '.csv';
        if (format === 'xlsx' || format === 'xls')
            return '.xlsx, .xls';
        return `.${format}`;
    }).join(', ');
});
const canUpload = computed(() => {
    return selectedFile.value && selectedConnectionId.value;
});
// Methods
const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};
const handleDragOver = () => {
    isDragging.value = true;
};
const handleDragLeave = () => {
    isDragging.value = false;
};
const handleDrop = (event) => {
    isDragging.value = false;
    if (!event.dataTransfer?.files.length) {
        return;
    }
    const file = event.dataTransfer.files[0];
    validateAndSetFile(file);
};
const handleFileChange = (event) => {
    const input = event.target;
    if (!input.files?.length) {
        return;
    }
    const file = input.files[0];
    validateAndSetFile(file);
};
const validateAndSetFile = (file) => {
    error.value = null;
    // Check file size
    if (file.size > props.maxFileSize) {
        error.value = `File size exceeds the maximum limit of ${formatFileSize(props.maxFileSize)}`;
        return;
    }
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!props.acceptedFormats.includes(fileExtension)) {
        error.value = `File type not supported. Accepted formats: ${props.acceptedFormats.join(', ')}`;
        return;
    }
    selectedFile.value = file;
};
const clearFile = () => {
    selectedFile.value = null;
    error.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};
const startUpload = async () => {
    if (!selectedFile.value || !selectedConnectionId.value) {
        return;
    }
    uploading.value = true;
    uploadProgress.value = 0;
    error.value = null;
    emit('upload-start', selectedFile.value);
    try {
        // Simulate progress
        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += 10;
                emit('upload-progress', uploadProgress.value);
            }
        }, 500);
        // Process the file
        const result = await integrationService.processFileUpload(selectedFile.value, selectedConnectionId.value, importType.value);
        clearInterval(progressInterval);
        uploadProgress.value = 100;
        emit('upload-progress', 100);
        // Complete
        emit('upload-complete', result);
        // Reset
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    }
    catch (err) {
        error.value = err.message;
        emit('upload-error', error.value);
    }
    finally {
        uploading.value = false;
    }
};
const cancelUpload = () => {
    uploading.value = false;
    uploadProgress.value = 0;
    emit('upload-cancel');
};
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const loadConnections = async () => {
    try {
        connections.value = await integrationService.fetchConnections();
        // Set default connection if not already set
        if (!selectedConnectionId.value && connections.value.length > 0) {
            selectedConnectionId.value = connections.value[0].id;
        }
    }
    catch (err) {
        console.error('Error loading connections:', err);
    }
};
onMounted(() => {
    loadConnections();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    acceptedFormats: () => ['csv', 'xlsx', 'xls'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    description: '',
    disabled: false,
    defaultConnectionId: '',
    defaultImportType: 'job-data'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['uploader-dropzone']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-action']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-select']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-form']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-select']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ios-device']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-dropzone']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "integration-uploader" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragover: (__VLS_ctx.handleDragOver) },
    ...{ onDragleave: (__VLS_ctx.handleDragLeave) },
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ class: "uploader-dropzone" },
    ...{ class: ({
            'uploader-dropzone-active': __VLS_ctx.isDragging,
            'uploader-dropzone-disabled': __VLS_ctx.disabled
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "uploader-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "uploader-icon" },
});
if (!__VLS_ctx.uploading) {
    const __VLS_0 = {}.DocumentArrowUpIcon;
    /** @type {[typeof __VLS_components.DocumentArrowUpIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "w-12 h-12 text-gray-400" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "w-12 h-12 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin w-12 h-12 text-primary-600" },
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "uploader-title" },
});
(__VLS_ctx.uploading ? 'Uploading...' : 'Upload File');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "uploader-description" },
});
(__VLS_ctx.description || 'Drag and drop your file here, or click to browse');
if (!__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-formats" },
    });
    for (const [format] of __VLS_getVForSourceType((__VLS_ctx.acceptedFormats))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            key: (format),
            ...{ class: "uploader-format" },
        });
        (format.toUpperCase());
    }
}
if (__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-progress" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-progress-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-progress-fill" },
        ...{ style: ({ width: `${__VLS_ctx.uploadProgress}%` }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-progress-text" },
    });
    (__VLS_ctx.uploadProgress);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    ref: "fileInput",
    type: "file",
    ...{ class: "uploader-input" },
    accept: (__VLS_ctx.acceptedFileTypes),
    disabled: (__VLS_ctx.disabled || __VLS_ctx.uploading),
});
/** @type {typeof __VLS_ctx.fileInput} */ ;
if (!__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.triggerFileInput) },
        type: "button",
        ...{ class: "uploader-button" },
        disabled: (__VLS_ctx.disabled),
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.cancelUpload) },
        type: "button",
        ...{ class: "uploader-button uploader-button-cancel" },
    });
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-error" },
        role: "alert",
    });
    const __VLS_4 = {}.ExclamationCircleIcon;
    /** @type {[typeof __VLS_components.ExclamationCircleIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.error);
}
if (__VLS_ctx.selectedFile && !__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-file" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-file-info" },
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
        ...{ class: "uploader-file-details" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-file-name" },
    });
    (__VLS_ctx.selectedFile.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-file-size" },
    });
    (__VLS_ctx.formatFileSize(__VLS_ctx.selectedFile.size));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-file-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.clearFile) },
        type: "button",
        ...{ class: "uploader-file-action" },
    });
    const __VLS_12 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
if (__VLS_ctx.selectedFile && !__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-form" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-form-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "uploader-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.importType),
        ...{ class: "uploader-select" },
        disabled: (__VLS_ctx.disabled),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "job-data",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "operator-workcenter",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "routing-operations",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "cost-tracking",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "customer-association",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "uploader-form-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "uploader-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.selectedConnectionId),
        ...{ class: "uploader-select" },
        disabled: (__VLS_ctx.disabled),
    });
    for (const [conn] of __VLS_getVForSourceType((__VLS_ctx.connections))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (conn.id),
            value: (conn.id),
        });
        (conn.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.startUpload) },
        type: "button",
        ...{ class: "uploader-submit" },
        disabled: (!__VLS_ctx.canUpload || __VLS_ctx.disabled),
    });
}
/** @type {__VLS_StyleScopedClasses['integration-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-dropzone']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-dropzone-active']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-dropzone-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-content']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-title']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-description']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-formats']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-format']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-input']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-button-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-error']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-details']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-size']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-file-action']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-form']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-label']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-select']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-label']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-select']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader-submit']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentArrowUpIcon: DocumentArrowUpIcon,
            DocumentIcon: DocumentIcon,
            XMarkIcon: XMarkIcon,
            ExclamationCircleIcon: ExclamationCircleIcon,
            fileInput: fileInput,
            selectedFile: selectedFile,
            isDragging: isDragging,
            uploading: uploading,
            uploadProgress: uploadProgress,
            error: error,
            connections: connections,
            selectedConnectionId: selectedConnectionId,
            importType: importType,
            acceptedFileTypes: acceptedFileTypes,
            canUpload: canUpload,
            triggerFileInput: triggerFileInput,
            handleDragOver: handleDragOver,
            handleDragLeave: handleDragLeave,
            handleDrop: handleDrop,
            handleFileChange: handleFileChange,
            clearFile: clearFile,
            startUpload: startUpload,
            cancelUpload: cancelUpload,
            formatFileSize: formatFileSize,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
