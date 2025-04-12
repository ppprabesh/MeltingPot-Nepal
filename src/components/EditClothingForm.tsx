"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";

// Validation schema using Zod
export const clothingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  description: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  material: z.string().min(1, "Material is required"),
  image: z.instanceof(FileList).optional(),
});

export type ClothingFormData = z.infer<typeof clothingSchema>;

interface EditClothingFormProps {
  existingData: any; // This should be the data passed to the form (e.g., from API)
  onSubmit: (data: ClothingFormData) => void;
}

export const EditClothingForm: React.FC<EditClothingFormProps> = ({ existingData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClothingFormData>({
    resolver: zodResolver(clothingSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const defaultImageUrl = "https://via.placeholder.com/150"; // Fallback placeholder

  // Set default values from existingData when the form is loaded
  useEffect(() => {
    if (existingData) {
      setValue("name", existingData.name || "");
      setValue("code", existingData.code || "");
      setValue("price", existingData.price || 0);
      setValue("stock", existingData.stock || 0);
      setValue("description", existingData.description || "");
      setValue("size", existingData.size || "");
      setValue("color", existingData.color || "");
      setValue("material", existingData.material || "");
      
      // Handle image preview
      if (existingData?.imageUrl) {
        setPreviewImage(existingData.imageUrl); // Set initial preview if image exists
      } else {
        setPreviewImage(defaultImageUrl); // Set fallback image if none exists
      }
    }
  }, [existingData, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file); // Read the image file as a data URL
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black">Name</label>
        <input
          {...register("name")}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Code</label>
        <input
          {...register("code")}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.code && <p className="text-red-500">{errors.code.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Price</label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Stock</label>
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Description</label>
        <textarea
          {...register("description")}
          className="border p-2 w-full bg-white text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Size</label>
        <input
          {...register("size")}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.size && <p className="text-red-500">{errors.size.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Color</label>
        <input
          {...register("color")}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.color && <p className="text-red-500">{errors.color.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Material</label>
        <input
          {...register("material")}
          className="border p-2 w-full bg-white text-black"
        />
        {errors.material && <p className="text-red-500">{errors.material.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
          className="border p-2 w-full bg-white text-black"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
};
