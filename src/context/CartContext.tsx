"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/types/product";
import { useAuth } from "@/app/context/AuthContext";

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  // Load cart from localStorage when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      if (userCart) {
        setItems(JSON.parse(userCart));
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [isLoggedIn, user]);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isLoggedIn && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  }, [items, isLoggedIn, user]);

  const addItem = (item: CartItem) => {
    try {
      if (!isLoggedIn) {
        toast({
          title: "Error",
          description: "Please login to add items to cart",
          variant: "destructive",
        });
        return;
      }

      const existingItem = items.find((i) => i._id === item._id);
      if (existingItem) {
        setItems(
          items.map((i) =>
            i._id === item._id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        );
        toast({
          title: "Cart Updated",
          description: `${item.name} quantity updated in cart`,
        });
      } else {
        setItems([...items, item]);
        toast({
          title: "Added to Cart",
          description: `${item.name} added to cart`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = (id: string) => {
    try {
      setItems(items.filter((item) => item._id !== id));
      toast({
        title: "Removed from Cart",
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    try {
      if (quantity < 1) {
        toast({
          title: "Error",
          description: "Quantity must be at least 1",
          variant: "destructive",
        });
        return;
      }

      setItems(
        items.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    try {
      setItems([]);
      if (isLoggedIn && user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const toggleCart = () => setIsOpen(!isOpen);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 