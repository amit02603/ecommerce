// AppError is a custom error class we use throughout the app.
// It extends the built-in Error class so we can attach a statusCode to it.
// This way, in our error handler middleware, we can read the statusCode and
// send a proper HTTP response instead of always sending 500.

class AppError extends Error {
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;

    // Status is "fail" for 4xx errors (client mistakes) and "error" for 5xx (server problems)
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    // isOperational means this is a known, expected error (like "user not found").
    // Unhandled errors from bugs will NOT have this flag.
    this.isOperational = true;

    // Capture the stack trace for easier debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
