import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">Payment Failed</CardTitle>
          <CardDescription>We couldn't process your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            There was an issue processing your payment. This could be due to insufficient funds, incorrect card details, or a temporary issue with the payment gateway.
          </p>
          <div className="flex flex-col space-y-2">
            <Link href="/checkout">
              <Button variant="default" className="w-full">Try Again</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">Contact Support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 