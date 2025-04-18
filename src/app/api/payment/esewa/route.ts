import { NextResponse } from "next/server";
import crypto from "crypto";
import { ESEWA_CONFIG } from "@/lib/payment";
import Order from "@/model/Order";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Prepare Esewa payment payload
    const payload = {
      amount: order.totalAmount,
      tax_amount: 0,
      total_amount: order.totalAmount,
      transaction_uuid: orderId,
      product_code: "EPAYTEST",
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/esewa/success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Generate signature
    const signatureData = `${payload.total_amount},${payload.transaction_uuid},${payload.product_code}`;
    const signature = crypto
      .createHmac("sha256", ESEWA_CONFIG.merchantSecret)
      .update(signatureData)
      .digest("base64");

    const paymentPayload = {
      ...payload,
      signature,
    };

    return NextResponse.json({
      paymentUrl: `${ESEWA_CONFIG.baseUrl}/form`,
      payload: paymentPayload,
    });
  } catch (error) {
    console.error("Error initiating Esewa payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 