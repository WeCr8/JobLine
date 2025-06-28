import { supabase, handleApiError } from './api.service';
import type { User } from '../types';

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string): Promise<{ data: any; error: null } | { data: null; error: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      // Check for pending invites - use maybeSingle() to avoid errors when no invite exists
      const { data: inviteData, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending')
        .maybeSingle();

      if (inviteError) {
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
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
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
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { data: null, error: err.message };
    }
  },

  /**
   * Sign in a user
   */
  async signIn(email: string, password: string): Promise<{ data: any; error: null } | { data: null; error: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { data: null, error: err.message };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: null } | { error: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('Sign out error:', err);
      return { error: err.message };
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.error('Get session error:', err);
      return null;
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return profile;
    } catch (err) {
      console.error('Get current user error:', err);
      return null;
    }
  },

  /**
   * Set up auth state change listener
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};