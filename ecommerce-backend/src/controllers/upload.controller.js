const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const uploadService = require("../services/upload.service");

// POST /api/v1/upload/images (admin only)
// Accepts one or more image files and uploads them to Cloudinary
const uploadImages = catchAsync(async function (req, res, next) {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one image.", 400));
  }

  // Upload all files in parallel using Promise.all
  const uploadPromises = req.files.map(function (file) {
    return uploadService.uploadImage(file.buffer, "ecommerce/products");
  });

  const uploadedImages = await Promise.all(uploadPromises);

  res.status(200).json({
    success: true,
    images: uploadedImages,
  });
});

// DELETE /api/v1/upload/:publicId (admin only)
// Deletes a specific image from Cloudinary using its public_id
const deleteImage = catchAsync(async function (req, res, next) {
  // The public_id might contain slashes (e.g., "ecommerce/products/abc123")
  // so we use req.params[0] to capture the full path after /upload/
  const publicId = req.params[0];

  if (!publicId) {
    return next(new AppError("Image public ID is required.", 400));
  }

  await uploadService.deleteImage(publicId);

  res.status(200).json({
    success: true,
    message: "Image deleted from Cloudinary.",
  });
});

module.exports = { uploadImages, deleteImage };
