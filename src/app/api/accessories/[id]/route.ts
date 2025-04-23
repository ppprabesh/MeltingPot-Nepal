import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/model/Product";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// ✅ Get a single accessory by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Accessory ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const accessoryItem = await Product.findOne({ _id: id, type: 'Accessories' });

    if (!accessoryItem) {
      return NextResponse.json(
        { error: "Accessory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ accessoryItem });
  } catch (error) {
    console.error("Error fetching accessory:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessory" },
      { status: 500 }
    );
  }
}

// ✅ Update a single accessory by ID
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Accessory ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;
    const subType = formData.get("subType") as string;
    const maxWeight = formData.get("maxWeight") as string;
    const volume = formData.get("volume") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string;
    const image = formData.get("image") as File;

    if (!name || !code || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const accessoryItem = await Product.findOne({ _id: id, type: 'Accessories' });

    if (!accessoryItem) {
      return NextResponse.json(
        { error: "Accessory not found" },
        { status: 404 }
      );
    }

    let imageUrl = accessoryItem.imageUrl;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = join(process.cwd(), "public", "uploads");
      
      // Create uploads directory if it doesn't exist
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const path = join(uploadsDir, image.name);
      await writeFile(path, buffer);
      imageUrl = `/uploads/${image.name}`;
    }

    accessoryItem.name = name;
    accessoryItem.code = code;
    accessoryItem.price = price;
    accessoryItem.stock = stock;
    accessoryItem.description = description;
    accessoryItem.subType = subType;
    accessoryItem.maxWeight = maxWeight ? parseFloat(maxWeight) : undefined;
    accessoryItem.volume = volume ? parseFloat(volume) : undefined;
    accessoryItem.size = size;
    accessoryItem.color = color;
    accessoryItem.material = material;
    accessoryItem.imageUrl = imageUrl;

    await accessoryItem.save();

    return NextResponse.json({ accessoryItem });
  } catch (error) {
    console.error("Error updating accessory:", error);
    return NextResponse.json(
      { error: "Failed to update accessory" },
      { status: 500 }
    );
  }
}

// ✅ Delete a single accessory by ID
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Accessory ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const accessoryItem = await Product.findOneAndDelete({ _id: id, type: 'Accessories' });

    if (!accessoryItem) {
      return NextResponse.json(
        { error: "Accessory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Accessory deleted successfully" });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json(
      { error: "Failed to delete accessory" },
      { status: 500 }
    );
  }
}