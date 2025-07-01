export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare class ApiError extends Error {
    status: number;
    constructor(message: string, status?: number);
}
export declare const handleApiError: (error: any) => never;
