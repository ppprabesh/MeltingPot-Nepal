import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/model/Order";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const encodedData = searchParams.get('data');
    
    if (!encodedData) {
      console.error('No data parameter received from eSewa');
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    // Decode the base64 data
    const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
    const data = JSON.parse(decodedData);
    
    console.log('Decoded eSewa data:', data);

    // Check payment status first
    if (data.status !== 'COMPLETE') {
      console.error('Payment status is not COMPLETE:', data.status);
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    // Connect to database
    await connectToDatabase();
    console.log('Database connected');

    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderId: data.transaction_uuid },
      { 
        $set: {
          status: 'completed',
          paymentDetails: {
            method: 'esewa',
            referenceId: data.transaction_code,
            status: data.status,
            amount: data.total_amount,
            transactionId: data.transaction_uuid,
          }
        }
      },
      { new: true }
    );

    if (!order) {
      console.error('Order not found with transaction_uuid:', data.transaction_uuid);
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    console.log('Order updated successfully:', order);

    // Redirect to success page with absolute URL
    const successUrl = new URL('/payment/success', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('Redirecting to:', successUrl.toString());
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Error processing eSewa success:', error);
    return NextResponse.redirect(new URL('/payment/failure', request.url));
  }
} 