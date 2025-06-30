"use strict";
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
exports.passdownService = void 0;
var api_service_1 = require("./api.service");
exports.passdownService = {
    /**
     * Fetch all passdown notes
     */
    fetchNotes: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api_service_1.supabase
                                .from('passdown_notes')
                                .select("\n          *,\n          five_s_checklists(*)\n        ")
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, (data || []).map(function (note) { return ({
                                id: note.id,
                                workOrder: note.work_order,
                                shift: note.shift,
                                date: note.date,
                                operator: note.operator_name,
                                machine: note.machine_id,
                                laborType: note.labor_type,
                                machineCondition: note.machine_condition,
                                hoursWorked: note.hours_worked,
                                partsCompleted: note.parts_completed,
                                qualityIssues: note.quality_issues,
                                machineIssues: note.machine_issues,
                                fiveSChecklist: note.five_s_checklists[0] || {
                                    coolantLevel: false,
                                    coolantCondition: 'good',
                                    chipBinEmptied: false,
                                    chipBinCondition: 'empty',
                                    deskCleaned: false,
                                    toolingReturned: false,
                                    toolingCondition: 'good',
                                    workAreaOrganized: false,
                                    safetyChecked: false,
                                    notes: ''
                                },
                                nextShiftNotes: note.next_shift_notes,
                                createdAt: note.created_at,
                                updatedAt: note.updated_at
                            }); })];
                    case 2:
                        err_1 = _b.sent();
                        console.error('Error fetching passdown notes:', err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Add a new passdown note
     */
    addNote: function (note) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, data, error, checklistError, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, api_service_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        if (!user)
                            throw new Error('User not authenticated');
                        return [4 /*yield*/, api_service_1.supabase
                                .from('passdown_notes')
                                .insert({
                                work_order: note.workOrder,
                                shift: note.shift,
                                date: note.date,
                                operator_id: user.id,
                                operator_name: note.operator,
                                machine_id: note.machine,
                                labor_type: note.laborType,
                                machine_condition: note.machineCondition,
                                hours_worked: note.hoursWorked,
                                parts_completed: note.partsCompleted,
                                quality_issues: note.qualityIssues,
                                machine_issues: note.machineIssues,
                                next_shift_notes: note.nextShiftNotes
                            })
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, api_service_1.supabase
                                .from('five_s_checklists')
                                .insert({
                                passdown_note_id: data.id,
                                coolant_level: note.fiveSChecklist.coolantLevel,
                                coolant_condition: note.fiveSChecklist.coolantCondition,
                                chip_bin_emptied: note.fiveSChecklist.chipBinEmptied,
                                chip_bin_condition: note.fiveSChecklist.chipBinCondition,
                                desk_cleaned: note.fiveSChecklist.deskCleaned,
                                tooling_returned: note.fiveSChecklist.toolingReturned,
                                tooling_condition: note.fiveSChecklist.toolingCondition,
                                work_area_organized: note.fiveSChecklist.workAreaOrganized,
                                safety_checked: note.fiveSChecklist.safetyChecked,
                                notes: note.fiveSChecklist.notes
                            })];
                    case 3:
                        checklistError = (_b.sent()).error;
                        if (checklistError)
                            throw checklistError;
                        return [2 /*return*/, {
                                id: data.id,
                                workOrder: data.work_order,
                                shift: data.shift,
                                date: data.date,
                                operator: data.operator_name,
                                machine: data.machine_id,
                                laborType: data.labor_type,
                                machineCondition: data.machine_condition,
                                hoursWorked: data.hours_worked,
                                partsCompleted: data.parts_completed,
                                qualityIssues: data.quality_issues,
                                machineIssues: data.machine_issues,
                                fiveSChecklist: note.fiveSChecklist,
                                nextShiftNotes: data.next_shift_notes,
                                createdAt: data.created_at,
                                updatedAt: data.updated_at
                            }];
                    case 4:
                        err_2 = _b.sent();
                        console.error('Error adding passdown note:', err_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
};
