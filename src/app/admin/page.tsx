"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { Icon } from "@iconify/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { checkAdminSession, clearAdminSession } from "@/utils/session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"clothing" | "accessories">("clothing");
  const [clothing, setClothing] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string; type: "clothing" | "accessories" } | null>(null);
  const itemsPerPage = 10;

  const fetchProducts = async (type: "clothing" | "accessories") => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/${type}?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (!response.ok) throw new Error(`Failed to fetch ${type}`);
      const data = await response.json();
      if (type === "clothing") {
        setClothing(data.clothing);
        setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      } else {
        setAccessories(data.accessories);
        setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast({
        title: "Error",
        description: `Failed to fetch ${type}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = checkAdminSession();
      setIsAuthenticated(isAdmin);
      if (!isAdmin) {
        clearAdminSession();
        router.push("/admin/login");
      }
    };

    // Check auth immediately
    checkAuth();

    // Check auth every 30 seconds
    const interval = setInterval(checkAuth, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts(activeTab);
    }
  }, [activeTab, currentPage, isAuthenticated]);

  const handleDelete = async (id: string, type: "clothing" | "accessories") => {
    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      });

      // Refresh the current page
      const currentItems = type === "clothing" ? clothing : accessories;
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProducts(type);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const openDeleteDialog = (id: string, name: string, type: "clothing" | "accessories") => {
    setProductToDelete({ id, name, type });
    setDeleteDialogOpen(true);
  };

  const filteredProducts = (activeTab === "clothing" ? clothing : accessories).filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={() => {
            setError(null);
            fetchProducts(activeTab);
          }}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          {/* <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1> */}
          <p className="text-gray-600 hidden sm:block">Manage your products</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-red-600 text-white hover:bg-red-700 hover:border-red-700"
        >
          Logout
        </Button>
      </div>

      <div className="mb-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "clothing" | "accessories");
            setCurrentPage(1);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger
              value="clothing"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Clothing
            </TabsTrigger>
            <TabsTrigger
              value="accessories"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Accessories
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black placeholder:text-gray-500"
          />
        </div>
        <Button
          onClick={() => router.push(`/admin/add-${activeTab}`)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px] text-gray-700 font-semibold">Image</TableHead>
              <TableHead className="text-gray-700 font-semibold">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold">Code</TableHead>
              <TableHead className="text-gray-700 font-semibold">Price</TableHead>
              <TableHead className="text-gray-700 font-semibold">Stock</TableHead>
              {activeTab === "accessories" && <TableHead className="text-gray-700 font-semibold">Type</TableHead>}
              <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id} className="hover:bg-gray-50">
                <TableCell>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                <TableCell className="text-gray-700">{product.code}</TableCell>
                <TableCell className="text-gray-700">Rs. {product.price.toFixed(2)}</TableCell>
                <TableCell className="text-gray-700">{product.stock}</TableCell>
                {/* {activeTab === "accessories" && (
                  // <TableCell className="text-gray-700">{product.subType}</TableCell>
                )} */}
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/admin/edit${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}/${product._id}`)}
                      className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openDeleteDialog(product._id, product.name, activeTab)}
                      className="bg-red-600 text-white hover:bg-red-700 hover:border-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
        >
          Previous
        </Button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  handleDelete(productToDelete.id, productToDelete.type);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
