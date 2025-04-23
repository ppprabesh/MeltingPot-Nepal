import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/model/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session");

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await User.findById(session.value);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Session check failed:", error);
    return NextResponse.json({ user: null });
  }
} 