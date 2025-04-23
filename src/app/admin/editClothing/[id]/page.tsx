"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
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
import { use } from "react";

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
  currentImageUrl: string;
}

interface EditClothingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditClothingPage({ params }: EditClothingPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
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
    currentImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClothing = async () => {
      try {
        const response = await fetch(`/api/clothing/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch clothing");
        const data = await response.json();
        setFormData({
          name: data.clothingItem.name,
          code: data.clothingItem.code,
          price: data.clothingItem.price.toString(),
          stock: data.clothingItem.stock.toString(),
          description: data.clothingItem.description,
          size: data.clothingItem.size,
          color: data.clothingItem.color,
          material: data.clothingItem.material,
          image: null,
          imagePreview: data.clothingItem.imageUrl,
          currentImageUrl: data.clothingItem.imageUrl,
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch clothing");
        toast({
          title: "Error",
          description: "Failed to fetch clothing details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClothing();
  }, [resolvedParams.id]);

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
    setError(null);

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

      const response = await fetch(`/api/clothing/${resolvedParams.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update clothing");
      }

      toast({
        title: "Success",
        description: "Clothing updated successfully",
      });

      router.push("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update clothing");
      toast({
        title: "Error",
        description: "Failed to update clothing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/clothing/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete clothing");
      }

      toast({
        title: "Success",
        description: "Clothing deleted successfully",
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error deleting clothing:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete clothing",
        variant: "destructive",
      });
    }
  };

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
          onClick={() => router.push("/admin")}
          className="mt-4"
        >
          Back to Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Edit Clothing</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700 hover:border-red-700"
          >
            Delete
          </Button>
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
          >
            Back to Dashboard
          </Button>
        </div>
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
                className="text-black"
              />
              <div className="relative w-32 h-32">
                <Image
                  src={formData.imagePreview || formData.currentImageUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
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
            {loading ? "Updating..." : "Update Clothing"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{formData.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-green-600 text-white hover:bg-green-700 hover:border-green-700">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 