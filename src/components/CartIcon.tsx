"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import CartPopup from "./CartPopup";
import { useCart } from "@/app/context/CartContext";
 

const CartIcon: React.FC = () => {
  const { cart } = useCart(); // Access the cart state from the context
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  
  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <ShoppingCart className="h-6 w-6 text-gray-800" />
        
        
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 inline-block w-5 h-5 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      {isPopupOpen && <CartPopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
};

export default CartIcon;
