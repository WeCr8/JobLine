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
exports.useChatStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var jobs_1 = require("./jobs");
exports.useChatStore = (0, pinia_1.defineStore)('chat', function () {
    var messages = (0, vue_1.ref)([]);
    var isTyping = (0, vue_1.ref)(false);
    var isListening = (0, vue_1.ref)(false);
    var isProcessingVoice = (0, vue_1.ref)(false);
    var isProcessingImage = (0, vue_1.ref)(false);
    var integrations = (0, vue_1.ref)([]);
    var voiceEnabled = (0, vue_1.ref)(false);
    var mediaRecorder = null;
    var audioChunks = [];
    var recognition = null;
    // Initialize speech recognition
    var initSpeechRecognition = function () {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onresult = function (event) {
                var finalTranscript = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    processUserQuery(finalTranscript, 'voice');
                }
            };
            recognition.onerror = function (event) {
                console.error('Speech recognition error:', event.error);
                isListening.value = false;
            };
            recognition.onend = function () {
                isListening.value = false;
            };
            voiceEnabled.value = true;
        }
    };
    var addMessage = function (content, isUser, type, metadata) {
        if (type === void 0) { type = 'text'; }
        var message = __assign({ id: Date.now().toString(), content: content, isUser: isUser, timestamp: new Date().toISOString(), type: type }, metadata);
        messages.value.push(message);
        // Send to integrations if it's a system message
        if (!isUser && shouldTriggerIntegration(message)) {
            sendToIntegrations(message);
        }
    };
    var processUserQuery = function (query_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, inputType) {
            var response;
            if (inputType === void 0) { inputType = 'text'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addMessage(query, true, inputType);
                        isTyping.value = true;
                        // Simulate AI processing delay
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                    case 1:
                        // Simulate AI processing delay
                        _a.sent();
                        response = generateAIResponse(query);
                        addMessage(response.content, false, 'text', { jobReferences: response.jobReferences });
                        isTyping.value = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    var startVoiceRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
        var stream_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!voiceEnabled.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 2:
                    stream_1 = _a.sent();
                    mediaRecorder = new MediaRecorder(stream_1);
                    audioChunks = [];
                    mediaRecorder.ondataavailable = function (event) {
                        audioChunks.push(event.data);
                    };
                    mediaRecorder.onstop = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var audioBlob;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                                    return [4 /*yield*/, processVoiceMessage(audioBlob)];
                                case 1:
                                    _a.sent();
                                    stream_1.getTracks().forEach(function (track) { return track.stop(); });
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    mediaRecorder.start();
                    isProcessingVoice.value = true;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error starting voice recording:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var stopVoiceRecording = function () {
        if (mediaRecorder && isProcessingVoice.value) {
            mediaRecorder.stop();
            isProcessingVoice.value = false;
        }
    };
    var startVoiceListening = function () {
        if (recognition && voiceEnabled.value) {
            isListening.value = true;
            recognition.start();
        }
    };
    var stopVoiceListening = function () {
        if (recognition && isListening.value) {
            recognition.stop();
            isListening.value = false;
        }
    };
    var processVoiceMessage = function (audioBlob) { return __awaiter(void 0, void 0, void 0, function () {
        var mockTranscriptions, transcription, audioUrl, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isProcessingVoice.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    // Simulate speech-to-text processing
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 2:
                    // Simulate speech-to-text processing
                    _a.sent();
                    mockTranscriptions = [
                        "What's the status of job 2024-001?",
                        "Show me all urgent jobs",
                        "Which machines are currently running?",
                        "Any quality issues today?",
                        "When is the next delivery due?"
                    ];
                    transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
                    audioUrl = URL.createObjectURL(audioBlob);
                    addMessage(transcription, true, 'voice', {
                        audioUrl: audioUrl,
                        voiceTranscription: transcription,
                        confidence: 0.85 + Math.random() * 0.15
                    });
                    // Process the transcribed query
                    return [4 /*yield*/, processUserQuery(transcription, 'voice')];
                case 3:
                    // Process the transcribed query
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error processing voice message:', error_2);
                    return [3 /*break*/, 6];
                case 5:
                    isProcessingVoice.value = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var processImageForPartLookup = function (imageFile) { return __awaiter(void 0, void 0, void 0, function () {
        var mockMatches, imageUrl, analysisText, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isProcessingImage.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Simulate image processing delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 2:
                    // Simulate image processing delay
                    _a.sent();
                    mockMatches = [
                        {
                            partNumber: 'PN-12345',
                            partName: 'Hydraulic Cylinder Housing',
                            similarity: 0.94,
                            imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                            currentJobs: ['J2024-001'],
                            lastUsed: '2024-01-12',
                            material: 'Aluminum 6061',
                            dimensions: { length: 150, width: 100, height: 75 }
                        },
                        {
                            partNumber: 'PN-67890',
                            partName: 'Cylinder Housing Variant',
                            similarity: 0.87,
                            imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                            currentJobs: [],
                            lastUsed: '2024-01-08',
                            material: 'Aluminum 6061',
                            dimensions: { length: 155, width: 105, height: 80 }
                        },
                        {
                            partNumber: 'PN-11111',
                            partName: 'Similar Housing Design',
                            similarity: 0.76,
                            imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                            currentJobs: ['J2024-003'],
                            lastUsed: '2024-01-10',
                            material: 'Steel 4140',
                            dimensions: { length: 145, width: 95, height: 70 }
                        }
                    ];
                    imageUrl = URL.createObjectURL(imageFile);
                    analysisText = "Found ".concat(mockMatches.length, " similar parts with ").concat(Math.round(mockMatches[0].similarity * 100), "% confidence match.");
                    addMessage(analysisText, true, 'image', {
                        imageUrl: imageUrl,
                        partMatches: mockMatches
                    });
                    response = "I found ".concat(mockMatches.length, " similar parts in our system:\n\n") +
                        mockMatches.map(function (match) {
                            return "**".concat(match.partNumber, "** (").concat(Math.round(match.similarity * 100), "% match)\n") +
                                "\u2022 ".concat(match.partName, "\n") +
                                "\u2022 Material: ".concat(match.material, "\n") +
                                "\u2022 Current Jobs: ".concat(match.currentJobs.length > 0 ? match.currentJobs.join(', ') : 'None', "\n") +
                                "\u2022 Last Used: ".concat(match.lastUsed);
                        }).join('\n\n');
                    addMessage(response, false, 'part-lookup', { partMatches: mockMatches });
                    return [2 /*return*/, mockMatches];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error processing image:', error_3);
                    return [2 /*return*/, []];
                case 4:
                    isProcessingImage.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var generateAIResponse = function (query) {
        var jobsStore = (0, jobs_1.useJobsStore)();
        var lowerQuery = query.toLowerCase();
        // Enhanced responses with voice-friendly formatting
        if (lowerQuery.includes('status') || lowerQuery.includes('how is') || lowerQuery.includes('what\'s the status')) {
            if (lowerQuery.includes('j2024-001') || lowerQuery.includes('hydraulic')) {
                return {
                    content: "Job J2024-001, the Hydraulic Cylinder Housing, is currently running on CNC-001 with John Smith as the operator. We've completed 35 out of 50 parts, that's 70% complete. The job is on track for the January 15th due date with 28 hours logged against an estimated 40 hours.",
                    jobReferences: ['1']
                };
            }
            return {
                content: "Here's our current job status overview: We have ".concat(jobsStore.jobsByStatus.running, " jobs running, ").concat(jobsStore.jobsByStatus.setup, " in setup, ").concat(jobsStore.jobsByStatus['on-hold'], " on hold, ").concat(jobsStore.jobsByStatus.pending, " pending, and ").concat(jobsStore.jobsByStatus.completed, " completed jobs. Would you like details on any specific job?")
            };
        }
        // Voice-optimized responses for common queries
        if (lowerQuery.includes('machine') || lowerQuery.includes('cnc')) {
            return {
                content: "Current machine status: CNC-001 is running the Hydraulic Cylinder Housing with John Smith. CNC-002 is in setup for the Gear Assembly with Sarah Johnson. CNC-003 is available for the next job. All machines are operational with no maintenance issues reported."
            };
        }
        if (lowerQuery.includes('urgent') || lowerQuery.includes('priority')) {
            return {
                content: "We have one urgent job currently on hold: Job J2024-004, the Valve Body for Fluid Dynamics Company. It's experiencing a material quality issue and we're waiting for replacement material. The job was 27% complete before being put on hold."
            };
        }
        // Default response
        return {
            content: "I understand you're asking about shop operations. I can help with job status, machine assignments, due dates, operator schedules, or any other manufacturing questions. You can ask me using voice or text, and even show me photos of parts for identification."
        };
    };
    var shouldTriggerIntegration = function (message) {
        // Check if message contains urgent keywords or job references
        var urgentKeywords = ['urgent', 'critical', 'down', 'issue', 'problem', 'alert'];
        return urgentKeywords.some(function (keyword) { return message.content.toLowerCase().includes(keyword); });
    };
    var sendToIntegrations = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var activeIntegrations, _i, activeIntegrations_1, integration, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeIntegrations = integrations.value.filter(function (i) { return i.enabled; });
                    _i = 0, activeIntegrations_1 = activeIntegrations;
                    _a.label = 1;
                case 1:
                    if (!(_i < activeIntegrations_1.length)) return [3 /*break*/, 6];
                    integration = activeIntegrations_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, sendToIntegration(integration, message)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Failed to send to ".concat(integration.name, ":"), error_4);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var sendToIntegration = function (integration, message) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, _a, teamsPayload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = {
                        text: "\uD83C\uDFED JobLine.ai Alert: ".concat(message.content),
                        timestamp: message.timestamp,
                        source: 'JobLine.ai Chat Assistant'
                    };
                    _a = integration.type;
                    switch (_a) {
                        case 'slack': return [3 /*break*/, 1];
                        case 'teams': return [3 /*break*/, 4];
                        case 'webhook': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 10];
                case 1:
                    if (!integration.config.webhookUrl) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(integration.config.webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 10];
                case 4:
                    if (!integration.config.webhookUrl) return [3 /*break*/, 6];
                    teamsPayload = {
                        "@type": "MessageCard",
                        "@context": "http://schema.org/extensions",
                        "summary": "JobLine.ai Alert",
                        "themeColor": "0076D7",
                        "sections": [{
                                "activityTitle": "JobLine.ai Manufacturing Alert",
                                "activitySubtitle": new Date(message.timestamp).toLocaleString(),
                                "text": message.content
                            }]
                    };
                    return [4 /*yield*/, fetch(integration.config.webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(teamsPayload)
                        })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 10];
                case 7:
                    if (!integration.config.webhookUrl) return [3 /*break*/, 9];
                    return [4 /*yield*/, fetch(integration.config.webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var addIntegration = function (integration) { return __awaiter(void 0, void 0, void 0, function () {
        var newIntegration;
        return __generator(this, function (_a) {
            newIntegration = __assign(__assign({}, integration), { id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            integrations.value.push(newIntegration);
            return [2 /*return*/];
        });
    }); };
    var testIntegration = function (integrationId) { return __awaiter(void 0, void 0, void 0, function () {
        var integration, testMessage, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    integration = integrations.value.find(function (i) { return i.id === integrationId; });
                    if (!integration)
                        return [2 /*return*/, false];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    testMessage = {
                        id: 'test',
                        content: 'Test message from JobLine.ai - Integration is working correctly!',
                        isUser: false,
                        timestamp: new Date().toISOString(),
                        type: 'text'
                    };
                    return [4 /*yield*/, sendToIntegration(integration, testMessage)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_5 = _a.sent();
                    console.error('Integration test failed:', error_5);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var clearChat = function () {
        messages.value = [];
    };
    // Initialize speech recognition on store creation
    initSpeechRecognition();
    return {
        messages: messages,
        isTyping: isTyping,
        isListening: isListening,
        isProcessingVoice: isProcessingVoice,
        isProcessingImage: isProcessingImage,
        integrations: integrations,
        voiceEnabled: voiceEnabled,
        addMessage: addMessage,
        processUserQuery: processUserQuery,
        startVoiceRecording: startVoiceRecording,
        stopVoiceRecording: stopVoiceRecording,
        startVoiceListening: startVoiceListening,
        stopVoiceListening: stopVoiceListening,
        processImageForPartLookup: processImageForPartLookup,
        addIntegration: addIntegration,
        testIntegration: testIntegration,
        clearChat: clearChat
    };
});
