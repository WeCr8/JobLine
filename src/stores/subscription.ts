import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { subscriptionService } from '../services/subscription.service';
import { products } from '../stripe-config';
import type { Product } from '../stripe-config';

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
      const data = await subscriptionService.fetchSubscription();
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
      const data = await subscriptionService.fetchOrders();
      orders.value = data;
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
      await subscriptionService.createCheckoutSession(product);
    } catch (err: any) {
      error.value = err.message;
      console.error('Error creating checkout session:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelSubscription = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await subscriptionService.cancelSubscription();
    } catch (err: any) {
      error.value = err.message;
      console.error('Error cancelling subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
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