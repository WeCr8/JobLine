import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';
import type { Organization, OrganizationUser, Invite, User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useOrganizationStore = defineStore('organization', () => {
  const organization = ref<Organization | null>(null);
  const users = ref<User[]>([]);
  const invites = ref<Invite[]>([]);
  const departments = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch current user's organization
  const fetchOrganization = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Get the current user's organization_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Get user details including organization_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      if (!userData?.organization_id) throw new Error('User not associated with an organization');
      
      // Fetch organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.organization_id)
        .single();
      
      if (orgError) throw orgError;
      
      if (orgData) {
        organization.value = {
          id: orgData.id,
          name: orgData.name,
          industry: orgData.industry,
          address: orgData.address,
          phone: orgData.phone,
          website: orgData.website,
          logoUrl: orgData.logo_url,
          primaryContactName: orgData.primary_contact_name,
          primaryContactEmail: orgData.primary_contact_email,
          primaryContactPhone: orgData.primary_contact_phone,
          subscriptionId: orgData.subscription_id,
          subscriptionStatus: orgData.subscription_status,
          planId: orgData.plan_id,
          maxUsers: orgData.max_users,
          currentUserCount: orgData.current_user_count,
          settings: orgData.settings,
          isActive: orgData.is_active,
          createdAt: orgData.created_at,
          updatedAt: orgData.updated_at
        };
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching organization:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch organization users
  const fetchUsers = async () => {
    if (!organization.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organization.value.id);
      
      if (fetchError) throw fetchError;
      
      if (data) {
        users.value = data;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching organization users:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch pending invites
  const fetchInvites = async () => {
    if (!organization.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('invites')
        .select('*')
        .eq('organization_id', organization.value.id)
        .eq('status', 'pending');
      
      if (fetchError) throw fetchError;
      
      if (data) {
        invites.value = data.map(invite => ({
          id: invite.id,
          organizationId: invite.organization_id,
          email: invite.email,
          role: invite.role,
          department: invite.department,
          status: invite.status,
          createdBy: invite.created_by,
          createdAt: invite.created_at,
          expiresAt: invite.expires_at
        }));
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching invites:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    if (!organization.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('departments')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      if (data) {
        departments.value = data;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching departments:', err);
    } finally {
      loading.value = false;
    }
  };

  // Update organization
  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!organization.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      const { error: updateError } = await supabase
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
        .eq('id', organization.value.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      if (organization.value) {
        organization.value = { ...organization.value, ...updates };
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating organization:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Invite user to organization
  const inviteUser = async (email: string, role: string, department?: string) => {
    if (!organization.value) return;
    
    loading.value = true;
    error.value = null;

    try {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error: inviteError } = await supabase
        .from('invites')
        .insert({
          organization_id: organization.value.id,
          email,
          role,
          department,
          created_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .select()
        .single();
      
      if (inviteError) throw inviteError;
      
      if (data) {
        // Add to local state
        invites.value.push({
          id: data.id,
          organizationId: data.organization_id,
          email: data.email,
          role: data.role,
          department: data.department,
          status: data.status,
          createdBy: data.created_by,
          createdAt: data.created_at,
          expiresAt: data.expires_at
        });
      }
      
      // In a real app, you would also send an email to the invited user
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error inviting user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Cancel invite
  const cancelInvite = async (inviteId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);
      
      if (deleteError) throw deleteError;
      
      // Update local state
      invites.value = invites.value.filter(invite => invite.id !== inviteId);
    } catch (err: any) {
      error.value = err.message;
      console.error('Error cancelling invite:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update user
  const updateUser = async (userId: string, updates: Partial<User>) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: updates.name,
          role: updates.role,
          department: updates.department,
          is_active: updates.is_active
        })
        .eq('id', userId)
        .eq('organization_id', organization.value?.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      const index = users.value.findIndex(u => u.id === userId);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updates };
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Add department
  const addDepartment = async (department: any) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: addError } = await supabase
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
      
      if (addError) throw addError;
      
      if (data) {
        // Add to local state
        departments.value.push(data);
      }
      
      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error adding department:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const organizationName = computed(() => organization.value?.name || 'Organization');
  const userCount = computed(() => users.value.length);
  const activeUserCount = computed(() => users.value.filter(u => u.is_active).length);
  const pendingInviteCount = computed(() => invites.value.length);

  return {
    organization,
    users,
    invites,
    departments,
    loading,
    error,
    organizationName,
    userCount,
    activeUserCount,
    pendingInviteCount,
    fetchOrganization,
    fetchUsers,
    fetchInvites,
    fetchDepartments,
    updateOrganization,
    inviteUser,
    cancelInvite,
    updateUser,
    addDepartment
  };
});