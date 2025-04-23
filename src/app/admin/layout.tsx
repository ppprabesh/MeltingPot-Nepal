"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the login page
      if (pathname === "/admin/login") {
        setIsLoading(false);
        return;
      }

      // Check admin session
      const cookies = document.cookie.split(';');
      const adminCookie = cookies.find(cookie => cookie.trim().startsWith('adminAuthenticated='));
      
      if (!adminCookie || adminCookie.split('=')[1].trim() !== 'true') {
        console.log('No valid admin session found, redirecting to login');
        router.push("/admin/login");
        return false;
      }
      return true;
    };

    const isAdmin = checkAuth();
    setIsAuthenticated(isAdmin);
    setIsLoading(false);
  }, [pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render anything
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  // If on login page, just render the children
  if (pathname === "/admin/login") {
    return <div className={inter.className}>{children}</div>;
  }

  // Otherwise, render the full admin layout
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-start">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Melting Pot
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                Admin Dashboard
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link 
                  href="/admin" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/clothing" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clothing
                </Link>
                <Link 
                  href="/admin/accessories" 
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Accessories
                </Link>
                <button 
                  onClick={() => {
                    document.cookie = 'adminAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    router.push("/admin/login");
                  }}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
} 