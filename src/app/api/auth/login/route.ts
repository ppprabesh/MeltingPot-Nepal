import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/model/User";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Database connected");

    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log("User not found with email:", email);
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    console.log("Found user:", user.email);
    console.log("Attempting password comparison");
    
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password comparison result:", isPasswordValid);
      console.log("Provided password length:", password.length);
      console.log("Stored hash length:", user.password.length);

      if (!isPasswordValid) {
        console.log("Password validation failed for user:", email);
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } catch (bcryptError) {
      console.error("bcrypt comparison error:", bcryptError);
      return NextResponse.json(
        { error: "Error validating credentials" },
        { status: 500 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("user_session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    console.log("Login successful for user:", email);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
} 