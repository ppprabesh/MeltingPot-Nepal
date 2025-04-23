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
import { v4 as uuidv4 } from "uuid";

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

      if (!paymentResult.success || !paymentResult.data) {
        throw new Error(paymentResult.error || "Payment initialization failed");
      }

      // Clear cart after successful order creation
      clearCart();

      // Redirect to payment gateway
      if (paymentMethod === "khalti" && paymentResult.data.khaltiPaymentUrl) {
        window.location.href = paymentResult.data.khaltiPaymentUrl;
      } else if (paymentMethod === "esewa" && paymentResult.data.esewaConfig) {
        // Create and submit eSewa form
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
        
        // Required eSewa parameters in the correct order
        const params = {
          amount: paymentResult.data.esewaConfig.amount,
          tax_amount: paymentResult.data.esewaConfig.tax_amount,
          total_amount: paymentResult.data.esewaConfig.total_amount,
          transaction_uuid: paymentResult.data.esewaConfig.transaction_uuid,
          product_code: paymentResult.data.esewaConfig.product_code,
          product_service_charge: paymentResult.data.esewaConfig.product_service_charge,
          product_delivery_charge: paymentResult.data.esewaConfig.product_delivery_charge,
          success_url: paymentResult.data.esewaConfig.success_url,
          failure_url: paymentResult.data.esewaConfig.failure_url,
          signed_field_names: paymentResult.data.esewaConfig.signed_field_names,
          signature: paymentResult.data.esewaConfig.signature
        };

        // Create hidden inputs for each parameter
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value.toString();
            form.appendChild(input);
          }
        });

        // Log the form data for debugging
        console.log('eSewa form data:', params);

        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Invalid payment method or configuration");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process checkout. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEsewaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await initiatePayment({
        amount: totalPrice.toString(),
        productName: "Order Items",
        transactionId: uuidv4(),
        method: "esewa"
      });

      if (!result.success || !result.data?.esewaConfig) {
        toast.error("Failed to initiate eSewa payment");
        return;
      }

      const config = result.data.esewaConfig;
      console.log("eSewa config:", config);

      // Create and submit form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      // Add hidden fields for all config parameters
      Object.entries(config).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error submitting eSewa payment:", error);
      toast.error("Failed to process payment");
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