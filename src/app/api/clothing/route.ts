import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { uploadImage } from "@/lib/cloudinary";
import { Product } from "@/model/Product";

// Fetch paginated clothing items
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get pagination parameters from query string (default to page 1, limit 20)
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = 20; // Number of products per page

    const skip = (page - 1) * limit; // Skip the items from the previous pages

    // Fetch clothing items with pagination
    const clothing = await Product.find({ type: "Clothing" })
      .skip(skip)
      .limit(limit);

    // Count total items to determine if there are more pages
    const totalItems = await Product.countDocuments({ type: "Clothing" });

    return NextResponse.json(
      { clothing, totalItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a new clothing item
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const price = formData.get("price") as string;
    const stock = parseInt(formData.get("stock") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string;
    const imageFile = formData.get("image") as File;

    if (!name || !code || !price || isNaN(stock) || !size || !color || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imagePath = `data:${imageFile.type};base64,${imageBase64}`;

    const imageUrl = await uploadImage(imagePath);

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
    });

    await clothingItem.save();
    return NextResponse.json({ clothingItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating clothing item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
