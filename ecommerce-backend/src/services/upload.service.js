const cloudinary = require("../config/cloudinary");

// Uploads a single image buffer to Cloudinary and returns the public_id and url
async function uploadImage(buffer, folder) {
  return new Promise(function (resolve, reject) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder || "ecommerce" },
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

// Deletes an image from Cloudinary using its public_id
async function deleteImage(publicId) {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
}

module.exports = { uploadImage, deleteImage };
