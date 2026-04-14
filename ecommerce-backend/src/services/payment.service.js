const stripe = require("../config/stripe");

// Creates a Stripe PaymentIntent for the given amount.
// A PaymentIntent tracks the lifecycle of a payment on Stripe's side.
// The frontend uses the returned client_secret to complete the payment.

async function createPaymentIntent(amount, currency) {
  // Stripe amounts are in the smallest currency unit (e.g., paise for INR, cents for USD)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise/cents
    currency: currency || "inr",
    payment_method_types: ["card"],
  });

  return paymentIntent;
}

module.exports = { createPaymentIntent };
