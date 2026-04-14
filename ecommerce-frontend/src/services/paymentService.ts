import apiClient from "@/lib/axios";

interface PaymentIntentResponse {
  success: boolean;
  clientSecret: string;
}

// Call the backend to create a Stripe PaymentIntent.
// Returns the client_secret which is used by Stripe.js on the frontend to confirm payment.
export async function createPaymentIntent(
  amount: number
): Promise<PaymentIntentResponse> {
  const response = await apiClient.post<PaymentIntentResponse>(
    "/payment/stripe/intent",
    { amount }
  );
  return response.data;
}
