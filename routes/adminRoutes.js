const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");


router.use(authMiddleware.protect, authMiddleware.adminOnly);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getAllUsers);
router.get("/items", adminController.getAllItems);
router.delete("/items/:id", adminController.deleteItem);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
