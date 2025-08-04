const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
