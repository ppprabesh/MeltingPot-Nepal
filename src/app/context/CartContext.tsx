"use client"
import { createContext, useContext, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: { items: CartItem[], totalAmount: number };
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC <{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<{ items: CartItem[]; totalAmount: number }>({
    items: [],
    totalAmount: 0,
  });

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id);
      let updatedItems;

      if (existingItemIndex >= 0) {
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        updatedItems = [...prevCart.items, item];
      }

      const updatedTotalAmount = updatedItems.reduce(
        (total, currentItem) => total + currentItem.price * currentItem.quantity,
        0
      );

      return { items: updatedItems, totalAmount: updatedTotalAmount };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      const updatedTotalAmount = updatedItems.reduce(
        (total, currentItem) => total + currentItem.price * currentItem.quantity,
        0
      );
      return { items: updatedItems, totalAmount: updatedTotalAmount };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const updatedTotalAmount = updatedItems.reduce(
        (total, currentItem) => total + currentItem.price * currentItem.quantity,
        0
      );

      return { items: updatedItems, totalAmount: updatedTotalAmount };
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
