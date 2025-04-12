"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AddAccessoriesForm, AccessoriesFormData } from "@/components/AddAccessoriesForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddAccessoriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AccessoriesFormData) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("code", data.code);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("subType", data.subType);

    if (data.maxWeight) {
      formData.append("maxWeight", data.maxWeight.toString());
    }

    if (data.volume) {
      formData.append("volume", data.volume.toString());
    }

    if (data.material) {
      formData.append("material", data.material);
    }

    // ✅ Fix: Extract file from FileList before appending
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]); // Get first file
    }

    try {
      const response = await fetch("/api/accessories", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add accessory");
      }

      toast.success("Accessory added successfully!");
      router.push("/accessories"); // Redirect to accessories list page
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">Add New Accessory</CardTitle>
        </CardHeader>
        <CardContent>
          <AddAccessoriesForm onSubmit={handleSubmit} />
          {loading && <p className="text-gray-500 mt-2">Submitting...</p>}
        </CardContent>
      </Card>
    </div>
  );
}
