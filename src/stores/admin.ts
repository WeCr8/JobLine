import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/admin.service';
import type { 
  SubscriptionPlan, 
  Subscription, 
  Organization, 
  SystemLog, 
  Analytics, 
  SystemSettings 
} from '../types/admin';
import type { User } from '../types';
import type { UserRole } from '../types/index';

export type { Organization, SubscriptionPlan, SystemSettings, SystemLog, Analytics };
export type { User, Subscription, Invoice } from '../types/admin';

export const useAdminStore = defineStore('admin', () => {
  const subscriptionPlans = ref<SubscriptionPlan[]>([]);
  const activeSubscriptions = ref<Subscription[]>([]);
  const users = ref<User[]>([]);
  const organizations = ref<Organization[]>([]);
  const systemLogs = ref<SystemLog[]>([]);
  const analytics = ref<Analytics>({
    totalRevenue: 0,
    revenueGrowth: 0,
    activeUsers: 0,
    userGrowth: 0,
    conversionRate: 0,
    conversionGrowth: 0,
    churnRate: 0,
    churnChange: 0,
    monthlyRevenue: [],
    monthlyUsers: [],
    planDistribution: {}
  });
  const systemSettings = ref<SystemSettings>({
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    openaiApiKey: '',
    ai: {
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 30000
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retentionDays: 30
    }
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const flaggedIssues = ref<any[]>([]);

  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
    loading.value = true;
    error.value = null;

    try {
      const plans = await adminService.fetchSubscriptionPlans();
      subscriptionPlans.value = plans;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching subscription plans:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch active subscriptions
  const fetchActiveSubscriptions = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would fetch from the database with a join
      // For now, we'll use mock data
      activeSubscriptions.value = [
        {
          id: '1',
          userId: 'user-1',
          userName: 'John Smith',
          userEmail: 'john@example.com',
          customerId: 'cus_123456',
          subscriptionId: 'sub_123456',
          planName: 'Basic Plan',
          priceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
          status: 'active',
          startDate: '2024-01-01T00:00:00Z',
          nextBillingDate: '2024-02-01T00:00:00Z',
          amount: 2999,
          interval: 'monthly',
          cancelAtPeriodEnd: false,
          paymentMethodBrand: 'visa',
          paymentMethodLast4: '4242',
          customerSince: '2024-01-01T00:00:00Z',
          invoices: [
            {
              id: 'in_123456',
              date: '2024-01-01T00:00:00Z',
              amount: 2999,
              status: 'paid'
            }
          ]
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          customerId: 'cus_234567',
          subscriptionId: 'sub_234567',
          planName: 'Pro Plan',
          priceId: 'price_2RbnOfE7qtcuEIptjDemZiVn',
          status: 'active',
          startDate: '2024-01-15T00:00:00Z',
          nextBillingDate: '2024-02-15T00:00:00Z',
          amount: 4999,
          interval: 'monthly',
          cancelAtPeriodEnd: false,
          paymentMethodBrand: 'mastercard',
          paymentMethodLast4: '5678',
          customerSince: '2024-01-15T00:00:00Z',
          invoices: [
            {
              id: 'in_234567',
              date: '2024-01-15T00:00:00Z',
              amount: 4999,
              status: 'paid'
            }
          ]
        }
      ];
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching active subscriptions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const fetchedUsers = await adminService.fetchUsers();
      users.value = fetchedUsers.map(u => ({ ...u, role: u.role as UserRole }));
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching users:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch organizations
  const fetchOrganizations = async () => {
    loading.value = true;
    error.value = null;

    try {
      const fetchedOrgs = await adminService.fetchOrganizations();
      organizations.value = fetchedOrgs;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching organizations:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would calculate analytics from database data
      // For now, we'll use mock data
      analytics.value = {
        totalRevenue: 12500,
        revenueGrowth: 15,
        activeUsers: 85,
        userGrowth: 12,
        conversionRate: 8.5,
        conversionGrowth: 2.3,
        churnRate: 3.2,
        churnChange: -0.5,
        monthlyRevenue: [8500, 9200, 10100, 9800, 11200, 12500],
        monthlyUsers: [65, 70, 72, 78, 80, 85],
        planDistribution: {
          'Basic Plan': 45,
          'Pro Plan': 28,
          'Enterprise Plan': 12
        }
      };
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching analytics:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch system settings
  const fetchSystemSettings = async () => {
    loading.value = true;
    error.value = null;

    try {
      const settings = await adminService.fetchSystemSettings();
      if (settings) {
        systemSettings.value = settings;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching system settings:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch system logs
  const fetchSystemLogs = async (limit: number = 100) => {
    loading.value = true;
    error.value = null;

    try {
      const logs = await adminService.fetchSystemLogs(limit);
      systemLogs.value = logs;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching system logs:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch flagged consistency/data issues
  const fetchFlaggedIssues = async () => {
    loading.value = true;
    error.value = null;
    try {
      flaggedIssues.value = await adminService.fetchConsistencyFlags();
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching flagged issues:', err);
    } finally {
      loading.value = false;
    }
  };

  // Create or update subscription plan
  const saveSubscriptionPlan = async (plan: SubscriptionPlan) => {
    loading.value = true;
    error.value = null;

    try {
      const savedPlan = await adminService.saveSubscriptionPlan(plan);
      
      if (!savedPlan) {
        throw new Error('Failed to save subscription plan');
      }
      
      if (plan.id) {
        // Update in local state
        const index = subscriptionPlans.value.findIndex(p => p.id === plan.id);
        if (index !== -1) {
          subscriptionPlans.value[index] = savedPlan;
        }
      } else {
        // Add to local state
        subscriptionPlans.value.push(savedPlan);
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error saving subscription plan:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update user
  const updateUser = async (user: User) => {
    loading.value = true;
    error.value = null;

    try {
      user.role = user.role as UserRole;
      const success = await adminService.updateUser(user);
      
      if (!success) {
        throw new Error('Failed to update user');
      }

      // Update in local state
      const index = users.value.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users.value[index] = { ...user };
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create or update organization
  const saveOrganization = async (organization: Organization) => {
    loading.value = true;
    error.value = null;

    try {
      const savedOrg = await adminService.saveOrganization(organization);
      
      if (!savedOrg) {
        throw new Error('Failed to save organization');
      }

      if (organization.id) {
        // Update in local state
        const index = organizations.value.findIndex(o => o.id === organization.id);
        if (index !== -1) {
          organizations.value[index] = { ...savedOrg };
        }
      } else {
        // Add to local state
        organizations.value.push(savedOrg);
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error saving organization:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Cancel subscription
  const cancelSubscription = async (subscriptionId: string) => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would call the Stripe API to cancel the subscription
      // and update the database
      
      // For now, we'll just update the local state
      const index = activeSubscriptions.value.findIndex(s => s.subscriptionId === subscriptionId);
      if (index !== -1) {
        activeSubscriptions.value[index].status = 'canceled';
        activeSubscriptions.value[index].cancelAtPeriodEnd = true;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error cancelling subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Save system settings
  const saveSystemSettings = async (settings: SystemSettings) => {
    loading.value = true;
    error.value = null;

    try {
      const success = await adminService.saveSystemSettings(settings);
      
      if (!success) {
        throw new Error('Failed to save system settings');
      }
      
      // Update local state
      systemSettings.value = { ...settings };
    } catch (err: any) {
      error.value = err.message;
      console.error('Error saving system settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Trigger manual backup
  const triggerManualBackup = async () => {
    loading.value = true;
    error.value = null;

    try {
      const success = await adminService.triggerManualBackup();
      
      if (!success) {
        throw new Error('Failed to trigger manual backup');
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error triggering manual backup:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const totalUsers = computed(() => users.value.length);
  const activeUsers = computed(() => users.value.filter(u => u.is_active).length);
  const totalRevenue = computed(() => {
    return activeSubscriptions.value.reduce((total, sub) => total + sub.amount, 0);
  });
  const platformAdmins = computed(() => {
    return users.value.filter(u => u.role === 'admin' && !u.organization_id);
  });
  const organizationAdmins = computed(() => {
    return users.value.filter(u => u.role === 'organization_admin');
  });

  return {
    subscriptionPlans,
    activeSubscriptions,
    users,
    organizations,
    systemLogs,
    analytics,
    systemSettings,
    loading,
    error,
    totalUsers,
    activeUsers,
    totalRevenue,
    platformAdmins,
    organizationAdmins,
    flaggedIssues,
    fetchSubscriptionPlans,
    fetchActiveSubscriptions,
    fetchUsers,
    fetchOrganizations,
    fetchAnalytics,
    fetchSystemSettings,
    fetchSystemLogs,
    fetchFlaggedIssues,
    saveSubscriptionPlan,
    updateUser,
    saveOrganization,
    cancelSubscription,
    saveSystemSettings,
    triggerManualBackup
  };
});