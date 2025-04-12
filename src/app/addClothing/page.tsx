"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AddClothingForm, ClothingFormData } from "@/components/AddClothingForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddClothingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddClothing = async (data: ClothingFormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("code", data.code);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("description", data.description || "");
    formData.append("size", data.size);
    formData.append("color", data.color);
    formData.append("material", data.material);
    
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await fetch("/api/clothing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add clothing");
      }

      toast.success("Clothing added successfully!");
      router.push("/clothing"); // Redirect after success
    } catch (error: any) {
      toast.error(error.message || "Error submitting clothing form");
      console.error("Error submitting clothing form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">Add New Clothing</CardTitle>
        </CardHeader>
        <CardContent>
          <AddClothingForm onSubmit={handleAddClothing} />
          {loading && <p className="text-gray-500 mt-2">Submitting...</p>}
        </CardContent>
      </Card>
    </div>
  );
}
