const AppError = require("../utils/AppError");

// Global error handler middleware.
// Express knows this is an error handler because it has 4 parameters (err, req, res, next).
// Any error passed to next(error) in the app will end up here.

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const value = err.keyValue ? JSON.stringify(err.keyValue) : "field";
  const message = `Duplicate value for ${value}. Please use a different value.`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map(function (el) {
    return el.message;
  });
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError("Invalid token. Please log in again.", 401);
}

function handleJWTExpiredError() {
  return new AppError("Your session has expired. Please log in again.", 401);
}

function sendErrorDev(err, res) {
  // In development, send the full error with stack trace to help with debugging
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    // Operational, known errors — safe to show to the client
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown errors — don't leak error details to clients
    console.error("UNEXPECTED ERROR:", err);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong on the server.",
    });
  }
}

function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") error = handleCastErrorDB(error);
    // Mongoose duplicate key
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // Mongoose validation error
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    // Invalid JWT
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    // Expired JWT
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}

module.exports = errorHandler;
