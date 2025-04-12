// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imagePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    return result.secure_url; // Returns the Cloudinary URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};