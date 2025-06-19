import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  const signUp = async (email: string, password: string, name: string) => {
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

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name,
            role: 'operator'
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        user.value = {
          id: data.user.id,
          email: data.user.email!,
          name,
          role: 'operator',
          department: 'Manufacturing',
          createdAt: new Date().toISOString()
        };
      }

      return { data, error: null };
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        user.value = profile || {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || 'User',
          role: 'operator',
          department: 'Manufacturing',
          createdAt: new Date().toISOString()
        };
      }

      return { data, error: null };
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
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        user.value = profile || {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || 'User',
          role: 'operator',
          department: 'Manufacturing',
          createdAt: new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.error('Error initializing auth:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        user.value = profile || {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || 'User',
          role: 'operator',
          department: 'Manufacturing',
          createdAt: new Date().toISOString()
        };
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
    signUp,
    signIn,
    signOut,
    initAuth,
    login,
    logout
  };
});