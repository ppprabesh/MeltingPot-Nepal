import type { Metadata } from "next";
import { Alegreya } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const alegreya = Alegreya({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "The Melting Pot",
  description: "Everything made in Nepal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${alegreya.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}