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
var integration_service_1 = require("../services/integration.service");
var outline_1 = require("@heroicons/vue/24/outline");
var props = withDefaults(defineProps(), {
    acceptedFormats: function () { return ['csv', 'xlsx', 'xls']; },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    description: '',
    disabled: false,
    defaultConnectionId: '',
    defaultImportType: 'job-data'
});
var emit = defineEmits();
// State
var fileInput = (0, vue_1.ref)(null);
var selectedFile = (0, vue_1.ref)(null);
var isDragging = (0, vue_1.ref)(false);
var uploading = (0, vue_1.ref)(false);
var uploadProgress = (0, vue_1.ref)(0);
var error = (0, vue_1.ref)(null);
var connections = (0, vue_1.ref)([]);
var selectedConnectionId = (0, vue_1.ref)(props.defaultConnectionId);
var importType = (0, vue_1.ref)(props.defaultImportType);
// Computed
var acceptedFileTypes = (0, vue_1.computed)(function () {
    return props.acceptedFormats.map(function (format) {
        if (format === 'csv')
            return '.csv';
        if (format === 'xlsx' || format === 'xls')
            return '.xlsx, .xls';
        return ".".concat(format);
    }).join(', ');
});
var canUpload = (0, vue_1.computed)(function () {
    return selectedFile.value && selectedConnectionId.value;
});
// Methods
var triggerFileInput = function () {
    if (fileInput.value) {
        fileInput.value.click();
    }
};
var handleDragOver = function () {
    isDragging.value = true;
};
var handleDragLeave = function () {
    isDragging.value = false;
};
var handleDrop = function (event) {
    var _a;
    isDragging.value = false;
    if (!((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files.length)) {
        return;
    }
    var file = event.dataTransfer.files[0];
    validateAndSetFile(file);
};
var handleFileChange = function (event) {
    var _a;
    var input = event.target;
    if (!((_a = input.files) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    var file = input.files[0];
    validateAndSetFile(file);
};
var validateAndSetFile = function (file) {
    var _a;
    error.value = null;
    // Check file size
    if (file.size > props.maxFileSize) {
        error.value = "File size exceeds the maximum limit of ".concat(formatFileSize(props.maxFileSize));
        return;
    }
    // Check file type
    var fileExtension = ((_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    if (!props.acceptedFormats.includes(fileExtension)) {
        error.value = "File type not supported. Accepted formats: ".concat(props.acceptedFormats.join(', '));
        return;
    }
    selectedFile.value = file;
};
var clearFile = function () {
    selectedFile.value = null;
    error.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};
var startUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var progressInterval, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!selectedFile.value || !selectedConnectionId.value) {
                    return [2 /*return*/];
                }
                uploading.value = true;
                uploadProgress.value = 0;
                error.value = null;
                emit('upload-start', selectedFile.value);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                progressInterval = setInterval(function () {
                    if (uploadProgress.value < 90) {
                        uploadProgress.value += 10;
                        emit('upload-progress', uploadProgress.value);
                    }
                }, 500);
                return [4 /*yield*/, integration_service_1.integrationService.processFileUpload(selectedFile.value, selectedConnectionId.value, importType.value)];
            case 2:
                result = _a.sent();
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
                return [3 /*break*/, 5];
            case 3:
                err_1 = _a.sent();
                error.value = err_1.message;
                emit('upload-error', error.value);
                return [3 /*break*/, 5];
            case 4:
                uploading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var cancelUpload = function () {
    uploading.value = false;
    uploadProgress.value = 0;
    emit('upload-cancel');
};
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var loadConnections = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = connections;
                return [4 /*yield*/, integration_service_1.integrationService.fetchConnections()];
            case 1:
                _a.value = _b.sent();
                // Set default connection if not already set
                if (!selectedConnectionId.value && connections.value.length > 0) {
                    selectedConnectionId.value = connections.value[0].id;
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                console.error('Error loading connections:', err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () {
    loadConnections();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    acceptedFormats: function () { return ['csv', 'xlsx', 'xls']; },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    description: '',
    disabled: false,
    defaultConnectionId: '',
    defaultImportType: 'job-data'
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "integration-uploader" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign({ onDragover: (__VLS_ctx.handleDragOver) }, { onDragleave: (__VLS_ctx.handleDragLeave) }), { onDrop: (__VLS_ctx.handleDrop) }), { class: "uploader-dropzone" }), { class: ({
        'uploader-dropzone-active': __VLS_ctx.isDragging,
        'uploader-dropzone-disabled': __VLS_ctx.disabled
    }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-icon" }));
if (!__VLS_ctx.uploading) {
    var __VLS_0 = {}.DocumentArrowUpIcon;
    /** @type {[typeof __VLS_components.DocumentArrowUpIcon, ]} */ ;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-12 h-12 text-gray-400" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-12 h-12 text-gray-400" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin w-12 h-12 text-primary-600" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "uploader-title" }));
(__VLS_ctx.uploading ? 'Uploading...' : 'Upload File');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "uploader-description" }));
(__VLS_ctx.description || 'Drag and drop your file here, or click to browse');
if (!__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-formats" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.acceptedFormats)); _i < _a.length; _i++) {
        var format = _a[_i][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ key: (format) }, { class: "uploader-format" }));
        (format.toUpperCase());
    }
}
if (__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-progress" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-progress-bar" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-progress-fill" }, { style: ({ width: "".concat(__VLS_ctx.uploadProgress, "%") }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-progress-text" }));
    (__VLS_ctx.uploadProgress);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onChange: (__VLS_ctx.handleFileChange) }, { ref: "fileInput", type: "file" }), { class: "uploader-input" }), { accept: (__VLS_ctx.acceptedFileTypes), disabled: (__VLS_ctx.disabled || __VLS_ctx.uploading) }));
