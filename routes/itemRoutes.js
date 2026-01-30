const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const upload = require("../config/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", authMiddleware.protect, upload.single("image"), itemController.registerItem);
router.post("/items/all", itemController.getAllItems);
router.post("/details", itemController.getItemDetails);
router.post("/account_item_list", itemController.getAccountItems);
router.post("/markasresolved", itemController.markResolved);

router.post("/claim", authMiddleware.protect, itemController.submitClaim);
router.get("/claims/:id", authMiddleware.protect, itemController.getClaims);

router.post("/items/archived", itemController.getArchivedItems);

module.exports = router;
