const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// GET /api/v1/wishlist
const getWishlist = catchAsync(async function (req, res, next) {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "name images price slug ratings"
  );

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: { products: [] },
    });
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});

// POST /api/v1/wishlist
// Add a product to the wishlist (if not already there)
const addToWishlist = catchAsync(async function (req, res, next) {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    // Only add if it's not already in the wishlist
    const alreadyInWishlist = wishlist.products.some(function (id) {
      return id.toString() === productId;
    });

    if (alreadyInWishlist) {
      return next(new AppError("Product is already in your wishlist.", 400));
    }

    wishlist.products.push(productId);
    await wishlist.save();
  }

  // Re-fetch with products populated so the frontend gets full product data,
  // not just raw ObjectIds (which caused the missing key/alt errors)
  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "products",
    "name images price slug ratings"
  );

  res.status(200).json({
    success: true,
    message: "Product added to wishlist.",
    wishlist: populatedWishlist,
  });
});

// DELETE /api/v1/wishlist/:productId
const removeFromWishlist = catchAsync(async function (req, res, next) {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return next(new AppError("Wishlist not found.", 404));
  }

  wishlist.products = wishlist.products.filter(function (id) {
    return id.toString() !== req.params.productId;
  });

  await wishlist.save();

  // Re-fetch with products populated so the frontend gets full product data
  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "products",
    "name images price slug ratings"
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist.",
    wishlist: populatedWishlist,
  });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
