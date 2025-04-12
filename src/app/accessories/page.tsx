"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductList from "@/components/product/ProductList";
import { prefetchProducts } from "@/lib/prefetch";

export default function AccessoriesPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch accessories products
    prefetchProducts(queryClient, 'Accessories');
  }, [queryClient]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-black">Handcrafted Accessories</span>
                <span className="block text-green-600">For Every Lifestyle</span>
              </h1>
              <p className="text-lg text-gray-700">
                Explore our unique collection of bags, hammocks, cups, keyrings, honey, and more—crafted with care and sustainability in mind.
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Shop Now
              </Button>
            </div>
            <div className="flex-1 relative h-[300px] sm:h-[350px] md:h-[400px] w-full">
              <Image
                src="/accessories-hero.jpg"
                alt="Handcrafted Accessories"
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Product List Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductList productType="Accessories" />
      </div>
    </div>
  );
}
