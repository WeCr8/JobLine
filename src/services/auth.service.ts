import { supabase } from './api.service';
import type { User } from '../types';
import { demoService } from './demo.service';

// Demo accounts for testing
const demoAccounts: Record<string, User> = {
  'demo-org-admin@wecr8.info': {
    id: 'demo-admin-id',
    email: 'demo-org-admin@wecr8.info',
    name: 'Organization Admin',
    role: 'organization_admin',
    department: 'Administration',
    organization_id: 'org-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    is_developer: false
  },
  'demo-operator@wecr8.info': {
    id: 'demo-operator-id',
    email: 'demo-operator@wecr8.info',
    name: 'John Operator',
    role: 'operator',
    department: 'cnc-machining',
    organization_id: 'org-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    is_developer: false
  }
};

// Check if demo mode is enabled
const isDemoMode = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string): Promise<{ data: any; error: null } | { data: null; error: string }> {
    try {
      // Check for demo mode
      if (isDemoMode()) {
        // Create a demo user
        const demoUser = {
          id: `demo-${Date.now()}`,
          email,
          name,
          role: 'operator',
          department: 'cnc-machining',
          organization_id: 'org-1',
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('demoUserEmail', email);
        
        return { 
          data: { 
            user: { 
              id: demoUser.id,
              email,
              user_metadata: { name }
            } 
          }, 
          error: null 
        };
      }

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
      if (data.user) {
        try {
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
            // Don't throw here, continue with the process
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
        } catch (err) {
          console.error('Error in post-signup process:', err);
          // Continue with the signup process even if there are errors in the post-signup steps
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
      // Check for demo accounts
      if (isDemoMode() && email in demoAccounts) {
        console.log(`Using demo account for ${email}`);
        
        // Check if demo data has been seeded
        const demoDataSeeded = localStorage.getItem('demoDataSeeded');
        
        if (!demoDataSeeded) {
          // Seed demo data
          console.log('Seeding demo data...');
          const seedResult = await demoService.seedDemoData();
          
          if (seedResult.success) {
            // Mark demo data as seeded
            localStorage.setItem('demoDataSeeded', 'true');
            console.log('Demo data seeded successfully');
          } else {
            console.error('Failed to seed demo data:', seedResult.error);
          }
        }
        
        localStorage.setItem('demoUserEmail', email);
        return { 
          data: { 
            user: { 
              id: demoAccounts[email as keyof typeof demoAccounts].id,
              email: demoAccounts[email as keyof typeof demoAccounts].email
            },
            session: { 
              access_token: 'demo-token',
              refresh_token: 'demo-refresh-token'
            }
          }, 
          error: null 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { error: profileError } = await supabase
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
      // In demo mode, just return success
      if (isDemoMode()) {
        localStorage.removeItem('demoUserEmail');
        return { error: null };
      }

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
      // In demo mode, return a fake session
      if (isDemoMode()) {
        const demoEmail = localStorage.getItem('demoUserEmail');
        if (demoEmail && demoEmail in demoAccounts) {
          return {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh-token',
            user: { 
              id: demoAccounts[demoEmail as keyof typeof demoAccounts].id,
              email: demoEmail
            }
          };
        }
        return null;
      }

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
      // Check for demo mode with active session
      if (isDemoMode()) {
        // Get the email from localStorage if available
        const email = localStorage.getItem('demoUserEmail');
        if (email && email in demoAccounts) {
          return demoAccounts[email as keyof typeof demoAccounts];
        }
        return null;
      }

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
    // In demo mode, don't set up real listeners
    if (isDemoMode()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};