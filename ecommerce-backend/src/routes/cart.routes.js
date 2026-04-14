const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:itemId", updateCartItem);
router.delete("/clear", clearCart); // Must come before /:itemId to avoid conflicts
router.delete("/:itemId", removeFromCart);

module.exports = router;
