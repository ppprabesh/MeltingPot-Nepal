"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

const OrderConfirmationPage = () => {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="mdi:check-circle" className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Processing</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          We'll send you an email with your order details and tracking information once your order ships.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/orders"
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 