"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { initiatePayment } from "@/app/actions/payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("khalti");

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate shipping information
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      toast.error("Please fill in all shipping information");
      setIsLoading(false);
      return;
    }

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          items: items.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.imageUrl,
          })),
          shippingInfo: {
            ...shippingInfo,
            state: "N/A",
          },
          totalAmount: totalPrice,
          paymentMethod,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      // Initiate payment using server action
      const paymentResult = await initiatePayment({
        amount: totalPrice.toString(),
        productName: `Order #${orderData.orderId}`,
        transactionId: orderData.orderId,
        method: paymentMethod as "khalti" | "esewa",
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // Clear cart after successful order creation
      clearCart();

      // Redirect to payment gateway
      if (paymentMethod === "khalti" && paymentResult.data.khaltiPaymentUrl) {
        window.location.href = paymentResult.data.khaltiPaymentUrl;
      } else if (paymentMethod === "esewa" && paymentResult.data.esewaConfig) {
        // Create form and submit for Esewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        
        Object.entries(paymentResult.data.esewaConfig).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process checkout. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">Rs. {item.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information and Payment */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullName"
              placeholder="Full Name"
              value={shippingInfo.fullName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              required
              disabled
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
              <Input
                name="zipCode"
                placeholder="ZIP Code"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Khalti</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="esewa"
                    checked={paymentMethod === "esewa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Esewa</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 