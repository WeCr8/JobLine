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
export declare const useSubscriptionStore: import("pinia").StoreDefinition<"subscription", Pick<{
    subscription: import("vue").Ref<{
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null, Subscription | {
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null>;
    orders: import("vue").Ref<{
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
    }[], Order[] | {
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
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPlan: import("vue").ComputedRef<Product | null>;
    isSubscribed: import("vue").ComputedRef<boolean>;
    fetchSubscription: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    createCheckoutSession: (product: Product) => Promise<void>;
    cancelSubscription: () => Promise<void>;
}, "error" | "loading" | "subscription" | "orders">, Pick<{
    subscription: import("vue").Ref<{
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null, Subscription | {
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null>;
    orders: import("vue").Ref<{
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
    }[], Order[] | {
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
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPlan: import("vue").ComputedRef<Product | null>;
    isSubscribed: import("vue").ComputedRef<boolean>;
    fetchSubscription: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    createCheckoutSession: (product: Product) => Promise<void>;
    cancelSubscription: () => Promise<void>;
}, "currentPlan" | "isSubscribed">, Pick<{
    subscription: import("vue").Ref<{
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null, Subscription | {
        customer_id: string;
        subscription_id: string | null;
        subscription_status: string;
        price_id: string | null;
        current_period_start: number | null;
        current_period_end: number | null;
        cancel_at_period_end: boolean;
        payment_method_brand: string | null;
        payment_method_last4: string | null;
    } | null>;
    orders: import("vue").Ref<{
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
    }[], Order[] | {
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
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPlan: import("vue").ComputedRef<Product | null>;
    isSubscribed: import("vue").ComputedRef<boolean>;
    fetchSubscription: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    createCheckoutSession: (product: Product) => Promise<void>;
    cancelSubscription: () => Promise<void>;
}, "fetchSubscription" | "fetchOrders" | "createCheckoutSession" | "cancelSubscription">>;
export {};
