const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load environment variables from the .env file before anything else
dotenv.config();

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const { apiLimiter } = require("./src/middleware/rateLimiter");

// Import all route files
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const cartRoutes = require("./src/routes/cart.routes");
const orderRoutes = require("./src/routes/order.routes");
const wishlistRoutes = require("./src/routes/wishlist.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const uploadRoutes = require("./src/routes/upload.routes");

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware — sets various HTTP headers to protect the app
app.use(helmet());

// Enable CORS so the frontend (on a different port) can talk to this server
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Needed to allow cookies to be sent
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Parse cookies on incoming requests
app.use(cookieParser());

// Log HTTP requests to the console in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply the general rate limiter to all API routes
app.use("/api/v1", apiLimiter);

// Mount all routers at their respective paths
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Basic health check endpoint
app.get("/", function (req, res) {
  res.json({ message: "eCommerce API is running." });
});

// Handle requests to unknown routes
// Express v5 requires {*splat} instead of * for catch-all routes
app.all("{*splat}", function (req, res, next) {
  const AppError = require("./src/utils/AppError");
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler — must be defined last, after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function () {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., DB query errors not caught anywhere)
process.on("unhandledRejection", function (error) {
  console.error("UNHANDLED REJECTION:", error.name, error.message);
  server.close(function () {
    process.exit(1);
  });
});

module.exports = app;
