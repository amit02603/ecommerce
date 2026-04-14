const express = require("express");
const { createStripePaymentIntent } = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// User must be logged in to create a payment intent
router.post("/stripe/intent", protect, createStripePaymentIntent);

module.exports = router;
