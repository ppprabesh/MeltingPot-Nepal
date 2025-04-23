'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/themeltingpotlogo.png"
            alt="The Melting Pot Logo"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-lg mt-2">Thank you for your purchase</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Your payment has been processed successfully. We have sent a confirmation email with your order details.
              </p>
              {orderId && (
                <p className="text-sm text-gray-500">
                  Order ID: {orderId}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push('/')}
              >
                Return to Home
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.push('/orders')}
              >
                View Order Details
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact our support team</p>
              <p className="text-green-600">support@themeltingpot.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 