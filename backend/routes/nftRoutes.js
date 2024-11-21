// routes/nftRouter.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const nftController = require('../controllers/nftController');

// Route: Mua NFT
router.post('/purchase', authMiddleware, nftController.purchaseNFT);

// Route: Tạo NFT (Chỉ admin)
router.post('/create', authMiddleware, nftController.createNFT);

module.exports = router;
