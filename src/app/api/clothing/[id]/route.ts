import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/model/Product";
import { uploadImage } from "@/lib/cloudinary";
import mongoose from "mongoose";

// ✅ Fetch a single clothing item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const id = params.id?.trim();
  
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const clothingItem = await Product.findById(id);
    if (!clothingItem) {
      return NextResponse.json({ error: "Clothing item not found" }, { status: 404 });
    }
    return NextResponse.json({ clothingItem }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clothing item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Update a clothing item by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const id = params.id?.trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const formData = await request.formData();
    const updates: Record<string, any> = {};

    const fields = ["name", "code", "price", "stock", "size", "color", "material", "description"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        if (["stock", "price"].includes(field)) {
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

    const updatedClothing = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedClothing) {
      return NextResponse.json({ error: "Clothing item not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedClothing }, { status: 200 });
  } catch (error) {
    console.error("Error updating clothing item:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Delete a clothing item by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const id = params.id?.trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const deletedClothing = await Product.findByIdAndDelete(id);

    if (!deletedClothing) {
      return NextResponse.json({ error: "Clothing item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Clothing item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting clothing item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
