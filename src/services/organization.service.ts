import { supabase } from './api.service.ts';
import type { Organization, User, Invite } from '../types';

export const organizationService = {
  /**
   * Fetch the current user's organization
   */
  async fetchOrganization(): Promise<Organization | null> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Get user details including organization_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      if (!userData?.organization_id) return null;
      
      // Fetch organization details
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.organization_id)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        industry: data.industry,
        address: data.address,
        phone: data.phone,
        website: data.website,
        logoUrl: data.logo_url,
        primaryContactName: data.primary_contact_name,
        primaryContactEmail: data.primary_contact_email,
        primaryContactPhone: data.primary_contact_phone,
        subscriptionId: data.subscription_id,
        subscriptionStatus: data.subscription_status,
        planId: data.plan_id,
        maxUsers: data.max_users,
        currentUserCount: data.current_user_count,
        settings: data.settings,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error fetching organization:', err);
      return null;
    }
  },

  /**
   * Fetch organization users
   */
  async fetchUsers(organizationId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching organization users:', err);
      return [];
    }
  },

  /**
   * Fetch pending invites
   */
  async fetchInvites(organizationId: string): Promise<Invite[]> {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      return data.map(invite => ({
        id: invite.id,
        organizationId: invite.organization_id,
        email: invite.email,
        role: invite.role,
        department: invite.department,
        status: invite.status,
        createdBy: invite.created_by,
        createdAt: invite.created_at,
        expiresAt: invite.expires_at
      })) || [];
    } catch (err) {
      console.error('Error fetching invites:', err);
      return [];
    }
  },

  /**
   * Invite a user to the organization
   */
  async inviteUser(organizationId: string, email: string, role: string, department?: string): Promise<Invite | null> {
    try {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('invites')
        .insert({
          organization_id: organizationId,
          email,
          role,
          department,
          created_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        organizationId: data.organization_id,
        email: data.email,
        role: data.role,
        department: data.department,
        status: data.status,
        createdBy: data.created_by,
        createdAt: data.created_at,
        expiresAt: data.expires_at
      };
    } catch (err) {
      console.error('Error inviting user:', err);
      return null;
    }
  },

  /**
   * Cancel an invite
   */
  async cancelInvite(inviteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error cancelling invite:', err);
      return false;
    }
  },

  /**
   * Update a user
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          role: updates.role,
          department: updates.department,
          is_active: updates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  },

  /**
   * Update organization
   */
  async updateOrganization(organizationId: string, updates: Partial<Organization>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: updates.name,
          industry: updates.industry,
          address: updates.address,
          phone: updates.phone,
          website: updates.website,
          logo_url: updates.logoUrl,
          primary_contact_name: updates.primaryContactName,
          primary_contact_email: updates.primaryContactEmail,
          primary_contact_phone: updates.primaryContactPhone,
          settings: updates.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating organization:', err);
      return false;
    }
  },

  /**
   * Fetch departments
   */
  async fetchDepartments(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching departments:', err);
      return [];
    }
  },

  /**
   * Add a department
   */
  async addDepartment(department: any): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          id: department.id,
          name: department.name,
          description: department.description,
          department_type: department.department_type,
          supervisor_id: department.supervisor_id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error adding department:', err);
      return null;
    }
  }
};