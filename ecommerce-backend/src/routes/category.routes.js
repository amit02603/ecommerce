const express = require("express");
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

// Public routes — anyone can view categories
router.get("/", getAllCategories);
router.get("/:slug", getCategory);

// Admin-only routes
router.post("/", protect, restrictTo("admin"), createCategory);
router.put("/:id", protect, restrictTo("admin"), updateCategory);
router.delete("/:id", protect, restrictTo("admin"), deleteCategory);

module.exports = router;
