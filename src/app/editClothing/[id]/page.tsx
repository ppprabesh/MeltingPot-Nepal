"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClothingFormData, EditClothingForm } from "@/components/EditClothingForm";


const EditClothingPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const router = useRouter();
  const [existingData, setExistingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the existing data for the clothing item
  useEffect(() => {
    const fetchClothingItem = async () => {
      try {
        const response = await fetch(`/api/clothing/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch clothing item");
        }
        const data = await response.json();
        setExistingData(data.clothingItem);
      } catch (error) {
        setError("Error fetching clothing item");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItem();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (data: ClothingFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("size", data.size);
      formData.append("color", data.color);
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch(`/api/clothing/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update clothing item");
      }

      const result = await response.json();
      console.log("Updated clothing item:", result.updatedClothing);

      // Redirect to the clothing list page or show a success message
      router.push("/clothing");
    } catch (error) {
      console.error("Error updating clothing item:", error);
      setError("Error updating clothing item");
    }
  };

  if (loading) {
    <div className="flex justify-center items-center h-screen">
    {/* Spinning Animation */}
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-12 pb-8">
      <h1 className="text-2xl font-bold mb-4">Edit Clothing Item</h1>
      <EditClothingForm existingData={existingData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditClothingPage;