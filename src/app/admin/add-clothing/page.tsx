"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface ClothingFormData {
  name: string;
  code: string;
  price: string;
  stock: string;
  description: string;
  size: string;
  color: string;
  material: string;
  image: File | null;
  imagePreview: string;
}

export default function AddClothingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClothingFormData>({
    name: "",
    code: "",
    price: "",
    stock: "",
    description: "",
    size: "",
    color: "",
    material: "",
    image: null,
    imagePreview: "",
  });
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("code", formData.code);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("material", formData.material);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("/api/clothing", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to add clothing");

      toast({
        title: "Success",
        description: "Clothing added successfully",
      });

      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add clothing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Add New Clothing</h1>
        <Button
          onClick={() => router.push("/admin")}
          variant="outline"
          className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
        >
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-black">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-black">
              Code
            </label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-black">
              Price
            </label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="text-sm font-medium text-black">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="size" className="text-sm font-medium text-black">
              Size
            </label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium text-black">
              Color
            </label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="material" className="text-sm font-medium text-black">
              Material
            </label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              required
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-black">
              Image
            </label>
            <div className="flex flex-col gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="text-black"
              />
              {formData.imagePreview && (
                <div className="relative w-32 h-32">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-black">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="text-black"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
            className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Adding..." : "Add Clothing"}
          </Button>
        </div>
      </form>
    </div>
  );
} 