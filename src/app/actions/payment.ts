'use server';

import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto';

export type PaymentMethod = "khalti" | "esewa";

export type PaymentRequestData = {
  amount: string;
  productName: string;
  transactionId: string;
  method: PaymentMethod;
};

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_BASE_URL",
    "ESEWA_MERCHANT_ID",
    "ESEWA_MERCHANT_SECRET",
    "KHALTI_SECRET_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function initiatePayment(paymentData: PaymentRequestData) {
  try {
    validateEnvironmentVariables();
    const { amount, productName, transactionId, method } = paymentData;

    if (!amount || !productName || !transactionId || !method) {
      throw new Error("Missing required fields");
    }

    switch (method) {
      case "esewa": {
        const totalAmount = amount;
        const transactionUuid = transactionId;
        const productCode = process.env.ESEWA_MERCHANT_ID!;

        console.log('Initiating eSewa payment with:', {
          totalAmount,
          transactionUuid,
          productCode,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL
        });

        // Create signature string
        const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        console.log('Signature string:', signatureString);
        
        // Generate HMAC signature
        const hmac = crypto.createHmac('sha256', process.env.ESEWA_MERCHANT_SECRET!);
        hmac.update(signatureString);
        const signature = hmac.digest('base64');
        console.log('Generated signature:', signature);

        // Ensure base URL ends with no trailing slash
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '');

        const esewaConfig = {
          amount: totalAmount,
          tax_amount: "0",
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          product_code: productCode,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${baseUrl}/payment/esewa/success`,
          failure_url: `${baseUrl}/payment/esewa/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: signature,
          product_name: productName
        };

        // Validate all required fields are present and non-empty
        const requiredFields = [
          'amount', 'tax_amount', 'total_amount', 'transaction_uuid',
          'product_code', 'success_url', 'failure_url', 'signature'
        ];
        
        for (const field of requiredFields) {
          if (!esewaConfig[field]) {
            throw new Error(`Missing required eSewa field: ${field}`);
          }
        }

        console.log('eSewa config:', esewaConfig);

        return {
          success: true,
          data: {
            esewaConfig
          },
        };
      }

      case "khalti": {
        const khaltiConfig = {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/khalti/success`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: Math.round(parseFloat(amount) * 100), // Convert to paisa
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: "Test Customer",
            email: "test@khalti.com",
            phone: "9800000000",
          },
        };

        const response = await fetch(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(khaltiConfig),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Khalti API Error:", errorData);
          throw new Error(
            `Khalti payment initiation failed: ${JSON.stringify(errorData)}`
          );
        }

        const khaltiResponse = await response.json();
        return {
          success: true,
          data: {
            khaltiPaymentUrl: khaltiResponse.payment_url,
          },
        };
      }

      default:
        throw new Error("Invalid payment method");
    }
  } catch (error) {
    console.error("Payment API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 