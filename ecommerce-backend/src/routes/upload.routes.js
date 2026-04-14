const express = require("express");
const { uploadImages, deleteImage } = require("../controllers/upload.controller");
const { protect, restrictTo } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Only admins can upload or delete images
router.post(
  "/images",
  protect,
  restrictTo("admin"),
  upload.array("images", 5), // Accept up to 5 images at once
  uploadImages
);

// Use a wildcard to capture public IDs that include slashes (e.g., "ecommerce/products/abc")
router.delete("/*", protect, restrictTo("admin"), deleteImage);

module.exports = router;
