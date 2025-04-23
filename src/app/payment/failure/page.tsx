"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image
                src="/images/themeltingpotlogo.png"
                alt="Melting Pot Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Failure Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Failure Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Failed
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                We couldn't process your payment at this time.
              </p>
              <p className="text-gray-600">
                Please check your payment details and try again.
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              If you continue to face issues, please contact our support team for assistance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCcw className="h-5 w-5" />
              Try Payment Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 