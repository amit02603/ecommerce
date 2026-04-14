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

// Express v5 requires /*splat instead of /* for wildcard routes.
// The public_id (e.g. "ecommerce/products/abc123") is captured in req.params.splat
router.delete("/*splat", protect, restrictTo("admin"), deleteImage);

module.exports = router;
