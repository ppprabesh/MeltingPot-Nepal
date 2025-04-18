'use server';

import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "@/lib/payment";

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
        const transactionUuid = `${Date.now()}-${uuidv4()}`;
        const esewaConfig = {
          amount: amount,
          tax_amount: "0",
          total_amount: amount,
          transaction_uuid: transactionUuid,
          product_code: process.env.ESEWA_MERCHANT_ID,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/esewa/success`,
          failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/esewa/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          process.env.ESEWA_MERCHANT_SECRET!,
          signatureString
        );

        return {
          success: true,
          data: {
            amount: amount,
            esewaConfig: {
              ...esewaConfig,
              signature,
              product_service_charge: Number(esewaConfig.product_service_charge),
              product_delivery_charge: Number(esewaConfig.product_delivery_charge),
              tax_amount: Number(esewaConfig.tax_amount),
              total_amount: Number(esewaConfig.total_amount),
            },
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

        console.log("Khalti Config:", khaltiConfig);
        console.log("Khalti Secret Key:", process.env.KHALTI_SECRET_KEY);

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
        console.log("Khalti payment initiated:", khaltiResponse);
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