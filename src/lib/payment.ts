import crypto from "crypto";

export const ESEWA_CONFIG = {
  baseUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2",
  merchantId: process.env.ESEWA_MERCHANT_ID,
  merchantSecret: process.env.ESEWA_MERCHANT_SECRET,
};

export const KHALTI_CONFIG = {
  baseUrl: "https://a.khalti.com/api/v2",
  secretKey: process.env.KHALTI_SECRET_KEY,
};

export function generateEsewaSignature(message: string): string {
  if (!ESEWA_CONFIG.merchantSecret) {
    throw new Error("Esewa merchant secret is not configured");
  }

  const hmac = crypto.createHmac("sha256", ESEWA_CONFIG.merchantSecret);
  hmac.update(message);
  return hmac.digest("base64");
}

export function validateEsewaResponse(signature: string, message: string): boolean {
  const expectedSignature = generateEsewaSignature(message);
  return signature === expectedSignature;
}

export function formatKhaltiAmount(amount: number): number {
  // Convert to paisa (smallest currency unit)
  return Math.round(amount * 100);
}

export function generateKhaltiHeaders() {
  if (!KHALTI_CONFIG.secretKey) {
    throw new Error("Khalti secret key is not configured");
  }

  return {
    Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
    "Content-Type": "application/json",
  };
}

export function validateKhaltiResponse(response: any): boolean {
  return (
    response &&
    response.pidx &&
    response.payment_url &&
    response.expires_at &&
    response.expires_in
  );
}

export function getPaymentStatus(status: string): "pending" | "success" | "failed" {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return "success";
    case "failed":
    case "cancelled":
      return "failed";
    default:
      return "pending";
  }
} 