import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Log failure details
    const searchParams = request.nextUrl.searchParams;
    console.error('eSewa payment failed:', Object.fromEntries(searchParams.entries()));

    // Update order status in your database here
    // ...

    // Redirect to failure page
    return NextResponse.redirect(new URL('/payment/failure', request.url));
  } catch (error) {
    console.error('Error processing eSewa failure:', error);
    return NextResponse.redirect(new URL('/payment/failure', request.url));
  }
} 