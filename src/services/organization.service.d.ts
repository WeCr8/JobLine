import type { Organization, User, Invite } from '../types';
export declare const organizationService: {
    /**
     * Fetch the current user's organization
     */
    fetchOrganization(): Promise<Organization | null>;
    /**
     * Fetch organization users
     */
    fetchUsers(organizationId: string): Promise<User[]>;
    /**
     * Fetch pending invites
     */
    fetchInvites(organizationId: string): Promise<Invite[]>;
    /**
     * Invite a user to the organization
     */
    inviteUser(organizationId: string, email: string, role: string, department?: string): Promise<Invite | null>;
    /**
     * Cancel an invite
     */
    cancelInvite(inviteId: string): Promise<boolean>;
    /**
     * Update a user
     */
    updateUser(userId: string, updates: Partial<User>): Promise<boolean>;
    /**
     * Update organization
     */
    updateOrganization(organizationId: string, updates: Partial<Organization>): Promise<boolean>;
    /**
     * Fetch departments
     */
    fetchDepartments(): Promise<any[]>;
    /**
     * Add a department
     */
    addDepartment(department: any): Promise<any | null>;
};
