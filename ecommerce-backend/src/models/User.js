const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Address sub-schema — each user can have multiple saved addresses
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      // select: false means password won't be returned in queries by default
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    addresses: [addressSchema],
  },
  {
    // timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Before saving a user, hash the password if it was changed
userSchema.pre("save", async function (next) {
  // If the password field wasn't modified, skip this step
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password with a cost factor of 12
  // Higher cost = more secure but slower. 12 is a good balance.
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
