const { body } = require("express-validator");

// Validation rules for placing an order
const orderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),

  body("items.*.product")
    .notEmpty()
    .withMessage("Each item must reference a product")
    .isMongoId()
    .withMessage("Product ID must be valid"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
];

module.exports = { orderValidator };
