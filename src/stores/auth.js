import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth.service';
import { supabase } from '../lib/supabase';
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = computed(() => !!user.value);
    const isPlatformAdmin = computed(() => user.value?.role === 'admin' && !user.value?.organization_id);
    const isOrgAdmin = computed(() => user.value?.role === 'organization_admin' || (user.value?.role === 'admin' && !!user.value?.organization_id));
    const isDeveloper = computed(() => user.value?.is_developer === true);
    const signUp = async (email, password, name) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name
                    }
                }
            });
            if (signUpError)
                throw signUpError;
            if (data.user) {
                // Check if there's a pending invite for this email
                const { data: inviteData, error: inviteError } = await supabase
                    .from('invites')
                    .select('*')
                    .eq('email', email)
                    .eq('status', 'pending')
                    .single();
                if (inviteError && inviteError.code !== 'PGRST116') {
                    console.error('Error checking for invites:', inviteError);
                }
                let role = 'operator';
                let organization_id = null;
                let department = null;
                // If there's an invite, use its role and organization
                if (inviteData) {
                    role = inviteData.role;
                    organization_id = inviteData.organization_id;
                    department = inviteData.department;
                }
                // Create user profile
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                    id: data.user.id,
                    email: data.user.email,
                    name,
                    role,
                    organization_id,
                    department
                });
                if (profileError) {
                    console.error('Error creating user profile:', profileError);
                }
                // If there was an invite, update it to accepted
                if (inviteData) {
                    const { error: updateInviteError } = await supabase
                        .from('invites')
                        .update({ status: 'accepted' })
                        .eq('id', inviteData.id);
                    if (updateInviteError) {
                        console.error('Error updating invite status:', updateInviteError);
                    }
                    // Add user to organization_users if there's an organization
                    if (organization_id) {
                        const { error: orgUserError } = await supabase
                            .from('organization_users')
                            .insert({
                            organization_id,
                            user_id: data.user.id,
                            role,
                            is_admin: role === 'organization_admin'
                        });
                        if (orgUserError) {
                            console.error('Error adding user to organization:', orgUserError);
                        }
                    }
                }
                user.value = {
                    id: data.user.id,
                    email: data.user.email,
                    name: inviteData?.name || name,
                    role: inviteData?.role || 'operator',
                    department: inviteData?.department,
                    organization_id: inviteData?.organization_id,
                    is_active: true,
                    created_at: new Date().toISOString()
                };
            }
            return { data: data, error: null };
        }
        catch (err) {
            error.value = err.message;
            return { data: null, error: err.message };
        }
        finally {
            loading.value = false;
        }
    };
    const signIn = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await authService.signIn(email, password);
            if (result.error) {
                error.value = result.error;
                return { data: null, error: result.error };
            }
            if (result.data.user) {
                // Set user from profile data
                const profile = await authService.getCurrentUser();
                if (profile) {
                    user.value = profile;
                }
                else {
                    user.value = {
                        id: result.data.user.id,
                        email: result.data.user.email,
                        name: result.data.user.user_metadata?.name || 'User',
                        role: 'operator',
                        department: 'Manufacturing',
                        is_active: true,
                        created_at: new Date().toISOString()
                    };
                }
            }
            return { data: result.data, error: null };
        }
        catch (err) {
            error.value = err.message;
            return { data: null, error: err.message };
        }
        finally {
            loading.value = false;
        }
    };
    const signOut = async () => {
        loading.value = true;
        error.value = null;
        try {
            const result = await authService.signOut();
            if (result.error) {
                error.value = result.error;
                return { error: result.error };
            }
            // Clear demo user email
            if (import.meta.env.VITE_DEMO_MODE === 'true') {
                localStorage.removeItem('demoUserEmail');
            }
            user.value = null;
            return { error: null };
        }
        catch (err) {
            error.value = err.message;
            return { error: err.message };
        }
        finally {
            loading.value = false;
        }
    };
    const initAuth = async () => {
        loading.value = true;
        try {
            const session = await authService.getSession();
            if (session?.user) {
                // Fetch user profile
                const profile = await authService.getCurrentUser();
                if (profile) {
                    user.value = profile;
                }
                else {
                    user.value = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name || 'User',
                        role: 'operator',
                        department: 'Manufacturing',
                        is_active: true,
                        created_at: new Date().toISOString()
                    };
                }
            }
        }
        catch (err) {
            console.error('Error initializing auth:', err);
            error.value = err.message;
        }
        finally {
            loading.value = false;
        }
        // Listen for auth changes
        authService.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const profile = await authService.getCurrentUser();
                if (profile) {
                    user.value = profile;
                }
                else {
                    user.value = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name || 'User',
                        role: 'operator',
                        department: 'Manufacturing',
                        is_active: true,
                        created_at: new Date().toISOString()
                    };
                }
            }
            else if (event === 'SIGNED_OUT') {
                user.value = null;
            }
        });
    };
    // Legacy method for backward compatibility
    const login = async (email, password) => {
        return signIn(email, password);
    };
    const logout = async () => {
        return signOut();
    };
    return {
        user,
        loading,
        error,
        isAuthenticated,
        isPlatformAdmin,
        isOrgAdmin,
        isDeveloper,
        signUp,
        signIn,
        signOut,
        initAuth,
        login,
        logout
    };
});
