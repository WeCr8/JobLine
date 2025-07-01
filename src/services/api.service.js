import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Generic API error handler
export class ApiError extends Error {
    status;
    constructor(message, status = 500) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}
// Helper function to handle API errors
export const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.code === 'PGRST301') {
        throw new ApiError('You do not have permission to access this resource', 403);
    }
    if (error.code === 'PGRST204') {
        throw new ApiError('Resource not found', 404);
    }
    throw new ApiError(error.message || 'An unexpected error occurred', 500);
};
