import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { uploadImage } from "@/lib/cloudinary";
import { Product } from "@/model/Product";

// Fetch paginated clothing items
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get pagination parameters from query string
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch clothing items with pagination
    const clothing = await Product.find({ type: "Clothing" })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Count total items for pagination
    const totalItems = await Product.countDocuments({ type: "Clothing" });

    return NextResponse.json(
      { clothing, totalItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new clothing item
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string || "";
    const description = formData.get("description") as string || "";
    const imageFile = formData.get("image") as File;

    // Validate required fields
    if (!name || !code || isNaN(price) || isNaN(stock) || !size || !color) {
      return NextResponse.json(
        { error: "Name, code, price, stock, size, and color are required fields" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { error: "Price must be positive and stock cannot be negative" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (imageFile) {
      // Convert and upload image
      const imageBuffer = await imageFile.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const imagePath = `data:${imageFile.type};base64,${imageBase64}`;
      imageUrl = await uploadImage(imagePath);
    }

    // Create new clothing item
    const clothingItem = new Product({
      name,
      code,
      price,
      stock,
      imageUrl,
      type: "Clothing",
      size,
      color,
      material,
      description,
    });

    await clothingItem.save();
    return NextResponse.json({ clothingItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating clothing item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
