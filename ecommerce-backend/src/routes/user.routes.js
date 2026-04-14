const express = require("express");
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/address", addAddress);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);

module.exports = router;
