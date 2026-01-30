const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/check", authMiddleware.protect, authController.checkAuth);
router.post("/footer", authMiddleware.protect, authController.getFooter);
router.get("/users/:username", authController.getPublicProfile);
router.put("/profile", authMiddleware.protect, authController.updateProfile);

module.exports = router;
