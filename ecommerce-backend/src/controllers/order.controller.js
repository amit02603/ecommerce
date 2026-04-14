const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// POST /api/v1/orders
// Place an order and deduct stock from products
const placeOrder = catchAsync(async function (req, res, next) {
  const { items, shippingAddress, paymentInfo } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("No items in the order.", 400));
  }

  // Build order items and calculate prices
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError(`Product with ID ${item.product} not found.`, 404));
    }

    if (product.stock < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for "${product.name}". Available: ${product.stock}`,
          400
        )
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] ? product.images[0].url : "",
      price: product.price,
      quantity: item.quantity,
    });

    itemsPrice += product.price * item.quantity;

    // Deduct the ordered quantity from the product's stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping above ₹500
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Clear the user's cart after the order is placed
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalAmount: 0 }
  );

  res.status(201).json({
    success: true,
    order,
  });
});

// GET /api/v1/orders/mine
// Get all orders placed by the currently logged-in user
const getMyOrders = catchAsync(async function (req, res, next) {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// GET /api/v1/orders/:id
// Get a single order by ID — the user can only see their own orders
const getOrderById = catchAsync(async function (req, res, next) {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  // Make sure the order belongs to the requesting user (unless they're admin)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to view this order.", 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// GET /api/v1/orders (admin only)
// Get all orders in the system
const getAllOrders = catchAsync(async function (req, res, next) {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  const totalRevenue = orders.reduce(function (sum, order) {
    return sum + order.totalPrice;
  }, 0);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalRevenue,
    orders,
  });
});

// PUT /api/v1/orders/:id/status (admin only)
// Update the status of an order
const updateOrderStatus = catchAsync(async function (req, res, next) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  if (order.orderStatus === "delivered") {
    return next(new AppError("This order has already been delivered.", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
