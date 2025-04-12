"use client";

import Link from "next/link";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";

// Product type definition
interface Product {
  id: string;
  _id:string;
  name: string;
  type: "clothing" | "accessory";
  price: number;
  stock: number;
  code: string;
}

export default function AdminPage() {
  const [clothingItems, setClothingItems] = useState<Product[]>([]);
  const [accessoryItems, setAccessoryItems] = useState<Product[]>([]);

  // Fetch clothing items
  const fetchClothingItems = async () => {
    const response = await fetch('/api/clothing'); // Fetch from your clothing route
    const data = await response.json();
    console.log(data)
    if (data.clothing) {
      setClothingItems(data.clothing);
    } else {
      console.error('Error fetching clothing items:', data.error);
    }
  };

  // Fetch accessory items
  const fetchAccessoryItems = async () => {
    const response = await fetch('/api/accessories'); 
    // Fetch from your accessories route
    const data = await response.json();
    console.log(data);
    if (data.accessories) {
      setAccessoryItems(data.accessories);
    } else {
      console.error('Error fetching accessory items:', data.error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchClothingItems();
    fetchAccessoryItems();
  }, []);

  // Handle delete
  const handleDelete = async (id: string, type: "clothing" | "accessories") => {
    const endpoint = type === "clothing" ? `/api/clothing/${id}` : `/api/accessories/${id}`;
    
    const response = await fetch(endpoint, { method: 'DELETE' });
    if (response.ok) {
      alert('Product deleted successfully');
      // Re-fetch data
      if (type === "clothing") {
        fetchClothingItems();
      } else {
        fetchAccessoryItems();
      }
    } else {
      alert('Error deleting product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="mb-6 flex gap-4">
        <Link href="/addClothing">
          <Button variant="outline" className="bg-green-800 text-xl">Add Clothing</Button>
        </Link>
        <Link href="/addAccessories">
          <Button variant="outline" className="bg-green-800 text-xl">Add Accessories</Button>
        </Link>
      </nav>

      {/* Product Tables */}
      <div className="bg-white text-black rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-green-800">Clothing List</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clothingItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Link href={`/editClothing/${product._id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-green-800" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id, "clothing")}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white text-black rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-800">Accessory List</h1>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessoryItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Link href={`/editAccessories/${product._id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-green-800" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id, "accessories")}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
