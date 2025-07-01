import { supabase } from './api.service.ts';
import type { Product } from '../stripe-config';

export const subscriptionService = {
  /**
   * Fetch the current user's subscription
   */
  async fetchSubscription() {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error fetching subscription:', err);
      throw err;
    }
  },

  /**
   * Fetch the user's order history
   */
  async fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  },

  /**
   * Create a checkout session for subscription or one-time payment
   */
  async createCheckoutSession(product: Product) {
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
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  },

  /**
   * Cancel the current subscription
   */
  async cancelSubscription() {
    try {
      // This would typically be handled by a separate edge function
      // For now, we'll just throw an error
      throw new Error('Please contact support to cancel your subscription');
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      throw err;
    }
  }
};