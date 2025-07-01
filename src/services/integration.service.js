"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.integrationService = void 0;
var api_service_1 = require("./api.service");
var axios_1 = require("axios");
var offline_1 = require("../utils/offline");
exports.integrationService = {
    /**
     * Fetch all connections
     */
    fetchConnections: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_1, cachedConnections;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .select('*')
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (conn) { return ({
                                id: conn.id,
                                name: conn.name,
                                type: conn.connection_type,
                                status: conn.status,
                                config: conn.config || {},
                                complianceLevel: conn.compliance_level,
                                lastSync: conn.last_sync,
                                errorCount: conn.error_count || 0,
                                mapping: [],
                                createdAt: conn.created_at,
                                updatedAt: conn.updated_at
                            }); })];
                    case 2:
                        err_1 = _b.sent();
                        console.error('Error fetching connections:', err_1);
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'connections')];
                    case 3:
                        cachedConnections = _b.sent();
                        return [2 /*return*/, cachedConnections || []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch import jobs
     */
    fetchImportJobs: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_2, cachedJobs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .select('*')
                                .order('created_at', { ascending: false })
                                .limit(10)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (job) { return ({
                                id: job.id,
                                connectionId: job.connection_id,
                                type: job.import_type,
                                status: job.status,
                                mapping: job.mapping || [],
                                recordsProcessed: job.records_processed || 0,
                                recordsSuccess: job.records_success || 0,
                                recordsError: job.records_error || 0,
                                errors: job.errors || [],
                                startedAt: job.started_at,
                                completedAt: job.completed_at
                            }); })];
                    case 2:
                        err_2 = _b.sent();
                        console.error('Error fetching import jobs:', err_2);
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'importJobs')];
                    case 3:
                        cachedJobs = _b.sent();
                        return [2 /*return*/, cachedJobs || []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Create a new connection
     */
    createConnection: function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data_1, error, mappingError, newConnection, connections, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .insert({
                                name: connection.name,
                                connection_type: connection.type,
                                status: connection.status,
                                config: connection.config,
                                compliance_level: connection.complianceLevel,
                                error_count: 0
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data_1 = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data_1)
                            throw new Error('Failed to create connection');
                        if (!(connection.mapping && connection.mapping.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_mappings')
                                .insert(connection.mapping.map(function (mapping) { return ({
                                connection_id: data_1.id,
                                source_field: mapping.sourceField,
                                target_field: mapping.targetField,
                                required: mapping.required,
                                compliance_flag: mapping.complianceFlag
                            }); }))];
                    case 2:
                        mappingError = (_b.sent()).error;
                        if (mappingError) {
                            console.error('Error creating mapping:', mappingError);
                        }
                        _b.label = 3;
                    case 3:
                        newConnection = {
                            id: data_1.id,
                            name: data_1.name,
                            type: data_1.connection_type,
                            status: data_1.status,
                            config: data_1.config,
                            complianceLevel: data_1.compliance_level,
                            lastSync: data_1.last_sync,
                            errorCount: data_1.error_count || 0,
                            mapping: connection.mapping || [],
                            createdAt: data_1.created_at,
                            updatedAt: data_1.updated_at
                        };
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'connections')];
                    case 4:
                        connections = (_b.sent()) || [];
                        connections.unshift(newConnection);
                        return [4 /*yield*/, (0, offline_1.storeOfflineData)('integration', 'connections', connections)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, newConnection];
                    case 6:
                        err_3 = _b.sent();
                        console.error('Error creating connection:', err_3);
                        throw err_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update an existing connection
     */
    updateConnection: function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var error, deleteError, mappingError, connections, index, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .update({
                                name: connection.name,
                                connection_type: connection.type,
                                status: connection.status,
                                config: connection.config,
                                compliance_level: connection.complianceLevel,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', connection.id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        if (!(connection.mapping && connection.mapping.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_mappings')
                                .delete()
                                .eq('connection_id', connection.id)];
                    case 2:
                        deleteError = (_a.sent()).error;
                        if (deleteError) {
                            console.error('Error deleting existing mappings:', deleteError);
                        }
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_mappings')
                                .insert(connection.mapping.map(function (mapping) { return ({
                                connection_id: connection.id,
                                source_field: mapping.sourceField,
                                target_field: mapping.targetField,
                                required: mapping.required,
                                compliance_flag: mapping.complianceFlag
                            }); }))];
                    case 3:
                        mappingError = (_a.sent()).error;
                        if (mappingError) {
                            console.error('Error updating mapping:', mappingError);
                        }
                        _a.label = 4;
                    case 4: return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'connections')];
                    case 5:
                        connections = (_a.sent()) || [];
                        index = connections.findIndex(function (c) { return c.id === connection.id; });
                        if (!(index !== -1)) return [3 /*break*/, 7];
                        connections[index] = connection;
                        return [4 /*yield*/, (0, offline_1.storeOfflineData)('integration', 'connections', connections)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, true];
                    case 8:
                        err_4 = _a.sent();
                        console.error('Error updating connection:', err_4);
                        throw err_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Delete a connection
     */
    deleteConnection: function (connectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, connections, updatedConnections, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .delete()
                                .eq('id', connectionId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'connections')];
                    case 2:
                        connections = (_a.sent()) || [];
                        updatedConnections = connections.filter(function (c) { return c.id !== connectionId; });
                        return [4 /*yield*/, (0, offline_1.storeOfflineData)('integration', 'connections', updatedConnections)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        err_5 = _a.sent();
                        console.error('Error deleting connection:', err_5);
                        throw err_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Test a connection
     */
    testConnection: function (connectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, connection, connError, success, _b, err_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 20, , 22]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .select('*')
                                .eq('id', connectionId)
                                .single()];
                    case 1:
                        _a = _c.sent(), connection = _a.data, connError = _a.error;
                        if (connError)
                            throw connError;
                        success = false;
                        _b = connection.connection_type;
                        switch (_b) {
                            case 'rest-api': return [3 /*break*/, 2];
                            case 'google-sheets': return [3 /*break*/, 4];
                            case 'sql-odbc': return [3 /*break*/, 6];
                            case 'sap-bapi': return [3 /*break*/, 8];
                            case 'sftp': return [3 /*break*/, 10];
                            case 'webhook': return [3 /*break*/, 12];
                            case 'csv-upload': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 2: return [4 /*yield*/, this.testRestApiConnection(connection.config)];
                    case 3:
                        success = _c.sent();
                        return [3 /*break*/, 15];
                    case 4: return [4 /*yield*/, this.testGoogleSheetsConnection(connection.config)];
                    case 5:
                        success = _c.sent();
                        return [3 /*break*/, 15];
                    case 6: return [4 /*yield*/, this.testSqlConnection(connection.config)];
                    case 7:
                        success = _c.sent();
                        return [3 /*break*/, 15];
                    case 8: return [4 /*yield*/, this.testSapConnection(connection.config)];
                    case 9:
                        success = _c.sent();
                        return [3 /*break*/, 15];
                    case 10: return [4 /*yield*/, this.testSftpConnection(connection.config)];
                    case 11:
                        success = _c.sent();
                        return [3 /*break*/, 15];
                    case 12:
                        // Webhooks are passive, so we'll just assume success
                        success = true;
                        return [3 /*break*/, 15];
                    case 13:
                        // CSV uploads are manual, so we'll just assume success
                        success = true;
                        return [3 /*break*/, 15];
                    case 14: throw new Error("Unsupported connection type: ".concat(connection.connection_type));
                    case 15:
                        if (!success) return [3 /*break*/, 17];
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .update({
                                status: 'active',
                                last_sync: new Date().toISOString()
                            })
                                .eq('id', connectionId)];
                    case 16:
                        _c.sent();
                        return [3 /*break*/, 19];
                    case 17: return [4 /*yield*/, api_service_1.supabase
                            .from('connection_configs')
                            .update({
                            status: 'error',
                            error_count: connection.error_count + 1
                        })
                            .eq('id', connectionId)];
                    case 18:
                        _c.sent();
                        _c.label = 19;
                    case 19: return [2 /*return*/, success];
                    case 20:
                        err_6 = _c.sent();
                        console.error('Error testing connection:', err_6);
                        // Update connection status to error
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .update({
                                status: 'error',
                                error_count: api_service_1.supabase.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["error_count + 1"], ["error_count + 1"])))
                            })
                                .eq('id', connectionId)];
                    case 21:
                        // Update connection status to error
                        _c.sent();
                        throw err_6;
                    case 22: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Test REST API connection
     */
    testRestApiConnection: function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, apiKey, authType, headers, response, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        baseUrl = config.baseUrl, apiKey = config.apiKey, authType = config.authType;
                        if (!baseUrl) {
                            throw new Error('Base URL is required');
                        }
                        headers = {};
                        if (apiKey) {
                            switch (authType) {
                                case 'bearer':
                                    headers['Authorization'] = "Bearer ".concat(apiKey);
                                    break;
                                case 'basic':
                                    headers['Authorization'] = "Basic ".concat(btoa(apiKey));
                                    break;
                                default:
                                    headers['X-API-Key'] = apiKey;
                                    break;
                            }
                        }
                        return [4 /*yield*/, axios_1.default.get(baseUrl, { headers: headers })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.status >= 200 && response.status < 300];
                    case 2:
                        err_7 = _a.sent();
                        console.error('Error testing REST API connection:', err_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Test Google Sheets connection
     */
    testGoogleSheetsConnection: function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use the Google Sheets API
                // For now, we'll simulate success
                return [2 /*return*/, true];
            });
        });
    },
    /**
     * Test SQL connection
     */
    testSqlConnection: function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use a SQL client
                // For now, we'll simulate success
                return [2 /*return*/, true];
            });
        });
    },
    /**
     * Test SAP connection
     */
    testSapConnection: function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use SAP client libraries
                // For now, we'll simulate success
                return [2 /*return*/, true];
            });
        });
    },
    /**
     * Test SFTP connection
     */
    testSftpConnection: function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use an SFTP client
                // For now, we'll simulate success
                return [2 /*return*/, true];
            });
        });
    },
    /**
     * Run an import job
     */
    runImport: function (connectionId, importType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, _b, connection, connError, _c, mappings, mappingError, formattedMappings, importJob, err_8;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .insert({
                                connection_id: connectionId,
                                import_type: importType,
                                status: 'pending',
                                started_at: new Date().toISOString()
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _d.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data)
                            throw new Error('Failed to create import job');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .select('*')
                                .eq('id', connectionId)
                                .single()];
                    case 2:
                        _b = _d.sent(), connection = _b.data, connError = _b.error;
                        if (connError)
                            throw connError;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_mappings')
                                .select('*')
                                .eq('connection_id', connectionId)];
                    case 3:
                        _c = _d.sent(), mappings = _c.data, mappingError = _c.error;
                        if (mappingError) {
                            console.error('Error fetching mappings:', mappingError);
                        }
                        formattedMappings = (mappings || []).map(function (mapping) { return ({
                            sourceField: mapping.source_field,
                            targetField: mapping.target_field,
                            required: mapping.required,
                            complianceFlag: mapping.compliance_flag
                        }); });
                        importJob = {
                            id: data.id,
                            connectionId: data.connection_id,
                            type: data.import_type,
                            status: data.status,
                            mapping: formattedMappings,
                            recordsProcessed: 0,
                            recordsSuccess: 0,
                            recordsError: 0,
                            errors: [],
                            startedAt: data.started_at,
                            completedAt: null
                        };
                        // Start the import process in the background
                        this.processImport(importJob, connection);
                        return [2 /*return*/, importJob];
                    case 4:
                        err_8 = _d.sent();
                        console.error('Error running import:', err_8);
                        throw err_8;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Process an import job
     */
    processImport: function (importJob, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var importData, _a, _b, processed, success, errors, importJobs, updatedJob, index, err_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 20, , 22]);
                        // Update job status to running
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'running'
                            })
                                .eq('id', importJob.id)];
                    case 1:
                        // Update job status to running
                        _c.sent();
                        importData = [];
                        _a = connection.connection_type;
                        switch (_a) {
                            case 'rest-api': return [3 /*break*/, 2];
                            case 'google-sheets': return [3 /*break*/, 4];
                            case 'sql-odbc': return [3 /*break*/, 6];
                            case 'sap-bapi': return [3 /*break*/, 8];
                            case 'sftp': return [3 /*break*/, 10];
                            case 'csv-upload': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 13];
                    case 2: return [4 /*yield*/, this.importFromRestApi(connection.config, importJob.type)];
                    case 3:
                        importData = _c.sent();
                        return [3 /*break*/, 14];
                    case 4: return [4 /*yield*/, this.importFromGoogleSheets(connection.config, importJob.type)];
                    case 5:
                        importData = _c.sent();
                        return [3 /*break*/, 14];
                    case 6: return [4 /*yield*/, this.importFromSql(connection.config, importJob.type)];
                    case 7:
                        importData = _c.sent();
                        return [3 /*break*/, 14];
                    case 8: return [4 /*yield*/, this.importFromSap(connection.config, importJob.type)];
                    case 9:
                        importData = _c.sent();
                        return [3 /*break*/, 14];
                    case 10: return [4 /*yield*/, this.importFromSftp(connection.config, importJob.type)];
                    case 11:
                        importData = _c.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        // CSV uploads are handled separately
                        importData = [];
                        return [3 /*break*/, 14];
                    case 13: throw new Error("Unsupported connection type: ".concat(connection.connection_type));
                    case 14: return [4 /*yield*/, this.processImportData(importData, importJob.mapping, importJob.type, connection.compliance_level)];
                    case 15:
                        _b = _c.sent(), processed = _b.processed, success = _b.success, errors = _b.errors;
                        // Update job status to completed
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'completed',
                                records_processed: processed,
                                records_success: success,
                                records_error: errors.length,
                                errors: errors,
                                completed_at: new Date().toISOString()
                            })
                                .eq('id', importJob.id)];
                    case 16:
                        // Update job status to completed
                        _c.sent();
                        // Update connection's last sync time
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .update({
                                last_sync: new Date().toISOString()
                            })
                                .eq('id', connection.id)];
                    case 17:
                        // Update connection's last sync time
                        _c.sent();
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'importJobs')];
                    case 18:
                        importJobs = (_c.sent()) || [];
                        updatedJob = __assign(__assign({}, importJob), { status: 'completed', recordsProcessed: processed, recordsSuccess: success, recordsError: errors.length, errors: errors, completedAt: new Date().toISOString() });
                        index = importJobs.findIndex(function (job) { return job.id === importJob.id; });
                        if (index !== -1) {
                            importJobs[index] = updatedJob;
                        }
                        else {
                            importJobs.unshift(updatedJob);
                        }
                        return [4 /*yield*/, (0, offline_1.storeOfflineData)('integration', 'importJobs', importJobs)];
                    case 19:
                        _c.sent();
                        return [3 /*break*/, 22];
                    case 20:
                        err_9 = _c.sent();
                        console.error('Error processing import:', err_9);
                        // Update job status to failed
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'failed',
                                errors: [{ error: err_9.message }],
                                completed_at: new Date().toISOString()
                            })
                                .eq('id', importJob.id)];
                    case 21:
                        // Update job status to failed
                        _c.sent();
                        return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Import data from REST API
     */
    importFromRestApi: function (config, importType) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, apiKey, authType, headers, endpoint, response, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        baseUrl = config.baseUrl, apiKey = config.apiKey, authType = config.authType;
                        if (!baseUrl) {
                            throw new Error('Base URL is required');
                        }
                        headers = {};
                        if (apiKey) {
                            switch (authType) {
                                case 'bearer':
                                    headers['Authorization'] = "Bearer ".concat(apiKey);
                                    break;
                                case 'basic':
                                    headers['Authorization'] = "Basic ".concat(btoa(apiKey));
                                    break;
                                default:
                                    headers['X-API-Key'] = apiKey;
                                    break;
                            }
                        }
                        endpoint = baseUrl;
                        if (!endpoint.endsWith('/')) {
                            endpoint += '/';
                        }
                        switch (importType) {
                            case 'job-data':
                                endpoint += 'jobs';
                                break;
                            case 'operator-workcenter':
                                endpoint += 'operators';
                                break;
                            case 'routing-operations':
                                endpoint += 'operations';
                                break;
                            case 'cost-tracking':
                                endpoint += 'costs';
                                break;
                            case 'customer-association':
                                endpoint += 'customers';
                                break;
                        }
                        return [4 /*yield*/, axios_1.default.get(endpoint, { headers: headers })];
                    case 1:
                        response = _a.sent();
                        if (response.status >= 200 && response.status < 300) {
                            return [2 /*return*/, Array.isArray(response.data) ? response.data : [response.data]];
                        }
                        else {
                            throw new Error("API returned status ".concat(response.status));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        console.error('Error importing from REST API:', err_10);
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Import data from Google Sheets
     */
    importFromGoogleSheets: function (config, importType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use the Google Sheets API
                // For now, we'll return mock data
                return [2 /*return*/, this.getMockData(importType, 50)];
            });
        });
    },
    /**
     * Import data from SQL
     */
    importFromSql: function (config, importType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use a SQL client
                // For now, we'll return mock data
                return [2 /*return*/, this.getMockData(importType, 75)];
            });
        });
    },
    /**
     * Import data from SAP
     */
    importFromSap: function (config, importType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use SAP client libraries
                // For now, we'll return mock data
                return [2 /*return*/, this.getMockData(importType, 100)];
            });
        });
    },
    /**
     * Import data from SFTP
     */
    importFromSftp: function (config, importType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would use an SFTP client
                // For now, we'll return mock data
                return [2 /*return*/, this.getMockData(importType, 25)];
            });
        });
    },
    /**
     * Process imported data
     */
    processImportData: function (data, mapping, importType, complianceLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var processed, success, errors, i, record, mappedRecord, _i, mapping_1, map, tableName, error, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processed = data.length;
                        success = 0;
                        errors = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < data.length)) return [3 /*break*/, 7];
                        record = data[i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        mappedRecord = {};
                        for (_i = 0, mapping_1 = mapping; _i < mapping_1.length; _i++) {
                            map = mapping_1[_i];
                            if (record[map.sourceField] !== undefined) {
                                mappedRecord[map.targetField] = record[map.sourceField];
                            }
                            else if (map.required) {
                                throw new Error("Required field ".concat(map.sourceField, " is missing"));
                            }
                            // Check compliance flags
                            if (map.complianceFlag && complianceLevel !== 'basic') {
                                if (record[map.sourceField] === undefined || record[map.sourceField] === null) {
                                    throw new Error("Compliance field ".concat(map.sourceField, " is required for ").concat(complianceLevel, " compliance level"));
                                }
                            }
                        }
                        tableName = '';
                        switch (importType) {
                            case 'job-data':
                                tableName = 'jobs';
                                break;
                            case 'operator-workcenter':
                                tableName = 'users';
                                break;
                            case 'routing-operations':
                                tableName = 'job_operations';
                                break;
                            case 'cost-tracking':
                                tableName = 'job_materials';
                                break;
                            case 'customer-association':
                                tableName = 'customers';
                                break;
                        }
                        if (!tableName) return [3 /*break*/, 4];
                        return [4 /*yield*/, api_service_1.supabase
                                .from(tableName)
                                .upsert(mappedRecord)];
                    case 3:
                        error = (_a.sent()).error;
                        if (error) {
                            throw error;
                        }
                        _a.label = 4;
                    case 4:
                        success++;
                        return [3 /*break*/, 6];
                    case 5:
                        err_11 = _a.sent();
                        errors.push({
                            row: i + 1,
                            record: record,
                            error: err_11.message,
                            severity: 'error'
                        });
                        return [3 /*break*/, 6];
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, { processed: processed, success: success, errors: errors }];
                }
            });
        });
    },
    /**
     * Get mock data for testing
     */
    getMockData: function (importType, count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            switch (importType) {
                case 'job-data':
                    data.push({
                        job_number: "J2024-".concat(1000 + i),
                        part_number: "PN-".concat(5000 + i),
                        part_name: "Sample Part ".concat(i),
                        customer: "Customer ".concat(i % 10),
                        quantity: 10 + (i % 90),
                        due_date: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0],
                        priority: ['low', 'medium', 'high', 'urgent'][i % 4],
                        export_control: i % 5 === 0 ? 'ITAR' : 'None'
                    });
                    break;
                case 'operator-workcenter':
                    data.push({
                        operator_id: "OP-".concat(1000 + i),
                        operator_name: "Operator ".concat(i),
                        work_center: "WC-".concat(100 + (i % 5)),
                        shift: ['day', 'evening', 'night'][i % 3],
                        skills: ['milling', 'turning', 'grinding', 'inspection'][i % 4]
                    });
                    break;
                case 'routing-operations':
                    data.push({
                        job_number: "J2024-".concat(1000 + (i % 20)),
                        operation_number: i + 1,
                        operation_name: "Operation ".concat(i + 1),
                        work_center: "WC-".concat(100 + (i % 5)),
                        setup_time: 10 + (i % 50),
                        cycle_time: 5 + (i % 30)
                    });
                    break;
                case 'cost-tracking':
                    data.push({
                        job_number: "J2024-".concat(1000 + (i % 20)),
                        material_cost: 100 + (i * 10),
                        labor_cost: 50 + (i * 5),
                        overhead_cost: 25 + (i * 2.5),
                        total_cost: 175 + (i * 17.5)
                    });
                    break;
                case 'customer-association':
                    data.push({
                        customer_id: "CUST-".concat(1000 + i),
                        customer_name: "Customer ".concat(i),
                        contact_name: "Contact ".concat(i),
                        contact_email: "contact".concat(i, "@example.com"),
                        contact_phone: "555-".concat(100 + i)
                    });
                    break;
            }
        }
        return data;
    },
    /**
     * Check compliance for a job
     */
    checkCompliance: function (jobId, userId, action) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('compliance_checks')
                                .insert({
                                job_id: jobId,
                                user_id: userId,
                                action: action,
                                result: 'allowed', // Default to allowed
                                rules: []
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, {
                                jobId: data.job_id,
                                userId: data.user_id,
                                action: data.action,
                                result: data.result,
                                rules: data.rules || [],
                                timestamp: data.timestamp
                            }];
                    case 2:
                        err_12 = _b.sent();
                        console.error('Error checking compliance:', err_12);
                        throw err_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Fetch export control flags
     */
    fetchExportFlags: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_13, cachedFlags;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('export_control_flags')
                                .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (flag) { return ({
                                jobId: flag.job_id,
                                classification: flag.classification,
                                category: flag.category,
                                restrictions: flag.restrictions || [],
                                authorizedPersonnel: flag.authorized_personnel || [],
                                expirationDate: flag.expiration_date,
                                notes: flag.notes
                            }); })];
                    case 2:
                        err_13 = _b.sent();
                        console.error('Error fetching export flags:', err_13);
                        return [4 /*yield*/, (0, offline_1.getOfflineData)('integration', 'exportFlags')];
                    case 3:
                        cachedFlags = _b.sent();
                        return [2 /*return*/, cachedFlags || []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Process file upload for CSV/Excel import
     */
    processFileUpload: function (file, connectionId, importType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, _b, connection, connError, _c, mappings, mappingError, formattedMappings, importJob, err_14;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .insert({
                                connection_id: connectionId,
                                import_type: importType,
                                status: 'pending',
                                started_at: new Date().toISOString()
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _d.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .select('*')
                                .eq('id', connectionId)
                                .single()];
                    case 2:
                        _b = _d.sent(), connection = _b.data, connError = _b.error;
                        if (connError)
                            throw connError;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_mappings')
                                .select('*')
                                .eq('connection_id', connectionId)];
                    case 3:
                        _c = _d.sent(), mappings = _c.data, mappingError = _c.error;
                        if (mappingError) {
                            console.error('Error fetching mappings:', mappingError);
                        }
                        formattedMappings = (mappings || []).map(function (mapping) { return ({
                            sourceField: mapping.source_field,
                            targetField: mapping.target_field,
                            required: mapping.required,
                            complianceFlag: mapping.compliance_flag
                        }); });
                        importJob = {
                            id: data.id,
                            connectionId: data.connection_id,
                            type: data.import_type,
                            status: data.status,
                            mapping: formattedMappings,
                            recordsProcessed: 0,
                            recordsSuccess: 0,
                            recordsError: 0,
                            errors: [],
                            startedAt: data.started_at,
                            completedAt: null
                        };
                        // Process the file
                        this.processUploadedFile(file, importJob, connection);
                        return [2 /*return*/, importJob];
                    case 4:
                        err_14 = _d.sent();
                        console.error('Error processing file upload:', err_14);
                        throw err_14;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Process uploaded file
     */
    processUploadedFile: function (file, importJob, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, _a, processed, success, errors, err_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 8]);
                        // Update job status to running
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'running'
                            })
                                .eq('id', importJob.id)];
                    case 1:
                        // Update job status to running
                        _b.sent();
                        return [4 /*yield*/, this.readFileData(file, connection.config.fileFormat || 'csv')];
                    case 2:
                        fileData = _b.sent();
                        return [4 /*yield*/, this.processImportData(fileData, importJob.mapping, importJob.type, connection.compliance_level)];
                    case 3:
                        _a = _b.sent(), processed = _a.processed, success = _a.success, errors = _a.errors;
                        // Update job status to completed
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'completed',
                                records_processed: processed,
                                records_success: success,
                                records_error: errors.length,
                                errors: errors,
                                completed_at: new Date().toISOString()
                            })
                                .eq('id', importJob.id)];
                    case 4:
                        // Update job status to completed
                        _b.sent();
                        // Update connection's last sync time
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .update({
                                last_sync: new Date().toISOString()
                            })
                                .eq('id', connection.id)];
                    case 5:
                        // Update connection's last sync time
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        err_15 = _b.sent();
                        console.error('Error processing uploaded file:', err_15);
                        // Update job status to failed
                        return [4 /*yield*/, api_service_1.supabase
                                .from('import_jobs')
                                .update({
                                status: 'failed',
                                errors: [{ error: err_15.message }],
                                completed_at: new Date().toISOString()
                            })
                                .eq('id', importJob.id)];
                    case 7:
                        // Update job status to failed
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Read file data
     */
    readFileData: function (file, format) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var _a;
                            try {
                                var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                                if (!content) {
                                    reject(new Error('Failed to read file'));
                                    return;
                                }
                                var data = [];
                                switch (format) {
                                    case 'csv':
                                        data = _this.parseCSV(content, ',');
                                        break;
                                    case 'tsv':
                                        data = _this.parseCSV(content, '\t');
                                        break;
                                    case 'excel':
                                        // In a real implementation, this would use a library like SheetJS
                                        // For now, we'll just parse it as CSV
                                        data = _this.parseCSV(content, ',');
                                        break;
                                }
                                resolve(data);
                            }
                            catch (err) {
                                reject(err);
                            }
                        };
                        reader.onerror = function () {
                            reject(new Error('Failed to read file'));
                        };
                        reader.readAsText(file);
                    })];
            });
        });
    },
    /**
     * Parse CSV data
     */
    parseCSV: function (content, delimiter) {
        var _a;
        var lines = content.split('\n');
        if (lines.length === 0) {
            return [];
        }
        var headers = lines[0].split(delimiter).map(function (header) { return header.trim(); });
        var data = [];
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) {
                continue;
            }
            var values = line.split(delimiter);
            var record = {};
            for (var j = 0; j < headers.length; j++) {
                record[headers[j]] = ((_a = values[j]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            }
            data.push(record);
        }
        return data;
    },
    /**
     * Schedule automatic sync
     */
    scheduleAutomaticSync: function (connectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, connection, error, pollInterval, err_16;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('connection_configs')
                                .select('*')
                                .eq('id', connectionId)
                                .single()];
                    case 1:
                        _a = _b.sent(), connection = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        // Check if connection is active
                        if (connection.status !== 'active') {
                            return [2 /*return*/, false];
                        }
                        pollInterval = connection.config.pollInterval || connection.config.pollIntervalMinutes * 60000;
                        if (!pollInterval) {
                            return [2 /*return*/, false];
                        }
                        if (!('serviceWorker' in navigator && 'SyncManager' in window)) return [3 /*break*/, 4];
                        // Store connection ID for background sync
                        return [4 /*yield*/, (0, offline_1.storeOfflineData)('integration', "sync-".concat(connectionId), {
                                connectionId: connectionId,
                                lastSync: new Date().toISOString(),
                                nextSync: new Date(Date.now() + pollInterval).toISOString()
                            })];
                    case 2:
                        // Store connection ID for background sync
                        _b.sent();
                        // Register for background sync
                        return [4 /*yield*/, (0, offline_1.registerBackgroundSync)("sync-connection-".concat(connectionId))];
                    case 3:
                        // Register for background sync
                        _b.sent();
                        return [2 /*return*/, true];
                    case 4:
                        // Fallback to setTimeout
                        setTimeout(function () {
                            _this.runImport(connectionId, 'job-data');
                        }, pollInterval);
                        return [2 /*return*/, true];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_16 = _b.sent();
                        console.error('Error scheduling automatic sync:', err_16);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * AI-powered job shuffling
     */
    optimizeJobSchedule: function (departmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, jobs_2, jobsError, _b, machines, machinesError, filteredMachines, _c, operators, operatorsError, filteredOperators, assignedCount, _i, jobs_1, job, machine, operator, updateError, machineError, err_17;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .select('*')
                                .in('status', ['pending', 'setup', 'running'])
                                .order('priority', { ascending: false })
                                .order('due_date', { ascending: true })];
                    case 1:
                        _a = _d.sent(), jobs_2 = _a.data, jobsError = _a.error;
                        if (jobsError)
                            throw jobsError;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('machines')
                                .select('*')
                                .eq('status', 'idle')];
                    case 2:
                        _b = _d.sent(), machines = _b.data, machinesError = _b.error;
                        if (machinesError)
                            throw machinesError;
                        filteredMachines = departmentId
                            ? machines.filter(function (m) { return m.department_id === departmentId; })
                            : machines;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('is_active', true)
                                .in('role', ['operator', 'lead'])];
                    case 3:
                        _c = _d.sent(), operators = _c.data, operatorsError = _c.error;
                        if (operatorsError)
                            throw operatorsError;
                        filteredOperators = departmentId
                            ? operators.filter(function (o) { return o.department === departmentId; })
                            : operators;
                        assignedCount = 0;
                        _i = 0, jobs_1 = jobs_2;
                        _d.label = 4;
                    case 4:
                        if (!(_i < jobs_1.length)) return [3 /*break*/, 8];
                        job = jobs_1[_i];
                        // Skip jobs that are already running
                        if (job.status === 'running') {
                            return [3 /*break*/, 7];
                        }
                        machine = filteredMachines.find(function (m) { return !m.current_job_id; });
                        if (!machine) {
                            // No available machines
                            return [3 /*break*/, 7];
                        }
                        operator = filteredOperators.find(function (o) {
                            // Check if operator is already assigned to a job
                            var isAssigned = jobs_2.some(function (j) {
                                return j.status === 'running' &&
                                    j.operator_id === o.id;
                            });
                            return !isAssigned;
                        });
                        if (!operator) {
                            // No available operators
                            return [3 /*break*/, 7];
                        }
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .update({
                                status: 'setup',
                                machine_id: machine.id,
                                operator_id: operator.id,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', job.id)];
                    case 5:
                        updateError = (_d.sent()).error;
                        if (updateError) {
                            console.error('Error updating job:', updateError);
                            return [3 /*break*/, 7];
                        }
                        return [4 /*yield*/, api_service_1.supabase
                                .from('machines')
                                .update({
                                status: 'running',
                                current_job_id: job.id,
                                operator_id: operator.id,
                                updated_at: new Date().toISOString()
                            })
                                .eq('id', machine.id)];
                    case 6:
                        machineError = (_d.sent()).error;
                        if (machineError) {
                            console.error('Error updating machine:', machineError);
                        }
                        assignedCount++;
                        _d.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8: return [2 /*return*/, assignedCount > 0];
                    case 9:
                        err_17 = _d.sent();
                        console.error('Error optimizing job schedule:', err_17);
                        return [2 /*return*/, false];
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * AI-powered job recommendations
     */
    getJobRecommendations: function (operatorId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, operator, operatorError, skills, department, _b, jobs, jobsError, _c, machines_1, machinesError, scoredJobs, err_18;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('users')
                                .select('*')
                                .eq('id', operatorId)
                                .single()];
                    case 1:
                        _a = _d.sent(), operator = _a.data, operatorError = _a.error;
                        if (operatorError)
                            throw operatorError;
                        skills = operator.skills || [];
                        department = operator.department;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('status', 'pending')
                                .order('priority', { ascending: false })
                                .order('due_date', { ascending: true })];
                    case 2:
                        _b = _d.sent(), jobs = _b.data, jobsError = _b.error;
                        if (jobsError)
                            throw jobsError;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('machines')
                                .select('*')
                                .eq('department_id', department)
                                .eq('status', 'idle')];
                    case 3:
                        _c = _d.sent(), machines_1 = _c.data, machinesError = _c.error;
                        if (machinesError)
                            throw machinesError;
                        scoredJobs = jobs.map(function (job) {
                            var _a;
                            // Base score
                            var score = 0;
                            // Priority score (0-30)
                            switch (job.priority) {
                                case 'urgent':
                                    score += 30;
                                    break;
                                case 'high':
                                    score += 20;
                                    break;
                                case 'medium':
                                    score += 10;
                                    break;
                                case 'low':
                                    score += 0;
                                    break;
                            }
                            // Due date score (0-30)
                            var dueDate = new Date(job.due_date);
                            var today = new Date();
                            var daysUntilDue = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                            if (daysUntilDue <= 1) {
                                score += 30;
                            }
                            else if (daysUntilDue <= 3) {
                                score += 20;
                            }
                            else if (daysUntilDue <= 7) {
                                score += 10;
                            }
                            // Skills match score (0-20)
                            // This would require job skills to be defined
                            // For now, we'll use a random score
                            score += Math.floor(Math.random() * 20);
                            // Available machines score (0-20)
                            var availableMachines = machines_1.filter(function (m) {
                                return m.capabilities &&
                                    m.capabilities.some(function (c) { var _a; return (_a = job.operation) === null || _a === void 0 ? void 0 : _a.includes(c); });
                            });
                            if (availableMachines.length > 0) {
                                score += 20;
                            }
                            return __assign(__assign({}, job), { score: score, recommendedMachine: (_a = availableMachines[0]) === null || _a === void 0 ? void 0 : _a.id });
                        });
                        // Sort by score (descending)
                        return [2 /*return*/, scoredJobs.sort(function (a, b) { return b.score - a.score; })];
                    case 4:
                        err_18 = _d.sent();
                        console.error('Error getting job recommendations:', err_18);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
};
var templateObject_1;
