import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/model/Product";
import { uploadImage } from "@/lib/cloudinary";
import mongoose from "mongoose";

// ✅ Get a single accessory by ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  // No need to `await` context.params.id
  const id = context.params.id?.trim(); // Access `id` synchronously

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const accessoriesItem = await Product.findById(id);
    if (!accessoriesItem) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    return NextResponse.json({ accessoriesItem }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accessory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Update a single accessory by ID
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const id = context.params.id?.trim();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const updates: Record<string, any> = {};

    const fields = ["name", "code", "price", "stock", "subType", "maxWeight", "volume", "material", "description"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        if (["stock", "price", "maxWeight", "volume"].includes(field)) {
          const numValue = parseFloat(value as string);
          if (isNaN(numValue)) {
            throw new Error(`Invalid ${field} value`);
          }
          if (field === "price" && numValue <= 0) {
            throw new Error("Price must be positive");
          }
          if (field === "stock" && numValue < 0) {
            throw new Error("Stock cannot be negative");
          }
          if (field === "maxWeight" && numValue <= 0) {
            throw new Error("Max weight must be positive");
          }
          if (field === "volume" && numValue <= 0) {
            throw new Error("Volume must be positive");
          }
          updates[field] = numValue;
        } else {
          updates[field] = value;
        }
      }
    });

    if (formData.has("image")) {
      const imageFile = formData.get("image") as File;
      if (imageFile) {
        const imageBuffer = await imageFile.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString("base64");
        const imagePath = `data:${imageFile.type};base64,${imageBase64}`;
        updates.imageUrl = await uploadImage(imagePath);
      }
    }

    const updatedAccessory = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedAccessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    return NextResponse.json({ accessory: updatedAccessory }, { status: 200 });
  } catch (error) {
    console.error("Error updating accessory:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Delete a single accessory by ID
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const id = context.params.id?.trim();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const deletedAccessory = await Product.findByIdAndDelete(id);

    if (!deletedAccessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Accessory deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}