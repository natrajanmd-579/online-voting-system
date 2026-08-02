const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerRules, loginRules, updateProfileRules, changePasswordRules } = require("../validators/authValidator");

// Public
router.post("/register", authLimiter, registerRules, validate, authController.register);
router.post("/login", authLimiter, loginRules, validate, authController.login);

// Protected
router.get("/profile", verifyToken, authController.profile);
router.put("/profile", verifyToken, updateProfileRules, validate, authController.updateProfile);
router.put("/change-password", verifyToken, changePasswordRules, validate, authController.changePassword);
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
