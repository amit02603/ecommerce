const multer = require("multer");
const AppError = require("../utils/AppError");

// Use memory storage so files are kept in a buffer instead of written to disk.
// We then pass this buffer directly to Cloudinary from the upload service.
const storage = multer.memoryStorage();

// Only allow image file types (jpeg, jpg, png, webp)
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new AppError("Only image files are allowed.", 400), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Maximum file size: 5 MB
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
