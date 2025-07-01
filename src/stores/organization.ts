import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { organizationService } from '../services/organization.service';
import type { Organization, Invite, User } from '../types';
import { useAuthStore } from './auth';

export const useOrganizationStore = defineStore('organization', () => {
  const organization = ref<Organization | null>(null);
  const users = ref<User[]>([]);
  const invites = ref<Invite[]>([]);
  const departments = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  // Fetch current user's organization
  const fetchOrganization = async () => {
    loading.value = true;
    error.value = null;

    try {
      const org = await organizationService.fetchOrganization();
      organization.value = org;
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
      const fetchedUsers = await organizationService.fetchUsers(organization.value.id);
      users.value = fetchedUsers;
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
      const fetchedInvites = await organizationService.fetchInvites(organization.value.id);
      invites.value = fetchedInvites;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching invites:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    loading.value = true;
    error.value = null;

    try {
      const fetchedDepartments = await organizationService.fetchDepartments();
      departments.value = fetchedDepartments;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching departments:', err);
    } finally {
      loading.value = false;
    }
  };

  // Update organization
  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!organization.value) return false;
    
    loading.value = true;
    error.value = null;

    try {
      const success = await organizationService.updateOrganization(authStore.user, organization.value.id, updates);
      
      if (success && organization.value) {
        organization.value = { ...organization.value, ...updates };
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating organization:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Invite user to organization
  const inviteUser = async (email: string, role: string, department?: string) => {
    if (!organization.value) return null;
    
    loading.value = true;
    error.value = null;

    try {
      const invite = await organizationService.inviteUser(authStore.user, organization.value.id, email, role, department);
      
      if (invite) {
        invites.value.push(invite);
      }
      
      return invite;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error inviting user:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Cancel invite
  const cancelInvite = async (inviteId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const success = await organizationService.cancelInvite(authStore.user, inviteId);
      
      if (success) {
        invites.value = invites.value.filter(invite => invite.id !== inviteId);
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error cancelling invite:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Update user
  const updateUser = async (userId: string, updates: Partial<User>) => {
    loading.value = true;
    error.value = null;

    try {
      const success = await organizationService.updateUser(authStore.user, userId, updates);
      
      if (success) {
        const index = users.value.findIndex(u => u.id === userId);
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...updates };
        }
      }
      
      return success;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating user:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Add department
  const addDepartment = async (department: any) => {
    loading.value = true;
    error.value = null;

    try {
      const newDept = await organizationService.addDepartment(authStore.user, department);
      
      if (newDept) {
        departments.value.push(newDept);
      }
      
      return newDept;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error adding department:', err);
      return null;
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