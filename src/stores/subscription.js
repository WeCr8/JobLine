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
exports.useSubscriptionStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var subscription_service_1 = require("../services/subscription.service");
var stripe_config_1 = require("../stripe-config");
exports.useSubscriptionStore = (0, pinia_1.defineStore)('subscription', function () {
    var subscription = (0, vue_1.ref)(null);
    var orders = (0, vue_1.ref)([]);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    var currentPlan = (0, vue_1.computed)(function () {
        var _a;
        if (!((_a = subscription.value) === null || _a === void 0 ? void 0 : _a.price_id))
            return null;
        return stripe_config_1.products.find(function (p) { var _a; return p.priceId === ((_a = subscription.value) === null || _a === void 0 ? void 0 : _a.price_id); }) || null;
    });
    var isSubscribed = (0, vue_1.computed)(function () {
        var _a;
        return ((_a = subscription.value) === null || _a === void 0 ? void 0 : _a.subscription_status) === 'active';
    });
    var fetchSubscription = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, subscription_service_1.subscriptionService.fetchSubscription()];
                case 2:
                    data = _a.sent();
                    subscription.value = data;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    error.value = err_1.message;
                    console.error('Error fetching subscription:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, subscription_service_1.subscriptionService.fetchOrders()];
                case 2:
                    data = _a.sent();
                    orders.value = data;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    error.value = err_2.message;
                    console.error('Error fetching orders:', err_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var createCheckoutSession = function (product) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, subscription_service_1.subscriptionService.createCheckoutSession(product)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _a.sent();
                    error.value = err_3.message;
                    console.error('Error creating checkout session:', err_3);
                    throw err_3;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var cancelSubscription = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    error.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, subscription_service_1.subscriptionService.cancelSubscription()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    error.value = err_4.message;
                    console.error('Error cancelling subscription:', err_4);
                    throw err_4;
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        subscription: subscription,
        orders: orders,
        loading: loading,
        error: error,
        currentPlan: currentPlan,
        isSubscribed: isSubscribed,
        fetchSubscription: fetchSubscription,
        fetchOrders: fetchOrders,
        createCheckoutSession: createCheckoutSession,
        cancelSubscription: cancelSubscription
    };
});
