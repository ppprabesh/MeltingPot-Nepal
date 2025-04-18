import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import Order from "@/model/Order";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("user_session");

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, items, shippingInfo, totalAmount, paymentMethod } = body;

    // Validate required fields
    if (!userId || !items || !shippingInfo || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new order
    const order = new Order({
      userId,
      items,
      shippingInfo,
      totalAmount,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 