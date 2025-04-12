// /pages/api/auth/login.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "@/model/User";

const SECRET_KEY = "your_secret_key"; // Store this securely in environment variables

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
