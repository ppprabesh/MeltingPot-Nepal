import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transaction_uuid = searchParams.get('transaction_uuid');

    if (transaction_uuid) {
      // Update order status in database
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${transaction_uuid}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed',
            paymentMethod: 'esewa',
            paymentId: transaction_uuid,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }

    return NextResponse.redirect(new URL('/payment/failure', request.url));
  } catch (error) {
    console.error('Error processing eSewa failure callback:', error);
    return NextResponse.redirect(new URL('/payment/failure', request.url));
  }
} 