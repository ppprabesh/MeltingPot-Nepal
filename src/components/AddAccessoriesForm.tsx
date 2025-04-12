"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

const accessoriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  subType: z.enum(["Hammock", "Bag"]),
  maxWeight: z.number().optional(), // Only required if subType is "Hammock"
  volume: z.number().optional(), // Only required if subType is "Bag"
  material: z.string().optional(), // Optional material field
  image: z.instanceof(FileList).optional(),
});

export type AccessoriesFormData = z.infer<typeof accessoriesSchema>;

interface AddAccessoriesFormProps {
  onSubmit: (data: AccessoriesFormData) => void;
}

export function AddAccessoriesForm({ onSubmit }: AddAccessoriesFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AccessoriesFormData>({
    resolver: zodResolver(accessoriesSchema),
  });

  const subType = watch("subType");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Ensure FileReader and image handling is only invoked on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // This ensures that the code is only executed in the browser.
    }
  }, []);

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
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label>Code</Label>
        <Input {...register("code")} />
        {errors.code && <p className="text-red-500">{errors.code.message}</p>}
      </div>

      <div>
        <Label>Price</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <Label>Stock</Label>
        <Input type="number" {...register("stock", { valueAsNumber: true })} />
        {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
      </div>

      <div>
        <Label>SubType</Label>
        <Controller
          control={control}
          name="subType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hammock">Hammock</SelectItem>
                <SelectItem value="Bag">Bag</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.subType && <p className="text-red-500">{errors.subType.message}</p>}
      </div>

      {subType === "Hammock" && (
        <div>
          <Label>Max Weight (kg)</Label>
          <Input type="number" {...register("maxWeight", { valueAsNumber: true })} />
          {errors.maxWeight && <p className="text-red-500">{errors.maxWeight.message}</p>}
        </div>
      )}

      {subType === "Bag" && (
        <div>
          <Label>Volume (L)</Label>
          <Input type="number" {...register("volume", { valueAsNumber: true })} />
          {errors.volume && <p className="text-red-500">{errors.volume.message}</p>}
        </div>
      )}

      <div>
        <Label>Material</Label>
        <Input {...register("material")} />
        {errors.material && <p className="text-red-500">{errors.material.message}</p>}
      </div>

      <div>
        <Label>Image</Label>
        <Input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
      </div>

      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Add Accessory
      </Button>
    </form>
  );
}
