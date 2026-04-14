const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middleware/auth");
const { orderValidator } = require("../validators/order.validator");
const validate = require("../middleware/validate");

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post("/", orderValidator, validate, placeOrder);
router.get("/mine", getMyOrders);
router.get("/:id", getOrderById);

// Admin-only routes
router.get("/", restrictTo("admin"), getAllOrders);
router.put("/:id/status", restrictTo("admin"), updateOrderStatus);

module.exports = router;
