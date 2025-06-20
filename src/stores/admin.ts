import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  displayPrice?: number; // for UI display
  interval: 'monthly' | 'yearly';
  stripePriceId: string;
  active: boolean;
  features: string[];
  subscriberCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  customerId: string;
  subscriptionId: string;
  planName: string;
  priceId: string;
  status: string;
  startDate: string;
  nextBillingDate: string;
  amount: number;
  interval: string;
  cancelAtPeriodEnd: boolean;
  paymentMethodBrand?: string;
  paymentMethodLast4?: string;
  customerSince: string;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  organization_id?: string;
}

export interface Organization {
  id: string;
  name: string;
  industry?: string;
  address?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  planId?: string;
  planName?: string;
  maxUsers: number;
  currentUserCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  isAdmin: boolean;
  isPrimary: boolean;
  joinedAt: string;
}

export interface Analytics {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  userGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
  churnRate: number;
  churnChange: number;
  monthlyRevenue: number[];
  monthlyUsers: number[];
  planDistribution: Record<string, number>;
}

export interface SystemSettings {
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  openaiApiKey: string;
  ai: {
    defaultModel: string;
    temperature: number;
    maxTokens: number;
    timeout: number;
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retentionDays: number;
  };
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: any;
  userId?: string;
  ipAddress?: string;
  timestamp: string;
}

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

  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would fetch from the database
      const { data, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('*');

      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        subscriptionPlans.value = data.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          interval: plan.interval,
          stripePriceId: plan.stripe_price_id,
          active: plan.is_active,
          features: plan.features || [],
          subscriberCount: plan.subscriber_count || 0,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at
        }));
      } else {
        // Fallback to mock data if no plans exist
        subscriptionPlans.value = [
          {
            id: '1',
            name: 'Basic Plan',
            description: 'Essential features for small teams',
            price: 2999, // in cents
            interval: 'monthly',
            stripePriceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
            active: true,
            subscriberCount: 45,
            features: [
              'AI-powered job tracking',
              'Real-time machine monitoring',
              'Performance analytics',
              'Voice-enabled assistant',
              'Quality management',
              'Unlimited users'
            ]
          },
          {
            id: '2',
            name: 'Pro Plan',
            description: 'Advanced features for growing teams',
            price: 4999, // in cents
            interval: 'monthly',
            stripePriceId: 'price_2RbnOfE7qtcuEIptjDemZiVn',
            active: true,
            subscriberCount: 28,
            features: [
              'All Basic features',
              'Advanced AI optimization',
              'Custom integrations',
              'Priority support',
              'Advanced reporting',
              'API access'
            ]
          },
          {
            id: '3',
            name: 'Enterprise Plan',
            description: 'Complete solution for large organizations',
            price: 9999, // in cents
            interval: 'monthly',
            stripePriceId: 'price_3RbnOfE7qtcuEIptjDemZiVn',
            active: true,
            subscriberCount: 12,
            features: [
              'All Pro features',
              'Dedicated account manager',
              'Custom AI training',
              'On-premise deployment option',
              'SSO integration',
              'SLA guarantees'
            ]
          }
        ];
      }
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
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('stripe_subscriptions')
        .select(`
          *,
          customers:stripe_customers(*)
        `)
        .eq('status', 'active');

      if (subscriptionsError) throw subscriptionsError;
      
      if (subscriptionsData && subscriptionsData.length > 0) {
        // Process the joined data
        const processedSubscriptions = await Promise.all(subscriptionsData.map(async (sub) => {
          // Get user info
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', sub.customers?.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return null;
          }

          // Get invoices
          const { data: invoicesData, error: invoicesError } = await supabase
            .from('stripe_orders')
            .select('*')
            .eq('customer_id', sub.customer_id)
            .order('created_at', { ascending: false });

          if (invoicesError) {
            console.error('Error fetching invoices:', invoicesError);
          }

          const invoices = invoicesData ? invoicesData.map(invoice => ({
            id: invoice.payment_intent_id,
            date: invoice.created_at,
            amount: invoice.amount_total,
            status: invoice.payment_status
          })) : [];

          return {
            id: sub.id,
            userId: userData?.id || '',
            userName: userData?.name || 'Unknown User',
            userEmail: userData?.email || 'unknown@example.com',
            customerId: sub.customer_id,
            subscriptionId: sub.subscription_id || '',
            planName: 'Subscription Plan', // Would need to join with plans table
            priceId: sub.price_id || '',
            status: sub.status,
            startDate: new Date(sub.current_period_start * 1000).toISOString(),
            nextBillingDate: new Date(sub.current_period_end * 1000).toISOString(),
            amount: 0, // Would need to get from Stripe or plans table
            interval: 'monthly', // Would need to get from plans table
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            paymentMethodBrand: sub.payment_method_brand,
            paymentMethodLast4: sub.payment_method_last4,
            customerSince: sub.created_at,
            invoices
          };
        }));

        activeSubscriptions.value = processedSubscriptions.filter(Boolean) as Subscription[];
      }
      
      // If no subscriptions or error, use mock data
      if (!activeSubscriptions.value.length) {
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
      }
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
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*');

      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        users.value = data;
      } else {
        // Fallback to mock data if no users exist
        users.value = [
          {
            id: 'user-1',
            name: 'John Smith',
            email: 'john@example.com',
            role: 'operator',
            department: 'Manufacturing',
            is_active: true,
            last_login: '2024-01-12T14:30:00Z',
            created_at: '2024-01-01T08:00:00Z'
          },
          {
            id: 'user-2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'manager',
            department: 'Quality Control',
            is_active: true,
            last_login: '2024-01-12T10:15:00Z',
            created_at: '2024-01-05T09:00:00Z'
          },
          {
            id: 'user-3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            role: 'admin',
            department: 'Administration',
            is_active: true,
            last_login: '2024-01-12T16:45:00Z',
            created_at: '2024-01-01T08:00:00Z'
          }
        ];
      }
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
      const { data, error: fetchError } = await supabase
        .from('organizations')
        .select(`
          *,
          users:organization_users(*)
        `);

      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        organizations.value = data.map(org => ({
          id: org.id,
          name: org.name,
          industry: org.industry,
          address: org.address,
          phone: org.phone,
          website: org.website,
          logoUrl: org.logo_url,
          primaryContactName: org.primary_contact_name,
          primaryContactEmail: org.primary_contact_email,
          subscriptionId: org.subscription_id,
          subscriptionStatus: org.subscription_status,
          planId: org.plan_id,
          planName: '', // Would need to join with plans table
          maxUsers: org.max_users,
          currentUserCount: org.current_user_count,
          isActive: org.is_active,
          createdAt: org.created_at,
          updatedAt: org.updated_at
        }));
      }
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
      const { data, error: fetchError } = await supabase
        .from('system_settings')
        .select('*');

      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        // Process settings into the expected format
        const settingsMap: Record<string, string> = {};
        data.forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });

        systemSettings.value = {
          stripeSecretKey: settingsMap.stripe_secret_key || '********',
          stripeWebhookSecret: settingsMap.stripe_webhook_secret || '********',
          openaiApiKey: settingsMap.openai_api_key || '********',
          ai: {
            defaultModel: settingsMap.ai_default_model || 'gpt-4',
            temperature: parseFloat(settingsMap.ai_temperature || '0.7'),
            maxTokens: parseInt(settingsMap.ai_max_tokens || '2000'),
            timeout: parseInt(settingsMap.ai_timeout || '30000')
          },
          backup: {
            enabled: settingsMap.backup_enabled === 'true',
            frequency: settingsMap.backup_frequency || 'daily',
            retentionDays: parseInt(settingsMap.backup_retention_days || '30')
          }
        };
      } else {
        // Fallback to default settings
        systemSettings.value = {
          stripeSecretKey: '********',
          stripeWebhookSecret: '********',
          openaiApiKey: '********',
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
        };
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
      const { data, error: fetchError } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      
      if (data) {
        systemLogs.value = data;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching system logs:', err);
    } finally {
      loading.value = false;
    }
  };

  // Create or update subscription plan
  const saveSubscriptionPlan = async (plan: SubscriptionPlan) => {
    loading.value = true;
    error.value = null;

    try {
      if (plan.id) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from('subscription_plans')
          .update({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
            stripe_price_id: plan.stripePriceId,
            is_active: plan.active,
            features: plan.features,
            updated_at: new Date().toISOString()
          })
          .eq('id', plan.id);

        if (updateError) throw updateError;

        // Update in local state
        const index = subscriptionPlans.value.findIndex(p => p.id === plan.id);
        if (index !== -1) {
          subscriptionPlans.value[index] = { ...plan };
        }
      } else {
        // Create new plan
        const { data, error: insertError } = await supabase
          .from('subscription_plans')
          .insert({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
            stripe_price_id: plan.stripePriceId,
            is_active: plan.active,
            features: plan.features
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        if (data) {
          const newPlan: SubscriptionPlan = {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            interval: data.interval as 'monthly' | 'yearly',
            stripePriceId: data.stripe_price_id,
            active: data.is_active,
            features: data.features || [],
            subscriberCount: 0,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          subscriptionPlans.value.push(newPlan);
        }
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
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: user.name,
          role: user.role,
          department: user.department,
          is_active: user.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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
      if (organization.id) {
        // Update existing organization
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            name: organization.name,
            industry: organization.industry,
            address: organization.address,
            phone: organization.phone,
            website: organization.website,
            logo_url: organization.logoUrl,
            primary_contact_name: organization.primaryContactName,
            primary_contact_email: organization.primaryContactEmail,
            max_users: organization.maxUsers,
            is_active: organization.isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', organization.id);

        if (updateError) throw updateError;

        // Update in local state
        const index = organizations.value.findIndex(o => o.id === organization.id);
        if (index !== -1) {
          organizations.value[index] = { ...organization };
        }
      } else {
        // Create new organization
        const { data, error: insertError } = await supabase
          .from('organizations')
          .insert({
            name: organization.name,
            industry: organization.industry,
            address: organization.address,
            phone: organization.phone,
            website: organization.website,
            logo_url: organization.logoUrl,
            primary_contact_name: organization.primaryContactName,
            primary_contact_email: organization.primaryContactEmail,
            max_users: organization.maxUsers,
            is_active: organization.isActive
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        if (data) {
          const newOrg: Organization = {
            id: data.id,
            name: data.name,
            industry: data.industry,
            address: data.address,
            phone: data.phone,
            website: data.website,
            logoUrl: data.logo_url,
            primaryContactName: data.primary_contact_name,
            primaryContactEmail: data.primary_contact_email,
            maxUsers: data.max_users,
            currentUserCount: 0,
            isActive: data.is_active,
            createdAt: data.created_at
          };
          organizations.value.push(newOrg);
        }
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
      // In a real app, you would save to the database
      // Convert settings object to individual settings records
      const settingsToUpdate = [
        { key: 'stripe_secret_key', value: settings.stripeSecretKey, encrypted: true, category: 'payment' },
        { key: 'stripe_webhook_secret', value: settings.stripeWebhookSecret, encrypted: true, category: 'payment' },
        { key: 'openai_api_key', value: settings.openaiApiKey, encrypted: true, category: 'ai' },
        { key: 'ai_default_model', value: settings.ai.defaultModel, encrypted: false, category: 'ai' },
        { key: 'ai_temperature', value: settings.ai.temperature.toString(), encrypted: false, category: 'ai' },
        { key: 'ai_max_tokens', value: settings.ai.maxTokens.toString(), encrypted: false, category: 'ai' },
        { key: 'ai_timeout', value: settings.ai.timeout.toString(), encrypted: false, category: 'ai' },
        { key: 'backup_enabled', value: settings.backup.enabled.toString(), encrypted: false, category: 'backup' },
        { key: 'backup_frequency', value: settings.backup.frequency, encrypted: false, category: 'backup' },
        { key: 'backup_retention_days', value: settings.backup.retentionDays.toString(), encrypted: false, category: 'backup' }
      ];

      // Update each setting
      for (const setting of settingsToUpdate) {
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({
            value: setting.value,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting.key);

        if (updateError) {
          console.error(`Error updating setting ${setting.key}:`, updateError);
        }
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
      // In a real app, you would trigger a backup process via an API call
      // For now, we'll just log a system event
      const { error: logError } = await supabase
        .from('system_logs')
        .insert({
          level: 'INFO',
          message: 'Manual backup triggered by admin',
          context: { source: 'admin-panel', type: 'manual-backup' }
        });

      if (logError) throw logError;

      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    fetchSubscriptionPlans,
    fetchActiveSubscriptions,
    fetchUsers,
    fetchOrganizations,
    fetchAnalytics,
    fetchSystemSettings,
    fetchSystemLogs,
    saveSubscriptionPlan,
    updateUser,
    saveOrganization,
    cancelSubscription,
    saveSystemSettings,
    triggerManualBackup
  };
});