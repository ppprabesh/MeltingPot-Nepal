import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataParam = searchParams.get('data');

    if (!dataParam) {
      console.error('No data parameter received from eSewa');
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    // Decode the base64 data
    const decodedData = Buffer.from(dataParam, 'base64').toString('utf-8');
    const paymentData = JSON.parse(decodedData);

    const {
      transaction_uuid,
      total_amount,
      product_code,
      signature,
      status,
      transaction_code,
      signed_field_names
    } = paymentData;

    if (!transaction_uuid || !total_amount || !product_code || !signature || status !== 'COMPLETE') {
      console.error('Missing required fields or payment not complete:', paymentData);
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    // Format the total amount to match eSewa's format (remove commas and .0)
    const formattedAmount = total_amount.replace(/,/g, '').replace('.0', '');

    // Verify signature using eSewa's format
    const signatureString = `transaction_code=${transaction_code},status=${status},total_amount=${formattedAmount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
    
    console.log('Verifying signature with string:', signatureString);
    
    const hmac = crypto.createHmac('sha256', process.env.ESEWA_MERCHANT_SECRET!);
    hmac.update(signatureString);
    const calculatedSignature = hmac.digest('base64');

    console.log('Calculated signature:', calculatedSignature);
    console.log('Received signature:', signature);

    if (signature !== calculatedSignature) {
      console.error('Signature verification failed');
      return NextResponse.redirect(new URL('/payment/failure', request.url));
    }

    // Update order status in database
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${transaction_uuid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          paymentMethod: 'esewa',
          paymentId: transaction_uuid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Still redirect to success page as payment was successful
    }

    // Redirect to success page with order ID
    return NextResponse.redirect(new URL(`/payment/success?orderId=${transaction_uuid}`, request.url));
  } catch (error) {
    console.error('Error processing eSewa success callback:', error);
    return NextResponse.redirect(new URL('/payment/failure', request.url));
  }
} 