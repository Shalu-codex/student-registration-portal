const express = require("express");

const {
  register,
  login,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

module.exports = router;