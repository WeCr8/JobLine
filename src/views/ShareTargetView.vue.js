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
var vue_router_1 = require("vue-router");
var jobs_1 = require("../stores/jobs");
var chat_1 = require("../stores/chat");
var integration_service_1 = require("../services/integration.service");
var outline_1 = require("@heroicons/vue/24/outline");
var router = (0, vue_router_1.useRouter)();
var jobsStore = (0, jobs_1.useJobsStore)();
var chatStore = (0, chat_1.useChatStore)();
// State
var loading = (0, vue_1.ref)(true);
var error = (0, vue_1.ref)(null);
var success = (0, vue_1.ref)(false);
var successMessage = (0, vue_1.ref)('');
var sharedText = (0, vue_1.ref)('');
var sharedUrl = (0, vue_1.ref)('');
var sharedTitle = (0, vue_1.ref)('');
var sharedFiles = (0, vue_1.ref)([]);
var destination = (0, vue_1.ref)('chat');
var selectedJobId = (0, vue_1.ref)('');
// Computed
var jobs = (0, vue_1.computed)(function () { return jobsStore.jobs; });
var canProcess = (0, vue_1.computed)(function () {
    if (destination.value === 'job') {
        return !!selectedJobId.value;
    }
    return true;
});
// Methods
var processShare = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loading.value = true;
                error.value = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, 10, 11]);
                _a = destination.value;
                switch (_a) {
                    case 'chat': return [3 /*break*/, 2];
                    case 'integration': return [3 /*break*/, 4];
                    case 'job': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 2: return [4 /*yield*/, processForChat()];
            case 3:
                _b.sent();
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, processForIntegration()];
            case 5:
                _b.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, processForJob()];
            case 7:
                _b.sent();
                return [3 /*break*/, 8];
            case 8:
                success.value = true;
                return [3 /*break*/, 11];
            case 9:
                err_1 = _b.sent();
                error.value = err_1.message;
                console.error('Error processing share:', err_1);
                return [3 /*break*/, 11];
            case 10:
                loading.value = false;
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); };
var processForChat = function () { return __awaiter(void 0, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!sharedText.value) return [3 /*break*/, 2];
                return [4 /*yield*/, chatStore.processUserQuery(sharedText.value)];
            case 1:
                _a.sent();
                successMessage.value = 'Content shared to AI Assistant';
                _a.label = 2;
            case 2:
                if (!sharedUrl.value) return [3 /*break*/, 4];
                return [4 /*yield*/, chatStore.processUserQuery("Check this URL: ".concat(sharedUrl.value))];
            case 3:
                _a.sent();
                successMessage.value = 'URL shared to AI Assistant';
                _a.label = 4;
            case 4:
                if (!(sharedFiles.value.length > 0)) return [3 /*break*/, 7];
                file = sharedFiles.value[0];
                if (!file.type.startsWith('image/')) return [3 /*break*/, 6];
                return [4 /*yield*/, chatStore.processImageForPartLookup(file)];
            case 5:
                _a.sent();
                successMessage.value = 'Image shared to AI Assistant for analysis';
                return [3 /*break*/, 7];
            case 6: throw new Error('Only images can be shared to the AI Assistant');
            case 7: return [2 /*return*/];
        }
    });
}); };
var processForIntegration = function () { return __awaiter(void 0, void 0, void 0, function () {
    var file, connections, csvConnection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(sharedFiles.value.length > 0)) return [3 /*break*/, 5];
                file = sharedFiles.value[0];
                if (!(file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) return [3 /*break*/, 3];
                return [4 /*yield*/, integration_service_1.integrationService.fetchConnections()];
            case 1:
                connections = _a.sent();
                csvConnection = connections.find(function (c) { return c.type === 'csv-upload'; });
                if (!csvConnection) {
                    throw new Error('No CSV upload connection found');
                }
                return [4 /*yield*/, integration_service_1.integrationService.processFileUpload(file, csvConnection.id, 'job-data')];
            case 2:
                _a.sent();
                successMessage.value = 'File shared to Data Integration';
                return [3 /*break*/, 4];
            case 3: throw new Error('Only CSV or Excel files can be shared to Data Integration');
            case 4: return [3 /*break*/, 6];
            case 5: throw new Error('No file shared');
            case 6: return [2 /*return*/];
        }
    });
}); };
var processForJob = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!selectedJobId.value) {
            throw new Error('No job selected');
        }
        // In a real implementation, this would attach the shared content to the job
        // For now, we'll just simulate success
        if (sharedFiles.value.length > 0) {
            successMessage.value = "File attached to job ".concat(selectedJobId.value);
        }
        else if (sharedText.value || sharedUrl.value) {
            successMessage.value = "Note added to job ".concat(selectedJobId.value);
        }
        else {
            throw new Error('No content to attach to job');
        }
        return [2 /*return*/];
    });
}); };
var goToDestination = function () {
    switch (destination.value) {
        case 'chat':
            router.push('/chat');
            break;
        case 'integration':
            router.push('/integration');
            break;
        case 'job':
            router.push("/jobs?id=".concat(selectedJobId.value));
            break;
        default:
            router.push('/dashboard');
    }
};
var goBack = function () {
    router.push('/dashboard');
};
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var parseShareTarget = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, params, formData, files, err_2, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, 7, 8]);
                url = new URL(window.location.href);
                params = new URLSearchParams(url.search);
                // Get shared text, URL, and title from query parameters
                sharedText.value = params.get('text') || '';
                sharedUrl.value = params.get('url') || '';
                sharedTitle.value = params.get('title') || '';
                if (!(window.location.pathname === '/share-target' && window.location.method === 'POST')) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, new Promise(function (resolve) {
                        // Wait for the form data to be available
                        var interval = setInterval(function () {
                            var form = document.querySelector('form');
                            if (form) {
                                clearInterval(interval);
                                resolve(new FormData(form));
                            }
                        }, 100);
                    })];
            case 2:
                formData = _a.sent();
                files = formData.getAll('file');
                sharedFiles.value = files.filter(function (file) { return file instanceof File; });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error('Error parsing form data:', err_2);
                return [3 /*break*/, 4];
            case 4: 
            // Fetch jobs for job selection
            return [4 /*yield*/, jobsStore.fetchJobs()];
            case 5:
                // Fetch jobs for job selection
                _a.sent();
                return [3 /*break*/, 8];
            case 6:
                err_3 = _a.sent();
                console.error('Error parsing share target:', err_3);
                error.value = 'Failed to process shared content';
                return [3 /*break*/, 8];
            case 7:
                loading.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () {
    parseShareTarget();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-container" }));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-loading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "animate-spin h-10 w-10 text-primary-600" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(__assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(__assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-error" }));
    var __VLS_0 = {}.ExclamationCircleIcon;
    /** @type {[typeof __VLS_components.ExclamationCircleIcon, ]} */ ;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-12 h-12 text-red-500" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-12 h-12 text-red-500" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goBack) }, { class: "share-target-button" }));
}
else if (__VLS_ctx.success) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-success" }));
    var __VLS_4 = {}.CheckCircleIcon;
    /** @type {[typeof __VLS_components.CheckCircleIcon, ]} */ ;
    // @ts-ignore
    var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign({ class: "w-12 h-12 text-green-500" })));
    var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign({ class: "w-12 h-12 text-green-500" })], __VLS_functionalComponentArgsRest(__VLS_5), false));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.successMessage);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goToDestination) }, { class: "share-target-button share-target-button-primary" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goBack) }, { class: "share-target-button" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-content" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    if (__VLS_ctx.sharedText) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-text" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedText);
    }
    if (__VLS_ctx.sharedUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-url" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedUrl);
    }
    if (__VLS_ctx.sharedTitle) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-title" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.sharedTitle);
    }
    if (__VLS_ctx.sharedFiles.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-files" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
        for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.sharedFiles)); _i < _a.length; _i++) {
            var _b = _a[_i], file = _b[0], index = _b[1];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (index),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-file" }));
            var __VLS_8 = {}.DocumentIcon;
            /** @type {[typeof __VLS_components.DocumentIcon, ]} */ ;
            // @ts-ignore
            var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ class: "w-5 h-5 text-primary-600" })));
            var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ class: "w-5 h-5 text-primary-600" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-file-info" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "share-target-file-name" }));
            (file.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "share-target-file-size" }));
            (__VLS_ctx.formatFileSize(file.size));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-destination" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ value: (__VLS_ctx.destination) }, { class: "share-target-select" }));
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
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-job-select" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "share-target-label" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ value: (__VLS_ctx.selectedJobId) }, { class: "share-target-select" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "",
        });
        for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.jobs)); _c < _d.length; _c++) {
            var job = _d[_c][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (job.id),
                value: (job.id),
            });
            (job.jobNumber);
            (job.partName);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "share-target-actions" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.processShare) }, { class: "share-target-button share-target-button-primary" }), { disabled: (!__VLS_ctx.canProcess) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goBack) }, { class: "share-target-button" }));
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
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            DocumentIcon: outline_1.DocumentIcon,
            ExclamationCircleIcon: outline_1.ExclamationCircleIcon,
            CheckCircleIcon: outline_1.CheckCircleIcon,
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
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
