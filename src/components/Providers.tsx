"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 