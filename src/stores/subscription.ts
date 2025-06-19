import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { products } from '../stripe-config';
import type { Product } from '../stripe-config';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

interface Order {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscription = ref<Subscription | null>(null);
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPlan = computed(() => {
    if (!subscription.value?.price_id) return null;
    return products.find(p => p.priceId === subscription.value?.price_id) || null;
  });

  const isSubscribed = computed(() => {
    return subscription.value?.subscription_status === 'active';
  });

  const fetchSubscription = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (fetchError) throw fetchError;

      subscription.value = data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching subscription:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (fetchError) throw fetchError;

      orders.value = data || [];
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching orders:', err);
    } finally {
      loading.value = false;
    }
  };

  const createCheckoutSession = async (product: Product) => {
    loading.value = true;
    error.value = null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error creating checkout session:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelSubscription = async () => {
    // This would typically be handled by a separate edge function
    // For now, we'll just show an error message
    error.value = 'Please contact support to cancel your subscription';
  };

  return {
    subscription,
    orders,
    loading,
    error,
    currentPlan,
    isSubscribed,
    fetchSubscription,
    fetchOrders,
    createCheckoutSession,
    cancelSubscription
  };
});