const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/ApiFeatures");

// GET /api/v1/products
// Supports search, filter, sort, and pagination via query params
const getAllProducts = catchAsync(async function (req, res, next) {
  const features = new ApiFeatures(
    Product.find().populate("category", "name slug"),
    req.query
  )
    .search()
    .filter();

  // Count total products matching the filter (for pagination info in frontend)
  const totalCount = await features.query.clone().countDocuments();

  features.sort().paginate(12); // 12 products per page by default

  const products = await features.query;

  res.status(200).json({
    success: true,
    count: products.length,
    totalCount,
    products,
  });
});

// GET /api/v1/products/:slug
const getProduct = catchAsync(async function (req, res, next) {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name slug"
  );

  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// POST /api/v1/products (admin only)
const createProduct = catchAsync(async function (req, res, next) {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// PUT /api/v1/products/:id (admin only)
const updateProduct = catchAsync(async function (req, res, next) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// DELETE /api/v1/products/:id (admin only)
const deleteProduct = catchAsync(async function (req, res, next) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
