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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface AdminAnalytics {
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

export interface AppSettings {
  appName: string;
  supportEmail: string;
  defaultRole: string;
  defaultDepartment: string;
  features: {
    enableVoice: boolean;
    enableImageRecognition: boolean;
    enablePerformanceModule: boolean;
    enableOptimizationModule: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
  };
}

export interface SystemInfo {
  version: string;
  environment: string;
  lastUpdated: string;
  database: {
    status: string;
    size: string;
    lastBackup: string;
  };
  logs: SystemLog[];
}

export interface SystemLog {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  timestamp: string;
  message: string;
}