import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { uploadImage } from "@/lib/cloudinary";
import { Product } from "@/model/Product";

// Fetch paginated accessories
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get pagination parameters from query string
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch accessories with pagination
    const accessories = await Product.find({ type: "Accessories" })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Count total items for pagination
    const totalItems = await Product.countDocuments({ type: "Accessories" });

    return NextResponse.json(
      { accessories, totalItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new accessory
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const subType = formData.get("subType") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string || "";
    const description = formData.get("description") as string || "";
    const maxWeight = formData.get("maxWeight") as string;
    const volume = formData.get("volume") as string;
    const imageFile = formData.get("image") as File;

    // Validate required fields
    if (!name || !code || isNaN(price) || isNaN(stock) || !subType) {
      return NextResponse.json(
        { error: "Name, code, price, stock, and type are required fields" },
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

    // Validate subType specific fields
    if (subType === "Hammocks" && !maxWeight) {
      return NextResponse.json(
        { error: "Max weight is required for hammocks" },
        { status: 400 }
      );
    }
    if (subType === "Bags" && !volume) {
      return NextResponse.json(
        { error: "Volume is required for bags" },
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

    // Create new accessory
    const accessoryItem = new Product({
      name,
      code,
      price,
      stock,
      imageUrl,
      type: "Accessories",
      subType,
      size,
      color,
      material,
      description,
      maxWeight: subType === "Hammocks" ? parseFloat(maxWeight) : undefined,
      volume: subType === "Bags" ? parseFloat(volume) : undefined,
    });

    await accessoryItem.save();
    return NextResponse.json({ accessoryItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
