const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// protect — checks if the user is logged in
// It looks for the JWT in the Authorization header or in the cookie
const protect = catchAsync(async function (req, res, next) {
  let token;

  // Check the Authorization header first: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // Fall back to the cookie if no header is present
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401));
  }

  // Verify the token (this will throw if it's invalid or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check that the user still exists (they might have been deleted after token was issued)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  // Attach the user to the request object so later middleware/controllers can use it
  req.user = currentUser;
  next();
});

// restrictTo — allows only certain roles to access a route
// Usage: restrictTo("admin") or restrictTo("admin", "manager")
function restrictTo(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
}

module.exports = { protect, restrictTo };
