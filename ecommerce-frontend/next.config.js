/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow images from Cloudinary
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Allow images from Unsplash (used for seed/demo product images)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Allow images from Lorem Picsum (for testing/placeholders)
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
