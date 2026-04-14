const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// GET /api/v1/users/profile
const getProfile = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// PUT /api/v1/users/profile
const updateProfile = catchAsync(async function (req, res, next) {
  // Only allow updating name and email from this endpoint
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on the new values
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// POST /api/v1/users/address
const addAddress = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.user._id);

  const newAddress = {
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    country: req.body.country,
    isDefault: req.body.isDefault || false,
  };

  // If the new address is marked as default, unset the current default first
  if (newAddress.isDefault) {
    user.addresses.forEach(function (address) {
      address.isDefault = false;
    });
  }

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    addresses: user.addresses,
  });
});

// PUT /api/v1/users/address/:addressId
const updateAddress = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new AppError("Address not found.", 404));
  }

  // If this address is being set as default, remove default from others
  if (req.body.isDefault) {
    user.addresses.forEach(function (addr) {
      addr.isDefault = false;
    });
  }

  // Update only the fields that were sent in the request
  address.street = req.body.street || address.street;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.postalCode = req.body.postalCode || address.postalCode;
  address.country = req.body.country || address.country;
  address.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : address.isDefault;

  await user.save();

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

// DELETE /api/v1/users/address/:addressId
const deleteAddress = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    return next(new AppError("Address not found.", 404));
  }

  address.deleteOne();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Address removed.",
    addresses: user.addresses,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
};
