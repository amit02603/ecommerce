const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const paymentService = require("../services/payment.service");

// POST /api/v1/payment/stripe/intent
// Creates a Stripe PaymentIntent and returns the client_secret to the frontend.
// The frontend uses this client_secret with Stripe.js to complete the payment.
const createStripePaymentIntent = catchAsync(async function (req, res, next) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError("A valid amount is required.", 400));
  }

  const paymentIntent = await paymentService.createPaymentIntent(amount, "inr");

  res.status(200).json({
    success: true,
    // client_secret is sent back to the frontend to confirm the payment
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = { createStripePaymentIntent };
