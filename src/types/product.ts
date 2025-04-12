// src/types/product.ts
export type ProductType = 'Clothing' | 'Accessories';

export interface BaseProduct {
  _id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Clothing extends BaseProduct {
  type: 'Clothing';
  description: string;
  size: string;
  color: string;
  material?: string;
}

export interface Accessories extends BaseProduct {
  type: 'Accessories';
  subType: 'Hammock' | 'Bag';
  size?: string;
  color?: string;
  maxWeight?: number;
  volume?: number;
  material?: string;
}

export type Product = Clothing | Accessories;

export interface CartItem extends BaseProduct {
  quantity: number;
  type: ProductType;
  subType?: 'Hammock' | 'Bag';
}

export type AddToCartFunction = (product: Product) => void;