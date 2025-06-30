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
exports.useSettingsStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var settings_service_1 = require("../services/settings.service");
exports.useSettingsStore = (0, pinia_1.defineStore)('settings', function () {
    var userSettings = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var fetchUserSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.fetchUserSettings()];
                case 2:
                    settings = _a.sent();
                    userSettings.value = settings;
                    return [2 /*return*/, settings];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    console.error('Error fetching user settings:', err_1);
                    return [2 /*return*/, null];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateUserProfile = function (profile) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updateUserProfile(profile)];
                case 2:
                    success = _a.sent();
                    if (success && userSettings.value) {
                        userSettings.value.profile = __assign(__assign({}, userSettings.value.profile), profile);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_2 = _a.sent();
                    error.value = err_2.message;
                    console.error('Error updating user profile:', err_2);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateNotificationSettings = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updateNotificationSettings(settings)];
                case 2:
                    success = _a.sent();
                    if (success && userSettings.value) {
                        userSettings.value.notifications = __assign(__assign({}, userSettings.value.notifications), settings);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    console.error('Error updating notification settings:', err_3);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateAppearanceSettings = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updateAppearanceSettings(settings)];
                case 2:
                    success = _a.sent();
                    if (success && userSettings.value) {
                        userSettings.value.appearance = __assign(__assign({}, userSettings.value.appearance), settings);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_4 = _a.sent();
                    error.value = err_4.message;
                    console.error('Error updating appearance settings:', err_4);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateSecuritySettings = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updateSecuritySettings(settings)];
                case 2:
                    success = _a.sent();
                    if (success && userSettings.value) {
                        userSettings.value.security = __assign(__assign({}, userSettings.value.security), settings);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_5 = _a.sent();
                    error.value = err_5.message;
                    console.error('Error updating security settings:', err_5);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updatePrivacySettings = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updatePrivacySettings(settings)];
                case 2:
                    success = _a.sent();
                    if (success && userSettings.value) {
                        userSettings.value.privacy = __assign(__assign({}, userSettings.value.privacy), settings);
                    }
                    return [2 /*return*/, success];
                case 3:
                    err_6 = _a.sent();
                    error.value = err_6.message;
                    console.error('Error updating privacy settings:', err_6);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updatePassword = function (currentPassword, newPassword) { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.updatePassword(currentPassword, newPassword)];
                case 2:
                    success = _a.sent();
                    return [2 /*return*/, success];
                case 3:
                    err_7 = _a.sent();
                    error.value = err_7.message;
                    console.error('Error updating password:', err_7);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var regenerateApiKey = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newApiKey, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.regenerateApiKey()];
                case 2:
                    newApiKey = _a.sent();
                    if (newApiKey && userSettings.value) {
                        userSettings.value.integrations.apiKey = newApiKey;
                    }
                    return [2 /*return*/, newApiKey];
                case 3:
                    err_8 = _a.sent();
                    error.value = err_8.message;
                    console.error('Error regenerating API key:', err_8);
                    return [2 /*return*/, null];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var deleteAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, settings_service_1.settingsService.deleteAccount()];
                case 2:
                    success = _a.sent();
                    return [2 /*return*/, success];
                case 3:
                    err_9 = _a.sent();
                    error.value = err_9.message;
                    console.error('Error deleting account:', err_9);
                    return [2 /*return*/, false];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        userSettings: userSettings,
        loading: loading,
        error: error,
        fetchUserSettings: fetchUserSettings,
        updateUserProfile: updateUserProfile,
        updateNotificationSettings: updateNotificationSettings,
        updateAppearanceSettings: updateAppearanceSettings,
        updateSecuritySettings: updateSecuritySettings,
        updatePrivacySettings: updatePrivacySettings,
        updatePassword: updatePassword,
        regenerateApiKey: regenerateApiKey,
        deleteAccount: deleteAccount
    };
});
