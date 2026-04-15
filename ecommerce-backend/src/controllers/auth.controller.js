const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendToken = require("../utils/sendToken");

// POST /api/v1/auth/register
const register = catchAsync(async function (req, res, next) {
  const { name, email, password } = req.body;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("An account with this email already exists.", 400));
  }

  const user = await User.create({ name, email, password });

  sendToken(user, 201, res);
});

// POST /api/v1/auth/login
const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  // Find the user by email and explicitly select the password field
  // (it's hidden by default with select: false in the schema)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password.", 401));
  }

  sendToken(user, 200, res);
});

// POST /api/v1/auth/logout
const logout = function (req, res) {
  // Clear the token cookie by setting it to an empty value
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// GET /api/v1/auth/me
const getMe = catchAsync(async function (req, res, next) {
  // req.user is set by the protect middleware so we know who is logged in
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = { register, login, logout, getMe };
