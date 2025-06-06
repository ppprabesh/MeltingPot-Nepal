"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      {/* Background with logo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/images/themeltingpotlogo.png"
          alt="The Melting Pot Logo"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/themeltingpotlogo.png"
              alt="The Melting Pot Logo"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Button
                  variant="link"
                  className="text-green-600 hover:text-green-700 p-0"
                  onClick={() => router.push('/signup')}
                >
                  Sign up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
