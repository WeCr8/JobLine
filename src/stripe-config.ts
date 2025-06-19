export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SWr6L23oStl7B4',
    priceId: 'price_1RbnOfE7qtcuEIptjDemZiVn',
    name: 'JobLine.ai',
    description: 'JobLine.ai',
    mode: 'subscription'
  }
];