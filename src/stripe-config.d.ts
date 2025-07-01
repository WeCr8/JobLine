export interface Product {
    id: string;
    priceId: string;
    name: string;
    description: string;
    mode: 'payment' | 'subscription';
}
export declare const products: Product[];
