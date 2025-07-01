import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { subscriptionService } from '../services/subscription.service';
import { products } from '../stripe-config';
export const useSubscriptionStore = defineStore('subscription', () => {
    const subscription = ref(null);
    const orders = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPlan = computed(() => {
        if (!subscription.value?.price_id)
            return null;
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
        }
        catch (err) {
            error.value = err.message;
            console.error('Error fetching subscription:', err);
        }
        finally {
            loading.value = false;
        }
    };
    const fetchOrders = async () => {
        loading.value = true;
        error.value = null;
        try {
            const data = await subscriptionService.fetchOrders();
            orders.value = data;
        }
        catch (err) {
            error.value = err.message;
            console.error('Error fetching orders:', err);
        }
        finally {
            loading.value = false;
        }
    };
    const createCheckoutSession = async (product) => {
        loading.value = true;
        error.value = null;
        try {
            await subscriptionService.createCheckoutSession(product);
        }
        catch (err) {
            error.value = err.message;
            console.error('Error creating checkout session:', err);
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    const cancelSubscription = async () => {
        loading.value = true;
        error.value = null;
        try {
            await subscriptionService.cancelSubscription();
        }
        catch (err) {
            error.value = err.message;
            console.error('Error cancelling subscription:', err);
            throw err;
        }
        finally {
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
