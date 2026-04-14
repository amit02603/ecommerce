const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// GET /api/v1/categories
const getAllCategories = catchAsync(async function (req, res, next) {
  const categories = await Category.find().sort("name");

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// GET /api/v1/categories/:slug
const getCategory = catchAsync(async function (req, res, next) {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// POST /api/v1/categories (admin only)
const createCategory = catchAsync(async function (req, res, next) {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

// PUT /api/v1/categories/:id (admin only)
const updateCategory = catchAsync(async function (req, res, next) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// DELETE /api/v1/categories/:id (admin only)
const deleteCategory = catchAsync(async function (req, res, next) {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
