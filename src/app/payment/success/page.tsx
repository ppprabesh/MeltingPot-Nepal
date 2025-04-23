import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Your payment has been processed successfully. We have sent a confirmation email with your order details.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="default">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 