const rateLimit = require("express-rate-limit");

// Rate limiter for auth routes (login, register).
// Allows 20 requests every 15 minutes from the same IP.
// This prevents brute force attacks on user accounts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 20,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the RateLimit headers
  legacyHeaders: false,
});

// General API rate limiter for all other routes.
// Allows 200 requests every 15 minutes from the same IP.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
