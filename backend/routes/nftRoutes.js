const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware kiểm tra đăng nhập
const nftController = require("../controllers/nftController");

const router = express.Router();

// Route: Tạo NFT
router.post("/create", authMiddleware, nftController.createNFT);

module.exports = router;
