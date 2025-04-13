"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function AddAccessoriesPage() {
  const [loading, setLoading] = useState(false);
  const [subType, setSubType] = useState<"Hammock" | "Bag">("Hammock");
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("subType", subType);

    try {
      const response = await fetch("/api/accessories", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add accessories item");
      }

      toast({
        title: "Success",
        description: "Accessories item added successfully",
      });

      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add accessories item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Accessories Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            name="name"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <Input
            type="text"
            name="code"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <Input
            type="number"
            name="price"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <Input
            type="number"
            name="stock"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sub-Type</label>
          <Select
            value={subType}
            onValueChange={(value: "Hammock" | "Bag") => setSubType(value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hammock">Hammock</SelectItem>
              <SelectItem value="Bag">Bag</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {subType === "Hammock" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Weight (kg)</label>
            <Input
              type="number"
              name="maxWeight"
              required
              className="mt-1"
            />
          </div>
        )}

        {subType === "Bag" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Volume (L)</label>
            <Input
              type="number"
              name="volume"
              required
              className="mt-1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Material</label>
          <Input
            type="text"
            name="material"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            required
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Accessories Item"}
        </Button>
      </form>
    </div>
  );
} 