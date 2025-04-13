"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <Icon 
            icon="mdi:alert-circle-outline" 
            className="text-red-500 w-24 h-24 mb-4"
          />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 