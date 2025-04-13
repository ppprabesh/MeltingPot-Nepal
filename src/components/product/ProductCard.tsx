// src/components/product/ProductCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CartItem } from "@/types/product";

// Define the type for Product
interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  imageUrl: string;
  type: 'Clothing' | 'Accessories';
  description?: string;
  size?: string;
  color?: string;
  material?: string;
  subType?: 'Hammock' | 'Bag';
  maxWeight?: number;
  volume?: number;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const material = product.material || product.code.split(' ').slice(1).join(' ') || 'N/A';
  
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      ...product,
      quantity: 1
    } as CartItem);
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative w-full aspect-square mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="rounded-lg object-contain"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-black">{product.name}</h3>
        
        {product.type === 'Clothing' && product.description && (
          <p className="text-gray-700 mb-3">{product.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:tag" className="text-green-600" />
            <span className="font-medium text-black">Rs. {product.price.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon icon="mdi:barcode" className="text-green-600" />
            <span className="text-gray-800">{product.code}</span>
          </div>

          {product.type === 'Clothing' && (
            <>
              {product.size && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:ruler" className="text-green-600" />
                  <span className="text-gray-800">Size: {product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:palette" className="text-green-600" />
                  <span className="text-gray-800">Color: {product.color}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:factory" className="text-green-600" />
                <span className="text-gray-800">Material: {material}</span>
              </div>
            </>
          )}

          {product.type === 'Accessories' && (
            <>
              {product.subType === 'Hammock' && product.maxWeight && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:weight" className="text-green-600" />
                  <span className="text-gray-800">Max Weight: {product.maxWeight} kg</span>
                </div>
              )}
              {product.subType === 'Bag' && (
                <>
                  {product.volume && (
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:cube-outline" className="text-green-600" />
                      <span className="text-gray-800">Volume: {product.volume} L</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:factory" className="text-green-600" />
                      <span className="text-gray-800">Material: {product.material}</span>
                    </div>
                  )}
                </>
              )}
              {product.size && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:ruler" className="text-green-600" />
                  <span className="text-gray-800">Size: {product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:palette" className="text-green-600" />
                  <span className="text-gray-800">Color: {product.color}</span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-2">
            <Icon icon="mdi:package-variant" className="text-green-600" />
            <span className="text-gray-800">Stock: {product.stock} available</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleAddToCart}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </div>
  );
};

export default ProductCard;