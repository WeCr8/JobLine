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