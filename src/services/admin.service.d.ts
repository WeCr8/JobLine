import type { SubscriptionPlan, Organization, User, SystemSettings, SystemLog } from '../types/admin';
export declare const adminService: {
    /**
     * Fetch all subscription plans
     */
    fetchSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    /**
     * Fetch all users
     */
    fetchUsers(): Promise<User[]>;
    /**
     * Fetch all organizations
     */
    fetchOrganizations(): Promise<Organization[]>;
    /**
     * Fetch system logs
     */
    fetchSystemLogs(limit?: number): Promise<SystemLog[]>;
    /**
     * Fetch system settings
     */
    fetchSystemSettings(): Promise<SystemSettings | null>;
    /**
     * Save subscription plan
     */
    saveSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan | null>;
    /**
     * Update user
     */
    updateUser(user: User): Promise<boolean>;
    /**
     * Save organization
     */
    saveOrganization(organization: Organization): Promise<Organization | null>;
    /**
     * Save system settings
     */
    saveSystemSettings(settings: SystemSettings): Promise<boolean>;
    /**
     * Trigger manual backup
     */
    triggerManualBackup(): Promise<boolean>;
};
