import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/model/Order";
import { getPaymentStatus } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentDetails } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status and payment details
    order.status = status;
    order.paymentStatus = getPaymentStatus(status);
    
    if (paymentDetails) {
      order.paymentDetails = {
        ...order.paymentDetails,
        ...paymentDetails,
      };
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 