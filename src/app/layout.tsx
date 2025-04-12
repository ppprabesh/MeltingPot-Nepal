import type { Metadata } from "next";
import { Alegreya } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";

const alegreya = Alegreya({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "The Melting Pot",
  description: "Everything made in Nepal",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${alegreya.className} min-h-screen flex flex-col`}>
        <Providers session={session}>
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}