// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}