const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const nftController = require('../controllers/nftController');

const router = express.Router();

// Tạo NFT loại Certificate
router.post('/certificate/create', authMiddleware, nftController.createCertificateNFT);

// Tạo NFT loại Medicine
router.post('/medicine/create', authMiddleware, nftController.createMedicineNFT);

// Lấy danh sách tất cả NFT
router.get('/list', authMiddleware, nftController.getAllNFTs);

// Lấy danh sách NFT loại Certificate
router.get('/certificate/list', authMiddleware, nftController.getCertificateNFTs);

// Lấy danh sách NFT loại Medicine
router.get('/medicine/list', authMiddleware, nftController.getMedicineNFTs);

// Lấy thông tin chi tiết NFT
router.get('/:id', authMiddleware, nftController.getNFTById);

// Rao bán NFT
router.put('/sell/:id', authMiddleware, nftController.sellNFT);
module.exports = router;
