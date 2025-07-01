import type { User } from '../types';
export declare const authService: {
    /**
     * Sign up a new user
     */
    signUp(email: string, password: string, name: string): Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: string;
    }>;
    /**
     * Sign in a user
     */
    signIn(email: string, password: string): Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: string;
    }>;
    /**
     * Sign out the current user
     */
    signOut(): Promise<{
        error: null;
    } | {
        error: string;
    }>;
    /**
     * Get the current session
     */
    getSession(): Promise<import("@supabase/auth-js").Session | {
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
        };
    } | null>;
    /**
     * Get the current user
     */
    getCurrentUser(): Promise<User | null>;
    /**
     * Set up auth state change listener
     */
    onAuthStateChange(callback: (event: string, session: any) => void): {
        data: {
            subscription: import("@supabase/auth-js").Subscription;
        };
    } | {
        data: {
            subscription: {
                unsubscribe: () => void;
            };
        };
    };
};
