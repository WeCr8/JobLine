import type { Product } from '../stripe-config';
export declare const subscriptionService: {
    /**
     * Fetch the current user's subscription
     */
    fetchSubscription(): Promise<any>;
    /**
     * Fetch the user's order history
     */
    fetchOrders(): Promise<any[]>;
    /**
     * Create a checkout session for subscription or one-time payment
     */
    createCheckoutSession(product: Product): Promise<void>;
    /**
     * Cancel the current subscription
     */
    cancelSubscription(): Promise<never>;
};
