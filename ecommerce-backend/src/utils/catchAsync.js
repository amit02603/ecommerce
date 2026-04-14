// catchAsync is a helper function that wraps async route handlers.
// Without it, we would need try/catch blocks inside every async controller.
// Instead, we wrap the function here and any error it throws is passed
// to Express's next() so the global error handler can deal with it.

function catchAsync(asyncFunction) {
  return function (req, res, next) {
    asyncFunction(req, res, next).catch(next);
  };
}

module.exports = catchAsync;
