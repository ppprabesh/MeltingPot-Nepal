"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CartPopup from "./cart/CartPopup";
import { Icon } from "@iconify/react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { totalItems, toggleCart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const flagOpacity = scrollY > 0 ? 0.50 : 1;

  const handleProtectedRoute = (path: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Navbar + Banner Wrapper */}
      <div className="fixed top-0 w-full z-50">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md h-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-between h-full items-center">
              {/* Logo */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center">
                  <div className="relative w-[40px] h-[40px]">
                    <Image
                      src="/images/themeltingpotlogo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="ml-3 text-2xl font-bold text-gray-800">
                   Melting Pot
                  </span>
                </Link>
              </div>

              {/* Desktop Links */}
              <div className="hidden md:flex space-x-10">
                {[
                  { path: "/clothing", label: "Clothing" },
                  { path: "/accessories", label: "Accessories" },
                  { path: "/about", label: "About Us" },
                  { path: "/sizeGuide", label: "Size Guide" },
                  { path: "/contact", label: "Contact Us" },
                ].map(({ path, label }) => (
                  <Link
                    key={path}
                    href={path}
                    className={`text-lg ${
                      pathname === path
                        ? "text-green-600 font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* User Dropdown */}
              <div className="flex items-center space-x-4">
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    {isLoggedIn ? (
                      <>
                        <DropdownMenuItem>
                          <Link href="/profile" className="w-full">
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem>
                        <Link href="/login" className="w-full">
                          Login
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button 
                  onClick={toggleCart}
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                <Menu className="h-8 w-8 text-gray-800" />
              </button>
            </div>
          </div>
        </nav>

        {/* Tibetan Flag Banner - Always visible, opacity changes on scroll */}
        <div className="relative w-full md:hidden h-16 md:h-64 lg:h-72 overflow-hidden">
          {/* White background that fades out */}
          <div
            className="absolute inset-0 transition-opacity duration-300 z-0"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${Math.max(1 - scrollY / 200, 0)})`,
            }}
          />

          {/* Flag image on top with dynamic opacity */}
          <Image
            src="/images/tibetianflag.png"
            alt="Tibetan Flag"
            fill
            className="object-cover z-10 transition-opacity duration-300"
            style={{ opacity: flagOpacity }}
            priority
          />
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation (Mobile) */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-xl font-semibold">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4">
          {["/clothing", "/accessories", "/about", "/sizeGuide", "/contact"].map(
            (path) => {
              const label =
                path === "/sizeGuide"
                  ? "Size Guide"
                  : path.slice(1).replace(/^\w/, (c) => c.toUpperCase());

              return (
                <Link
                  key={path}
                  href={path}
                  className={`block py-2 px-4 rounded-md text-lg ${
                    pathname === path
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {label}
                </Link>
              );
            }
          )}
        </nav>
      </aside>

      <CartPopup />
    </>
  );
};

export default Navbar;
