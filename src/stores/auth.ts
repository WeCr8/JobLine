import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth.service.ts';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isPlatformAdmin = computed(() => user.value?.role === 'admin' && !user.value?.organization_id);
  const isOrgAdmin = computed(() => user.value?.role === 'organization_admin' || (user.value?.role === 'admin' && !!user.value?.organization_id));
  const isDeveloper = computed(() => user.value?.is_developer === true);

  const signUp = async (email: string, password: string, name: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await authService.signUp(email, password, name);
      
      if (result.error) {
        error.value = result.error;
        return { data: null, error: result.error };
      }
      
      if (result.data.user) {
        // Store demo user email for persistence
        if (import.meta.env.VITE_DEMO_MODE === 'true') {
          localStorage.setItem('demoUserEmail', email);
        }
        
        // Set user data if available
        const userData = result.data.user.user_metadata;
        user.value = {
          id: result.data.user.id,
          email: result.data.user.email!,
          name: userData?.name || name,
          role: userData?.role || 'operator',
          department: userData?.department,
          organization_id: userData?.organization_id,
          is_active: true,
          created_at: new Date().toISOString()
        };
      }
      
      return { data: result.data, error: null };
    } catch (err: any) {
      error.value = err.message;
      return { data: null, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
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
        } else {
          user.value = {
            id: result.data.user.id,
            email: result.data.user.email!,
            name: result.data.user.user_metadata?.name || 'User',
            role: 'operator',
            department: 'Manufacturing',
            is_active: true,
            created_at: new Date().toISOString()
          };
        }
      }
      
      return { data: result.data, error: null };
    } catch (err: any) {
      error.value = err.message;
      return { data: null, error: err.message };
    } finally {
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
    } catch (err: any) {
      error.value = err.message;
      return { error: err.message };
    } finally {
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
        } else {
          user.value = {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user as any).user_metadata?.name || 'User',
            role: 'operator',
            department: 'Manufacturing',
            is_active: true,
            created_at: new Date().toISOString()
          };
        }
      }
    } catch (err: any) {
      console.error('Error initializing auth:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }

    // Listen for auth changes
    authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authService.getCurrentUser();
        
        if (profile) {
          user.value = profile;
        } else {
          user.value = {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user as any).user_metadata?.name || 'User',
            role: 'operator',
            department: 'Manufacturing',
            is_active: true,
            created_at: new Date().toISOString()
          };
        }
      } else if (event === 'SIGNED_OUT') {
        user.value = null;
      }
    });
  };

  // Legacy method for backward compatibility
  const login = async (email: string, password: string) => {
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