"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";

// Validation schema using Zod for Accessories
export const accessoriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  subType: z.string().min(1, "Sub-type is required"),
  maxWeight: z.number().min(0, "Max weight must be a positive number").optional(),
  volume: z.number().min(0, "Volume must be a positive number").optional(),
  material: z.string().optional(),
  description: z.string().optional(),
  image: z.instanceof(FileList).optional(),
});

export type AccessoriesFormData = z.infer<typeof accessoriesSchema>;

interface EditAccessoriesFormProps {
  existingData: any; // This should be the data passed to the form (e.g., from API)
  onSubmit: (data: AccessoriesFormData) => void;
}

export const EditAccessoriesForm: React.FC<EditAccessoriesFormProps> = ({ existingData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccessoriesFormData>({
    resolver: zodResolver(accessoriesSchema),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const subType = watch("subType");

  const defaultImageUrl = "https://via.placeholder.com/150"; // Fallback placeholder

  // Set default values from existingData when the form is loaded
  useEffect(() => {
    if (existingData) {
      setValue("name", existingData.name || "");
      setValue("code", existingData.code || "");
      setValue("price", existingData.price || 0);
      setValue("stock", existingData.stock || 0);
      setValue("subType", existingData.subType || "");
      setValue("maxWeight", existingData.maxWeight || 0);
      setValue("volume", existingData.volume || 0);
      setValue("material", existingData.material || "");
      setValue("description", existingData.description || "");

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
        <label className="block text-sm font-medium text-black">Sub-Type</label>
        <select
          {...register("subType")}
          className="border p-2 w-full bg-white text-black"
        >
          <option value="">Select a type</option>
          <option value="Hammock">Hammock</option>
          <option value="Bag">Bag</option>
        </select>
        {errors.subType && <p className="text-red-500">{errors.subType.message}</p>}
      </div>

      {subType === "Hammock" && (
        <div>
          <label className="block text-sm font-medium text-black">Max Weight (kg)</label>
          <input
            type="number"
            {...register("maxWeight", { valueAsNumber: true })}
            className="border p-2 w-full bg-white text-black"
          />
          {errors.maxWeight && <p className="text-red-500">{errors.maxWeight.message}</p>}
        </div>
      )}

      {subType === "Bag" && (
        <div>
          <label className="block text-sm font-medium text-black">Volume (L)</label>
          <input
            type="number"
            {...register("volume", { valueAsNumber: true })}
            className="border p-2 w-full bg-white text-black"
          />
          {errors.volume && <p className="text-red-500">{errors.volume.message}</p>}
        </div>
      )}

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
