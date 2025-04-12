"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/app/context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient

// Initialize the queryClient here
const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin"); // Check if it's an admin page

  return (
    // Wrap the entire layout with QueryClientProvider to provide React Query context
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {isAdminPage ? <AdminNavbar /> : <Navbar />} {/* Show Admin Navbar for admin pages */}
        <main className="flex-grow bg-white pt-28 md:p-6 lg:p-0 relative z-10">{children}</main>
        {!isAdminPage && <Footer />} {/* Hide Footer for admin pages */}
      </CartProvider>
    </QueryClientProvider>
  );
}
