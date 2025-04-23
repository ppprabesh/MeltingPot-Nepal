import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/model/Product";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// ✅ Fetch a single clothing item by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Clothing ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const clothingItem = await Product.findOne({ _id: id, type: 'Clothing' });

    if (!clothingItem) {
      return NextResponse.json(
        { error: "Clothing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ clothingItem });
  } catch (error) {
    console.error("Error fetching clothing:", error);
    return NextResponse.json(
      { error: "Failed to fetch clothing" },
      { status: 500 }
    );
  }
}

// ✅ Update a clothing item by ID
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Clothing ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;
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
    const clothingItem = await Product.findOne({ _id: id, type: 'Clothing' });

    if (!clothingItem) {
      return NextResponse.json(
        { error: "Clothing not found" },
        { status: 404 }
      );
    }

    let imageUrl = clothingItem.imageUrl;

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

    clothingItem.name = name;
    clothingItem.code = code;
    clothingItem.price = price;
    clothingItem.stock = stock;
    clothingItem.description = description;
    clothingItem.size = size;
    clothingItem.color = color;
    clothingItem.material = material;
    clothingItem.imageUrl = imageUrl;

    await clothingItem.save();

    return NextResponse.json({ clothingItem });
  } catch (error) {
    console.error("Error updating clothing:", error);
    return NextResponse.json(
      { error: "Failed to update clothing" },
      { status: 500 }
    );
  }
}

// ✅ Delete a clothing item by ID
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Clothing ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const clothingItem = await Product.findOneAndDelete({ _id: id, type: 'Clothing' });

    if (!clothingItem) {
      return NextResponse.json(
        { error: "Clothing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Clothing deleted successfully" });
  } catch (error) {
    console.error("Error deleting clothing:", error);
    return NextResponse.json(
      { error: "Failed to delete clothing" },
      { status: 500 }
    );
  }
}
