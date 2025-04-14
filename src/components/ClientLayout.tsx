"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize the queryClient here
const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      <main className="flex-grow bg-white pt-28 md:p-6 lg:p-0 relative z-10">{children}</main>
      {!isAdminPage && <Footer />}
    </QueryClientProvider>
  );
}
