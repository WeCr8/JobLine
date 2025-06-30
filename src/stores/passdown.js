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
exports.usePassdownStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var passdown_service_1 = require("../services/passdown.service");
var demo_service_1 = require("../services/demo.service");
var auth_1 = require("./auth");
exports.usePassdownStore = (0, pinia_1.defineStore)('passdown', function () {
    var notes = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var authStore = (0, auth_1.useAuthStore)();
    var fetchNotes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedNotes, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_b = (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.includes('demo')))) return [3 /*break*/, 2];
                    // Use hardcoded demo data
                    notes.value = demo_service_1.demoService.getDemoData('passdownNotes');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, passdown_service_1.passdownService.fetchNotes()];
                case 3:
                    fetchedNotes = _c.sent();
                    notes.value = fetchedNotes;
                    _c.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_1 = _c.sent();
                    error.value = err_1.message;
                    console.error('Error fetching passdown notes:', err_1);
                    return [3 /*break*/, 7];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var addNote = function (note) { return __awaiter(void 0, void 0, void 0, function () {
        var newNote, newNote, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, 6, 7]);
                    if (!(import.meta.env.VITE_DEMO_MODE === 'true' && ((_b = (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.includes('demo')))) return [3 /*break*/, 2];
                    newNote = __assign(__assign({ id: "note-".concat(Date.now()) }, note), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
                    notes.value.unshift(newNote);
                    return [2 /*return*/, newNote];
                case 2: return [4 /*yield*/, passdown_service_1.passdownService.addNote(note)];
                case 3:
                    newNote = _c.sent();
                    if (newNote) {
                        notes.value.unshift(newNote);
                    }
                    return [2 /*return*/, newNote];
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_2 = _c.sent();
                    error.value = err_2.message;
                    console.error('Error adding passdown note:', err_2);
                    return [2 /*return*/, null];
                case 6:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Computed properties
    var notesByShift = (0, vue_1.computed)(function () {
        var shifts = { day: 0, evening: 0, night: 0 };
        notes.value.forEach(function (note) {
            shifts[note.shift]++;
        });
        return shifts;
    });
    var notesByMachine = (0, vue_1.computed)(function () {
        var machines = {};
        notes.value.forEach(function (note) {
            machines[note.machine] = (machines[note.machine] || 0) + 1;
        });
        return machines;
    });
    var recentNotes = (0, vue_1.computed)(function () {
        return notes.value.slice(0, 10).sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    });
    return {
        notes: notes,
        loading: loading,
        error: error,
        notesByShift: notesByShift,
        notesByMachine: notesByMachine,
        recentNotes: recentNotes,
        fetchNotes: fetchNotes,
        addNote: addNote
    };
});
