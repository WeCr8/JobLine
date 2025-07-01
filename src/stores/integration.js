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
exports.useIntegrationStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var integration_service_1 = require("../services/integration.service");
exports.useIntegrationStore = (0, pinia_1.defineStore)('integration', function () {
    var connections = (0, vue_1.ref)([]);
    var importJobs = (0, vue_1.ref)([]);
    var complianceChecks = (0, vue_1.ref)([]);
    var exportFlags = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var fetchConnections = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedConnections, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.fetchConnections()];
                case 2:
                    fetchedConnections = _a.sent();
                    connections.value = fetchedConnections;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    console.error('Error fetching connections:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchImportJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedJobs, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.fetchImportJobs()];
                case 2:
                    fetchedJobs = _a.sent();
                    importJobs.value = fetchedJobs;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    error.value = err_2.message;
                    console.error('Error fetching import jobs:', err_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchExportFlags = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedFlags, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.fetchExportFlags()];
                case 2:
                    fetchedFlags = _a.sent();
                    exportFlags.value = fetchedFlags;
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    console.error('Error fetching export flags:', err_3);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var createConnection = function (connection) { return __awaiter(void 0, void 0, void 0, function () {
        var newConnection, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.createConnection(connection)];
                case 2:
                    newConnection = _a.sent();
                    connections.value.unshift(newConnection);
                    return [2 /*return*/, newConnection];
                case 3:
                    err_4 = _a.sent();
                    error.value = err_4.message;
                    console.error('Error creating connection:', err_4);
                    throw err_4;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateConnection = function (connection) { return __awaiter(void 0, void 0, void 0, function () {
        var success, index, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.updateConnection(connection)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        index = connections.value.findIndex(function (c) { return c.id === connection.id; });
                        if (index !== -1) {
                            connections.value[index] = __assign({}, connection);
                        }
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_5 = _a.sent();
                    error.value = err_5.message;
                    console.error('Error updating connection:', err_5);
                    throw err_5;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var deleteConnection = function (connectionId) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.deleteConnection(connectionId)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        connections.value = connections.value.filter(function (c) { return c.id !== connectionId; });
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_6 = _a.sent();
                    error.value = err_6.message;
                    console.error('Error deleting connection:', err_6);
                    throw err_6;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var testConnection = function (connectionId) { return __awaiter(void 0, void 0, void 0, function () {
        var success, index, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.testConnection(connectionId)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        index = connections.value.findIndex(function (c) { return c.id === connectionId; });
                        if (index !== -1) {
                            connections.value[index].status = 'active';
                            connections.value[index].lastSync = new Date().toISOString();
                        }
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_7 = _a.sent();
                    error.value = err_7.message;
                    console.error('Error testing connection:', err_7);
                    throw err_7;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var runImport = function (connectionId, importType) { return __awaiter(void 0, void 0, void 0, function () {
        var importJob, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.runImport(connectionId, importType)];
                case 2:
                    importJob = _a.sent();
                    importJobs.value.unshift(importJob);
                    return [2 /*return*/, importJob];
                case 3:
                    err_8 = _a.sent();
                    error.value = err_8.message;
                    console.error('Error running import:', err_8);
                    throw err_8;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var checkCompliance = function (jobId, userId, action) { return __awaiter(void 0, void 0, void 0, function () {
        var check, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, integration_service_1.integrationService.checkCompliance(jobId, userId, action)];
                case 2:
                    check = _a.sent();
                    complianceChecks.value.unshift(check);
                    return [2 /*return*/, check];
                case 3:
                    err_9 = _a.sent();
                    error.value = err_9.message;
                    console.error('Error checking compliance:', err_9);
                    throw err_9;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var scheduleAutomaticSync = function (connectionId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, integration_service_1.integrationService.scheduleAutomaticSync(connectionId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_10 = _a.sent();
                    console.error('Error scheduling automatic sync:', err_10);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var optimizeJobSchedule = function (departmentId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, integration_service_1.integrationService.optimizeJobSchedule(departmentId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_11 = _a.sent();
                    console.error('Error optimizing job schedule:', err_11);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Computed properties
    var activeConnections = (0, vue_1.computed)(function () {
        return connections.value.filter(function (c) { return c.status === 'active'; });
    });
    var connectionsByType = (0, vue_1.computed)(function () {
        var types = {
            'google-sheets': 0,
            'csv-upload': 0,
            'rest-api': 0,
            'sql-odbc': 0,
            'sap-bapi': 0,
            'webhook': 0,
            'sftp': 0
        };
        connections.value.forEach(function (conn) {
            types[conn.type]++;
        });
        return types;
    });
    var recentImports = (0, vue_1.computed)(function () {
        return importJobs.value.slice(0, 10).sort(function (a, b) {
            return new Date(b.startedAt || '').getTime() - new Date(a.startedAt || '').getTime();
        });
    });
    var complianceAlerts = (0, vue_1.computed)(function () {
        return complianceChecks.value.filter(function (c) { return c.result === 'denied'; }).slice(0, 5);
    });
    return {
        connections: connections,
        importJobs: importJobs,
        complianceChecks: complianceChecks,
        exportFlags: exportFlags,
        loading: loading,
        error: error,
        activeConnections: activeConnections,
        connectionsByType: connectionsByType,
        recentImports: recentImports,
        complianceAlerts: complianceAlerts,
        fetchConnections: fetchConnections,
        fetchImportJobs: fetchImportJobs,
        fetchExportFlags: fetchExportFlags,
        createConnection: createConnection,
        updateConnection: updateConnection,
        deleteConnection: deleteConnection,
        testConnection: testConnection,
        runImport: runImport,
        checkCompliance: checkCompliance,
        scheduleAutomaticSync: scheduleAutomaticSync,
        optimizeJobSchedule: optimizeJobSchedule
    };
});
