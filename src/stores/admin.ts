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

export const useAdminStore = defineStore('admin', () => {
  const subscriptionPlans = ref<SubscriptionPlan[]>([]);
  const activeSubscriptions = ref<Subscription[]>([]);
  const users = ref<User[]>([]);
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
      // const { data, error: fetchError } = await supabase
      //   .from('subscription_plans')
      //   .select('*');

      // if (fetchError) throw fetchError;
      // subscriptionPlans.value = data;

      // For now, we'll use mock data
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
      // In a real app, you would fetch from the database
      // const { data, error: fetchError } = await supabase
      //   .from('stripe_subscriptions')
      //   .select(`
      //     *,
      //     customers:stripe_customers(user_id)
      //   `)
      //   .eq('status', 'active');

      // if (fetchError) throw fetchError;
      // activeSubscriptions.value = data;

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
      // In a real app, you would fetch from the database
      // const { data, error: fetchError } = await supabase
      //   .from('users')
      //   .select('*');

      // if (fetchError) throw fetchError;
      // users.value = data;

      // For now, we'll use mock data
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
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching users:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would fetch from the database or analytics service
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
      // In a real app, you would fetch from the database
      // For now, we'll use mock data
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
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching system settings:', err);
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
        // const { error: updateError } = await supabase
        //   .from('subscription_plans')
        //   .update({
        //     name: plan.name,
        //     description: plan.description,
        //     price: plan.price,
        //     interval: plan.interval,
        //     stripe_price_id: plan.stripePriceId,
        //     active: plan.active,
        //     features: plan.features,
        //     updated_at: new Date().toISOString()
        //   })
        //   .eq('id', plan.id);

        // if (updateError) throw updateError;

        // Update in local state
        const index = subscriptionPlans.value.findIndex(p => p.id === plan.id);
        if (index !== -1) {
          subscriptionPlans.value[index] = { ...plan };
        }
      } else {
        // Create new plan
        // const { data, error: insertError } = await supabase
        //   .from('subscription_plans')
        //   .insert({
        //     name: plan.name,
        //     description: plan.description,
        //     price: plan.price,
        //     interval: plan.interval,
        //     stripe_price_id: plan.stripePriceId,
        //     active: plan.active,
        //     features: plan.features,
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString()
        //   })
        //   .select()
        //   .single();

        // if (insertError) throw insertError;

        // Add to local state
        const newPlan = {
          ...plan,
          id: Date.now().toString(),
          subscriberCount: 0
        };
        subscriptionPlans.value.push(newPlan);
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
      // In a real app, you would update in the database
      // const { error: updateError } = await supabase
      //   .from('users')
      //   .update({
      //     name: user.name,
      //     role: user.role,
      //     department: user.department,
      //     is_active: user.is_active,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', user.id);

      // if (updateError) throw updateError;

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

  // Cancel subscription
  const cancelSubscription = async (subscriptionId: string) => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, you would call the Stripe API to cancel the subscription
      // and update the database
      
      // Update in local state
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
      // In a real app, you would trigger a backup process
      console.log('Manual backup triggered');
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

  return {
    subscriptionPlans,
    activeSubscriptions,
    users,
    analytics,
    systemSettings,
    loading,
    error,
    totalUsers,
    activeUsers,
    totalRevenue,
    fetchSubscriptionPlans,
    fetchActiveSubscriptions,
    fetchUsers,
    fetchAnalytics,
    fetchSystemSettings,
    saveSubscriptionPlan,
    updateUser,
    cancelSubscription,
    saveSystemSettings,
    triggerManualBackup
  };
});