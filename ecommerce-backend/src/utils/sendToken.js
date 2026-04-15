const jwt = require("jsonwebtoken");

// This function creates a JWT token, stores it in a cookie, and sends the response.
// We call it after login or register so we don't repeat this logic in both controllers.

function sendToken(user, statusCode, res) {
  // Create the JWT token using the user's ID and our secret key
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Cookie options — the cookie holds the token so it's sent automatically on each request
  const cookieOptions = {
    // Cookie expires after this many days
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
    ),
    // httpOnly means JavaScript in the browser cannot read this cookie (security)
    httpOnly: true,
    // In production, only send cookie over HTTPS
    secure: process.env.NODE_ENV === "production",
    // REQUIRED: For cross-domain cookies (Vercel Frontend <-> Render Backend)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  // Remove password from the response payload so it's never sent to the client
  user.password = undefined;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
    user,
  });
}

module.exports = sendToken;
