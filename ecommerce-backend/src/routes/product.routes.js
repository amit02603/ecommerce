const express = require("express");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../middleware/auth");
const { productValidator } = require("../validators/product.validator");
const validate = require("../middleware/validate");

const router = express.Router();

// Public routes — anyone can browse products
router.get("/", getAllProducts);
router.get("/:slug", getProduct);

// Admin-only routes — must be logged in and have the admin role
router.post(
  "/",
  protect,
  restrictTo("admin"),
  productValidator,
  validate,
  createProduct
);
router.put("/:id", protect, restrictTo("admin"), updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

module.exports = router;
