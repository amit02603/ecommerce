const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// GET /api/v1/cart
const getCart = catchAsync(async function (req, res, next) {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name slug images price stock"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalAmount: 0 },
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// POST /api/v1/cart
// Adds a product to the cart or increases its quantity if already in the cart
const addToCart = catchAsync(async function (req, res, next) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new AppError("Product ID and quantity are required.", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  if (product.stock < quantity) {
    return next(
      new AppError(
        `Only ${product.stock} units of this product are available.`,
        400
      )
    );
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create a new cart if this user doesn't have one yet
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    // Check if the product is already in the cart
    const existingItem = cart.items.find(function (item) {
      return item.product.toString() === productId;
    });

    if (existingItem) {
      // Increase the quantity of the existing item
      existingItem.quantity += Number(quantity);
    } else {
      // Add a new item to the cart
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
  }

  const updatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name slug images price stock"
  );

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
});

// PUT /api/v1/cart/:itemId
// Update the quantity of a specific cart item
const updateCartItem = catchAsync(async function (req, res, next) {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new AppError("Quantity must be at least 1.", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found.", 404));
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return next(new AppError("Item not found in cart.", 404));
  }

  item.quantity = quantity;
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name slug images price stock"
  );

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
});

// DELETE /api/v1/cart/:itemId
// Remove a specific item from the cart
const removeFromCart = catchAsync(async function (req, res, next) {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found.", 404));
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return next(new AppError("Item not found in cart.", 404));
  }

  item.deleteOne();
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name slug images price stock"
  );

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
});

// DELETE /api/v1/cart (clear the entire cart)
const clearCart = catchAsync(async function (req, res, next) {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: "Cart cleared.",
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
