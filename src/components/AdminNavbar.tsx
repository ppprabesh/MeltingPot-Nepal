"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/admin" className="flex items-center">
          <img
            src="/images/themeltingpotlogo.png"
            alt="Logo"
            className="h-16 w-auto"
          />
          <span className="ml-3 text-2xl font-bold text-gray-800">
            The Melting Pot
          </span>
        </Link>

        {/* Centered Admin Dashboard Text */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>
    </nav>
  );
}
