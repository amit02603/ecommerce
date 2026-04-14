const mongoose = require("mongoose");

// This function connects to MongoDB using the URI from environment variables
async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with failure code if DB connection fails
    process.exit(1);
  }
}

module.exports = connectDB;
