const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.protect, notificationController.getNotifications);
router.post("/:id/read", authMiddleware.protect, notificationController.markAsRead);

module.exports = router;
