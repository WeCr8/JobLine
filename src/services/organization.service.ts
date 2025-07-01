import { supabase } from './api.service';
import type { Organization, User, Invite } from '../types';
import { canAccess } from '../utils/security.utils';
import { logAudit, logConsistencyFlag } from './api.service';

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
  async inviteUser(user: any, organizationId: string, email: string, role: string, department?: string): Promise<Invite | null> {
    try {
      // Permission check
      if (!canAccess(user, 'organization:invite', { organizationId })) {
        await logConsistencyFlag({
          type: 'permission',
          severity: 'error',
          resourceType: 'organization',
          resourceId: organizationId,
          context: { user, email, role, department },
          detectedBy: 'organizationService.inviteUser',
          notes: 'Permission denied: organization:invite.'
        });
        return null;
      }
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
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'organization.inviteUser',
        resourceType: 'organization',
        resourceId: organizationId,
        before: null,
        after: { invite: data },
        reason: `Invited user ${email} as ${role}`
      });
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
  async cancelInvite(user: any, inviteId: string): Promise<boolean> {
    try {
      // Fetch invite for permission check
      const { data: invite, error: fetchError } = await supabase
        .from('invites')
        .select('*')
        .eq('id', inviteId)
        .single();
      if (fetchError) throw fetchError;
      if (!canAccess(user, 'organization:cancelInvite', invite)) {
        await logConsistencyFlag({
          type: 'permission',
          severity: 'error',
          resourceType: 'invite',
          resourceId: inviteId,
          context: { user, invite },
          detectedBy: 'organizationService.cancelInvite',
          notes: 'Permission denied: organization:cancelInvite.'
        });
        return false;
      }
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);
      if (error) throw error;
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'organization.cancelInvite',
        resourceType: 'invite',
        resourceId: inviteId,
        before: invite,
        after: null,
        reason: 'Invite cancelled.'
      });
      return true;
    } catch (err) {
      console.error('Error cancelling invite:', err);
      return false;
    }
  },

  /**
   * Update a user
   */
  async updateUser(user: any, userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      // Fetch target user for permission check and before state
      const { data: targetUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (fetchError) throw fetchError;
      if (!canAccess(user, 'user:update', targetUser)) {
        await logConsistencyFlag({
          type: 'permission',
          severity: 'error',
          resourceType: 'user',
          resourceId: userId,
          context: { user, targetUser, updates },
          detectedBy: 'organizationService.updateUser',
          notes: 'Permission denied: user:update.'
        });
        return false;
      }
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
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'user.update',
        resourceType: 'user',
        resourceId: userId,
        before: targetUser,
        after: { ...targetUser, ...updates },
        reason: 'User updated.'
      });
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  },

  /**
   * Update organization
   */
  async updateOrganization(user: any, organizationId: string, updates: Partial<Organization>): Promise<boolean> {
    try {
      // Fetch current org for before state and permission check
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();
      if (orgError) throw orgError;
      if (!canAccess(user, 'organization:update', org)) {
        throw new Error('Permission denied: organization:update');
      }
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
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'organization.update',
        resourceType: 'organization',
        resourceId: organizationId,
        before: org,
        after: { ...org, ...updates },
        // No explicit reason field in updates
      });
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
  async addDepartment(user: any, department: any): Promise<any | null> {
    try {
      // Permission check
      if (!canAccess(user, 'department:add', department)) {
        await logConsistencyFlag({
          type: 'permission',
          severity: 'error',
          resourceType: 'department',
          resourceId: department.id,
          context: { user, department },
          detectedBy: 'organizationService.addDepartment',
          notes: 'Permission denied: department:add.'
        });
        return null;
      }
      // Validation (simple example: require name)
      if (!department.name || typeof department.name !== 'string') {
        await logConsistencyFlag({
          type: 'validation',
          severity: 'error',
          resourceType: 'department',
          resourceId: department.id,
          context: { user, department },
          detectedBy: 'organizationService.addDepartment',
          notes: 'Department validation failed: name is required.'
        });
        return null;
      }
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
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'department.add',
        resourceType: 'department',
        resourceId: department.id,
        before: null,
        after: data,
        reason: 'Department added.'
      });
      return data;
    } catch (err) {
      console.error('Error adding department:', err);
      return null;
    }
  }
};