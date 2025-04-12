"use client";

import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { prefetchProductDetails } from "@/lib/prefetch";

interface FilterOption {
  id: string;
  name: string;
}

// Define the type for Product
interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  imageUrl: string;
  type: 'Clothing' | 'Accessories';
  description?: string;
  size?: string;
  color?: string;
  material?: string;
  subType?: 'Hammock' | 'Bag';
  maxWeight?: number;
  volume?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Define the expected shape of the API responses
interface ClothingResponse {
  clothing: Product[];
  totalItems: number;
}

interface AccessoriesResponse {
  accessories: Product[];
}

// Function to fetch products based on type
const fetchProducts = async (type: 'Clothing' | 'Accessories'): Promise<Product[]> => {
  const endpoint = type === 'Clothing' ? '/api/clothing' : '/api/accessories';
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error fetching ${type.toLowerCase()} products`);
  
  const data = await response.json();
  // Return the products array from the appropriate property
  return type === 'Clothing' ? data.clothing : data.accessories;
};

const ProductList = ({ productType }: { productType: 'Clothing' | 'Accessories' }) => {
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 8;

  // Dynamic filters based on product type
  const getFilters = () => {
    if (productType === 'Clothing') {
      return [
        { id: 'all', name: 'All' },
        { id: 'cotton', name: 'Cotton' },
        { id: 'hemp', name: 'Hemp' },
        { id: 'bamboo', name: 'Bamboo' }
      ];
    } else if (productType === 'Accessories') {
      return [
        { id: 'all', name: 'All' },
        { id: 'hammock', name: 'Hammocks' },
        { id: 'bag', name: 'Bags' }
      ];
    }
    return [
      { id: 'all', name: 'All' },
      { id: 'in-stock', name: 'In Stock' },
      { id: 'new', name: 'New Arrivals' }
    ];
  };

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products', productType],
    queryFn: async () => {
      const endpoint = productType === 'Clothing' ? '/api/clothing' : '/api/accessories';
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Error fetching ${productType.toLowerCase()} products`);
      const data = await response.json();
      return productType === 'Clothing' ? data.clothing : data.accessories;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  // Prefetch product details when hovering over a product card
  const handleProductHover = (productId: string) => {
    prefetchProductDetails(queryClient, productId, productType);
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.material?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For accessories, only filter by subType
    if (productType === 'Accessories') {
      if (selectedFilter === 'all') {
        return matchesSearch;
      } else {
        return matchesSearch && product.subType?.toLowerCase() === selectedFilter;
      }
    }
    
    // For clothing, filter by material
    if (productType === 'Clothing') {
      if (selectedFilter === 'all') {
        return matchesSearch;
      } else {
        return matchesSearch && product.material?.toLowerCase().includes(selectedFilter);
      }
    }
    
    // Default case (should not reach here)
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-4xl text-green-600" />
    </div>
  );

  if (isError) return (
    <div className="text-red-500 text-center p-4">
      Error: {error.message}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {productType === 'Clothing' ? 'Sustainable Clothing' : 'Eco-Friendly Accessories'}
          </h1>
          <p className="text-gray-700 mt-2">
            {productType === 'Clothing' ? 'Ethically made apparel for conscious living' :
             'Practical accessories with minimal environmental impact'}
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="akar-icons:search" className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 w-full rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {getFilters().map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedFilter === filter.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div
                key={`${product._id}-${product.type}`}
                onMouseEnter={() => handleProductHover(product._id)}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border disabled:opacity-50 text-black"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={`page-${page}`}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'border hover:bg-gray-100 text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border disabled:opacity-50 text-black"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg">No products found matching your criteria</p>
          <button 
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 text-green-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;