/** @type {typeof __VLS_ctx.fileInput} */ ;
if (!__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.triggerFileInput) }, { type: "button" }), { class: "uploader-button" }), { disabled: (__VLS_ctx.disabled) }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.cancelUpload) }, { type: "button" }), { class: "uploader-button uploader-button-cancel" }));
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-error" }, { role: "alert" }));
    var __VLS_4 = {}.ExclamationCircleIcon;
    /** @type {[typeof __VLS_components.ExclamationCircleIcon, ]} */ ;
    // @ts-ignore
    var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign({ class: "w-5 h-5" })));
    var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5" })], __VLS_functionalComponentArgsRest(__VLS_5), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.error);
}
if (__VLS_ctx.selectedFile && !__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file-info" }));
    var __VLS_8 = {}.DocumentIcon;
    /** @type {[typeof __VLS_components.DocumentIcon, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ class: "w-5 h-5 text-primary-600" })));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5 text-primary-600" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file-details" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file-name" }));
    (__VLS_ctx.selectedFile.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file-size" }));
    (__VLS_ctx.formatFileSize(__VLS_ctx.selectedFile.size));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-file-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.clearFile) }, { type: "button" }), { class: "uploader-file-action" }));
    var __VLS_12 = {}.XMarkIcon;
    /** @type {[typeof __VLS_components.XMarkIcon, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign({ class: "w-5 h-5" })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
}
if (__VLS_ctx.selectedFile && !__VLS_ctx.uploading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-form" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "uploader-label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.importType) }, { class: "uploader-select" }), { disabled: (__VLS_ctx.disabled) }));
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "uploader-form-group" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "uploader-label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.selectedConnectionId) }, { class: "uploader-select" }), { disabled: (__VLS_ctx.disabled) }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.connections)); _b < _c.length; _b++) {
        var conn = _c[_b][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (conn.id),
            value: (conn.id),
        });
        (conn.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.startUpload) }, { type: "button" }), { class: "uploader-submit" }), { disabled: (!__VLS_ctx.canUpload || __VLS_ctx.disabled) }));
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
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            DocumentArrowUpIcon: outline_1.DocumentArrowUpIcon,
            DocumentIcon: outline_1.DocumentIcon,
            XMarkIcon: outline_1.XMarkIcon,
            ExclamationCircleIcon: outline_1.ExclamationCircleIcon,
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
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
