import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { uploadImage } from "@/lib/cloudinary";
import { Product } from "@/model/Product";

// Fetch all accessories with pagination
export async function GET(request: Request) {
  await dbConnect();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    // Fetch accessories with pagination
    const accessories = await Product.find({ type: "Accessories" })
      .skip((page - 1) * limit) // Skipping previous items based on page number
      .limit(limit); // Limiting the number of items fetched per request

    return NextResponse.json({ accessories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a new accessory (hammock or bag)
export async function POST(request: Request) {
  await dbConnect();

  // Parse the form data
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const subType = formData.get("subType") as string; // "Hammock" or "Bag"
  const maxWeight = formData.get("maxWeight") ? Number(formData.get("maxWeight")) : undefined;
  const volume = formData.get("volume") ? Number(formData.get("volume")) : undefined;
  const material = formData.get("material") as string;
  const imageFile = formData.get("image") as File;

  // Validate required fields
  if (!name || !code || !price || isNaN(stock) || !subType || !imageFile) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (subType === "Hammock" && !maxWeight) {
    return NextResponse.json({ error: "maxWeight is required for Hammock" }, { status: 400 });
  }

  try {
    // Convert the image file to a base64 string
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imagePath = `data:${imageFile.type};base64,${imageBase64}`;

    // Upload the image to Cloudinary
    const imageUrl = await uploadImage(imagePath);

    // Create the accessory item
    const accessory = new Product({
      name,
      code,
      price,
      stock,
      imageUrl,
      type: "Accessories",
      subType,
      maxWeight,
      volume,
      material: material || undefined,
    });

    await accessory.save();
    return NextResponse.json({ accessory }, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
