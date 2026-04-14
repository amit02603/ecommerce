const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// This middleware runs after the express-validator checks in a route.
// It collects all validation errors and sends them back in a standard format.

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(function (error) {
      return error.msg;
    });

    return next(new AppError(errorMessages.join(". "), 400));
  }

  next();
}

module.exports = validate;
