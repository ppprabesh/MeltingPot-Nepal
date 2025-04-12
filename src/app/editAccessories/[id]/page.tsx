"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AccessoriesFormData, EditAccessoriesForm } from "@/components/EditAccessoriesForm";



const EditAccessoriesPage = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const [existingData, setExistingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the existing data for the clothing item
  useEffect(() => {
    const fetchAccessoriesItem = async () => {
      try {
        const response = await fetch(`/api/accessories/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch accessories item");
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        setExistingData(data.accessoriesItem);
      } catch (error) {
        setError("Error fetching accessories item");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessoriesItem();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (data: AccessoriesFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      if (data.maxWeight) {
        formData.append("maxWeight", data.maxWeight.toString());
      }
      if (data.volume) {
        formData.append("volume", data.volume.toString());
      }
      if (data.material) {
        formData.append("material", data.material);
      }
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch(`/api/accessories/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update accessories item");
      }

      const result = await response.json();
      console.log("Updated accessories item:", result.updatedAccessories);

      // Redirect to the clothing list page or show a success message
      router.push("/accessories");
    } catch (error) {
      console.error("Error updating accessories item:", error);
      setError("Error updating accessories item");
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
      <h1 className="text-2xl text-green-800 font-bold mb-4">Edit Accessories Item</h1>
      <EditAccessoriesForm existingData={existingData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditAccessoriesPage;