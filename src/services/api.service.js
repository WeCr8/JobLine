"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = exports.ApiError = exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
// Initialize Supabase client
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Generic API error handler
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(message, status) {
        if (status === void 0) { status = 500; }
        var _this = _super.call(this, message) || this;
        _this.name = 'ApiError';
        _this.status = status;
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
// Helper function to handle API errors
var handleApiError = function (error) {
    console.error('API Error:', error);
    if (error.code === 'PGRST301') {
        throw new ApiError('You do not have permission to access this resource', 403);
    }
    if (error.code === 'PGRST204') {
        throw new ApiError('Resource not found', 404);
    }
    throw new ApiError(error.message || 'An unexpected error occurred', 500);
};
exports.handleApiError = handleApiError;
