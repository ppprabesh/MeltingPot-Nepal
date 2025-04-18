"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EsewaSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const transactionId = searchParams.get("transaction_id");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");

    if (status === "COMPLETE") {
      // Update order status in database
      fetch("/api/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          amount,
          status: "paid",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success("Payment successful!");
            router.push("/orders");
          } else {
            toast.error("Failed to update order status");
            router.push("/checkout");
          }
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          toast.error("An error occurred");
          router.push("/checkout");
        });
    } else {
      toast.error("Payment failed or was cancelled");
      router.push("/checkout");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-gray-600">Please wait while we process your payment.</p>
      </div>
    </div>
  );
} 