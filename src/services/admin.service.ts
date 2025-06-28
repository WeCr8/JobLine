import { supabase, handleApiError } from './api.service';
import type { 
  SubscriptionPlan, 
  Organization, 
  User, 
  SystemSettings,
  SystemLog
} from '../types/admin';

export const adminService = {
  /**
   * Fetch all subscription plans
   */
  async fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*');

      if (error) throw error;
      
      return (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval as 'monthly' | 'yearly',
        stripePriceId: plan.stripe_price_id,
        active: plan.is_active,
        features: plan.features || [],
        subscriberCount: plan.subscriber_count || 0,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      }));
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      return [];
    }
  },

  /**
   * Fetch all users
   */
  async fetchUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  /**
   * Fetch all organizations
   */
  async fetchOrganizations(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          users:organization_users(*)
        `);

      if (error) throw error;
      
      return (data || []).map(org => ({
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
    } catch (err) {
      console.error('Error fetching organizations:', err);
      return [];
    }
  },

  /**
   * Fetch system logs
   */
  async fetchSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      return (data || []).map(log => ({
        id: log.id,
        level: log.level,
        message: log.message,
        context: log.context,
        userId: log.user_id,
        ipAddress: log.ip_address,
        timestamp: log.timestamp
      }));
    } catch (err) {
      console.error('Error fetching system logs:', err);
      return [];
    }
  },

  /**
   * Fetch system settings
   */
  async fetchSystemSettings(): Promise<SystemSettings | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      // Process settings into the expected format
      const settingsMap: Record<string, string> = {};
      data.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });

      return {
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
    } catch (err) {
      console.error('Error fetching system settings:', err);
      return null;
    }
  },

  /**
   * Save subscription plan
   */
  async saveSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan | null> {
    try {
      if (plan.id) {
        // Update existing plan
        const { error } = await supabase
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

        if (error) throw error;

        return plan;
      } else {
        // Create new plan
        const { data, error } = await supabase
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

        if (error) throw error;

        if (!data) return null;

        return {
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
      }
    } catch (err) {
      console.error('Error saving subscription plan:', err);
      return null;
    }
  },

  /**
   * Update user
   */
  async updateUser(user: User): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: user.name,
          role: user.role,
          department: user.department,
          is_active: user.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  },

  /**
   * Save organization
   */
  async saveOrganization(organization: Organization): Promise<Organization | null> {
    try {
      if (organization.id) {
        // Update existing organization
        const { error } = await supabase
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

        if (error) throw error;

        return organization;
      } else {
        // Create new organization
        const { data, error } = await supabase
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
          maxUsers: data.max_users,
          currentUserCount: 0,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    } catch (err) {
      console.error('Error saving organization:', err);
      return null;
    }
  },

  /**
   * Save system settings
   */
  async saveSystemSettings(settings: SystemSettings): Promise<boolean> {
    try {
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

      return true;
    } catch (err) {
      console.error('Error saving system settings:', err);
      return false;
    }
  },

  /**
   * Trigger manual backup
   */
  async triggerManualBackup(): Promise<boolean> {
    try {
      // In a real app, you would trigger a backup process via an API call
      // For now, we'll just log a system event
      const { error } = await supabase
        .from('system_logs')
        .insert({
          level: 'INFO',
          message: 'Manual backup triggered by admin',
          context: { source: 'admin-panel', type: 'manual-backup' }
        });

      if (error) throw error;

      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (err) {
      console.error('Error triggering manual backup:', err);
      return false;
    }
  }
};