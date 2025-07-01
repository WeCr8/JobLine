import type { User } from '../types';
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", Pick<{
    user: import("vue").Ref<{
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null, User | {
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isPlatformAdmin: import("vue").ComputedRef<boolean>;
    isOrgAdmin: import("vue").ComputedRef<boolean>;
    isDeveloper: import("vue").ComputedRef<boolean>;
    signUp: (email: string, password: string, name: string) => Promise<{
        data: {
            user: import("@supabase/auth-js").User | null;
            session: import("@supabase/auth-js").Session | null;
        };
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signIn: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signOut: () => Promise<{
        error: any;
    }>;
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    logout: () => Promise<{
        error: any;
    }>;
}, "error" | "user" | "loading">, Pick<{
    user: import("vue").Ref<{
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null, User | {
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isPlatformAdmin: import("vue").ComputedRef<boolean>;
    isOrgAdmin: import("vue").ComputedRef<boolean>;
    isDeveloper: import("vue").ComputedRef<boolean>;
    signUp: (email: string, password: string, name: string) => Promise<{
        data: {
            user: import("@supabase/auth-js").User | null;
            session: import("@supabase/auth-js").Session | null;
        };
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signIn: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signOut: () => Promise<{
        error: any;
    }>;
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    logout: () => Promise<{
        error: any;
    }>;
}, "isAuthenticated" | "isPlatformAdmin" | "isOrgAdmin" | "isDeveloper">, Pick<{
    user: import("vue").Ref<{
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null, User | {
        id: string;
        email: string;
        name: string;
        role: import("../types").UserRole;
        department?: string | undefined;
        organization_id?: string | undefined;
        is_active: boolean;
        last_login?: string | undefined;
        created_at: string;
        is_developer?: boolean | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isPlatformAdmin: import("vue").ComputedRef<boolean>;
    isOrgAdmin: import("vue").ComputedRef<boolean>;
    isDeveloper: import("vue").ComputedRef<boolean>;
    signUp: (email: string, password: string, name: string) => Promise<{
        data: {
            user: import("@supabase/auth-js").User | null;
            session: import("@supabase/auth-js").Session | null;
        };
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signIn: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    signOut: () => Promise<{
        error: any;
    }>;
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    logout: () => Promise<{
        error: any;
    }>;
}, "signUp" | "signIn" | "signOut" | "initAuth" | "login" | "logout">>;
