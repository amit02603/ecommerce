const mongoose = require("mongoose");

// Sub-schema for each item inside the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  // We store the price at the time the item was added to cart.
  // This way, if the price changes later, the cart price stays accurate.
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart document per user
    },
    items: [cartItemSchema],
    // Total price of all items in the cart
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Recalculate total amount before every save
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
