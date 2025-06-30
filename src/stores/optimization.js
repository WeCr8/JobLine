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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptimizationStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
exports.useOptimizationStore = (0, pinia_1.defineStore)('optimization', function () {
    var partSimilarities = (0, vue_1.ref)([]);
    var setupOptimizations = (0, vue_1.ref)([]);
    var productionTrends = (0, vue_1.ref)([]);
    var voiceNotes = (0, vue_1.ref)([]);
    var mediaUploads = (0, vue_1.ref)([]);
    var qualityInsights = (0, vue_1.ref)([]);
    var engineeringAlerts = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    // Mock data for demonstration
    var mockPartSimilarities = [
        {
            id: '1',
            partNumber: 'PN-12345',
            partName: 'Hydraulic Cylinder Housing',
            material: 'Aluminum 6061',
            dimensions: { length: 150, width: 100, height: 75 },
            machineType: 'CNC Mill',
            fixtureType: 'Vise',
            setupTime: 45,
            cycleTime: 25,
            tooling: ['1/2" End Mill', '1/4" Drill', 'M6 Tap'],
            operations: ['Face', 'Bore', 'Tap'],
            similarityScore: 0.95,
            groupId: 'group-1'
        },
        {
            id: '2',
            partNumber: 'PN-67890',
            partName: 'Cylinder Housing Variant',
            material: 'Aluminum 6061',
            dimensions: { length: 155, width: 105, height: 80 },
            machineType: 'CNC Mill',
            fixtureType: 'Vise',
            setupTime: 50,
            cycleTime: 28,
            tooling: ['1/2" End Mill', '1/4" Drill', 'M6 Tap'],
            operations: ['Face', 'Bore', 'Tap'],
            similarityScore: 0.92,
            groupId: 'group-1'
        }
    ];
    var mockSetupOptimizations = [
        {
            id: '1',
            jobId: '1',
            currentSetupTime: 45,
            optimizedSetupTime: 25,
            timeSavings: 20,
            confidence: 0.85,
            implementationDifficulty: 'medium',
            estimatedROI: 2500,
            suggestions: [
                {
                    type: 'fixture',
                    title: 'Use Dedicated Fixture',
                    description: 'Create a dedicated fixture for this part family to eliminate individual part alignment',
                    impact: 'high',
                    timeSavings: 15,
                    costSavings: 1800,
                    implementation: 'Design and manufacture custom fixture',
                    relatedParts: ['PN-12345', 'PN-67890']
                },
                {
                    type: 'tooling',
                    title: 'Pre-set Tool Package',
                    description: 'Create a pre-set tool package for this operation sequence',
                    impact: 'medium',
                    timeSavings: 5,
                    costSavings: 700,
                    implementation: 'Organize tools in preset holder'
                }
            ],
            createdAt: '2024-01-12T10:00:00Z'
        }
    ];
    var mockProductionTrends = [
        {
            id: '1',
            metric: 'efficiency',
            period: 'daily',
            data: [
                { date: '2024-01-08', value: 82, target: 85, variance: -3 },
                { date: '2024-01-09', value: 84, target: 85, variance: -1 },
                { date: '2024-01-10', value: 87, target: 85, variance: 2 },
                { date: '2024-01-11', value: 89, target: 85, variance: 4 },
                { date: '2024-01-12', value: 91, target: 85, variance: 6 }
            ],
            trend: 'improving',
            changePercent: 10.9,
            insights: [
                'Efficiency has improved 11% over the past week',
                'New fixture implementation showing positive results',
                'Operator training program contributing to gains'
            ]
        }
    ];
    var mockQualityInsights = [
        {
            id: '1',
            partNumber: 'PN-12345',
            issueType: 'Dimensional Variance',
            frequency: 3,
            impact: 'medium',
            rootCause: 'Tool wear on operation 3',
            recommendations: [
                'Implement tool wear monitoring',
                'Reduce feed rate on final pass',
                'Add mid-process inspection'
            ],
            trend: 'decreasing',
            relatedJobs: ['J2024-001', 'J2024-003']
        }
    ];
    var mockEngineeringAlerts = [
        {
            id: '1',
            type: 'process-improvement',
            priority: 'medium',
            title: 'Setup Time Optimization Opportunity',
            description: 'AI analysis suggests 44% setup time reduction possible for part family PF-001',
            affectedParts: ['PN-12345', 'PN-67890'],
            status: 'open',
            dueDate: '2024-01-20',
            attachments: [],
            createdAt: '2024-01-12T09:00:00Z',
            updatedAt: '2024-01-12T09:00:00Z'
        }
    ];
    var fetchPartSimilarities = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 1:
                    _a.sent();
                    partSimilarities.value = mockPartSimilarities;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchSetupOptimizations = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 1:
                    _a.sent();
                    setupOptimizations.value = mockSetupOptimizations;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchProductionTrends = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 400); })];
                case 1:
                    _a.sent();
                    productionTrends.value = mockProductionTrends;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchQualityInsights = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent();
                    qualityInsights.value = mockQualityInsights;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchEngineeringAlerts = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 1:
                    _a.sent();
                    engineeringAlerts.value = mockEngineeringAlerts;
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); };
    var analyzePartSimilarity = function (partNumber) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simulate AI analysis
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 1:
                    // Simulate AI analysis
                    _a.sent();
                    return [2 /*return*/, partSimilarities.value.filter(function (p) { return p.partNumber !== partNumber; })];
            }
        });
    }); };
    var generateSetupOptimization = function (jobId) { return __awaiter(void 0, void 0, void 0, function () {
        var optimization;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simulate AI optimization analysis
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 1:
                    // Simulate AI optimization analysis
                    _a.sent();
                    optimization = {
                        id: Date.now().toString(),
                        jobId: jobId,
                        currentSetupTime: 60,
                        optimizedSetupTime: 35,
                        timeSavings: 25,
                        confidence: 0.78,
                        implementationDifficulty: 'medium',
                        estimatedROI: 3200,
                        suggestions: [
                            {
                                type: 'batching',
                                title: 'Batch Similar Parts',
                                description: 'Group similar parts together to minimize setup changes',
                                impact: 'high',
                                timeSavings: 20,
                                costSavings: 2400,
                                implementation: 'Schedule similar parts consecutively'
                            }
                        ],
                        createdAt: new Date().toISOString()
                    };
                    setupOptimizations.value.unshift(optimization);
                    return [2 /*return*/, optimization];
            }
        });
    }); };
    var addVoiceNote = function (note) { return __awaiter(void 0, void 0, void 0, function () {
        var newNote;
        return __generator(this, function (_a) {
            newNote = __assign(__assign({}, note), { id: Date.now().toString(), createdAt: new Date().toISOString() });
            voiceNotes.value.unshift(newNote);
            return [2 /*return*/];
        });
    }); };
    var addMediaUpload = function (upload) { return __awaiter(void 0, void 0, void 0, function () {
        var newUpload;
        return __generator(this, function (_a) {
            newUpload = __assign(__assign({}, upload), { id: Date.now().toString(), createdAt: new Date().toISOString() });
            mediaUploads.value.unshift(newUpload);
            return [2 /*return*/];
        });
    }); };
    var transcribeAudio = function (audioBlob) { return __awaiter(void 0, void 0, void 0, function () {
        var mockTranscriptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simulate speech-to-text API call
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 1:
                    // Simulate speech-to-text API call
                    _a.sent();
                    mockTranscriptions = [
                        "Job 2024-001 is running smoothly, completed 15 parts so far",
                        "Quality issue detected on part number PN-12345, dimension out of tolerance",
                        "Machine CNC-001 making unusual noise during spindle operation",
                        "Setup complete for job 2024-002, ready to start production",
                        "Tool change required on station 3, current tool showing wear"
                    ];
                    return [2 /*return*/, mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]];
            }
        });
    }); };
    // Computed properties
    var partFamilies = (0, vue_1.computed)(function () {
        var families = {};
        partSimilarities.value.forEach(function (part) {
            var groupId = part.groupId || 'ungrouped';
            if (!families[groupId])
                families[groupId] = [];
            families[groupId].push(part);
        });
        return families;
    });
    var totalTimeSavings = (0, vue_1.computed)(function () {
        return setupOptimizations.value.reduce(function (total, opt) { return total + opt.timeSavings; }, 0);
    });
    var totalCostSavings = (0, vue_1.computed)(function () {
        return setupOptimizations.value.reduce(function (total, opt) { return total + opt.estimatedROI; }, 0);
    });
    var criticalQualityIssues = (0, vue_1.computed)(function () {
        return qualityInsights.value.filter(function (insight) { return insight.impact === 'high'; });
    });
    var openEngineeringAlerts = (0, vue_1.computed)(function () {
        return engineeringAlerts.value.filter(function (alert) { return alert.status === 'open'; });
    });
    return {
        partSimilarities: partSimilarities,
        setupOptimizations: setupOptimizations,
        productionTrends: productionTrends,
        voiceNotes: voiceNotes,
        mediaUploads: mediaUploads,
        qualityInsights: qualityInsights,
        engineeringAlerts: engineeringAlerts,
        loading: loading,
        partFamilies: partFamilies,
        totalTimeSavings: totalTimeSavings,
        totalCostSavings: totalCostSavings,
        criticalQualityIssues: criticalQualityIssues,
        openEngineeringAlerts: openEngineeringAlerts,
        fetchPartSimilarities: fetchPartSimilarities,
        fetchSetupOptimizations: fetchSetupOptimizations,
        fetchProductionTrends: fetchProductionTrends,
        fetchQualityInsights: fetchQualityInsights,
        fetchEngineeringAlerts: fetchEngineeringAlerts,
        analyzePartSimilarity: analyzePartSimilarity,
        generateSetupOptimization: generateSetupOptimization,
        addVoiceNote: addVoiceNote,
        addMediaUpload: addMediaUpload,
        transcribeAudio: transcribeAudio
    };
});
