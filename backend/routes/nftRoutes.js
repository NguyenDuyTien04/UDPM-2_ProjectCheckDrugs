const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const nftController = require('../controllers/nftController');
const  itemController= require('../controllers/Itemcontroller');

// Tạo NFT mới
router.post('/create', authMiddleware, nftController.createNFT);

// Lấy tất cả NFT (chỉ trả về ID từ MongoDB)
router.get('/', authMiddleware, nftController.getAllNFTs);

// Rao bán NFT
router.post('/sell/:id', authMiddleware, nftController.sellNFT);

// Hủy NFT  
router.post('/cancel/:id', authMiddleware, nftController.cancelNFTListing);

// Mua NFT
router.post('/buy/:id', authMiddleware, nftController.buyNFT);

// Lấy tất cả NFT từ GameShift và lưu ID vào MongoDB (nếu chưa tồn tại)
router.get('/gameshift/list', authMiddleware, nftController.getAllNFTsFromGameShift);

// API để lấy danh sách NFT đang được rao bán
router.get('/for-sale', nftController.getNFTsForSale);

// Route để lấy danh sách NFT trong một bộ sưu tập
router.get('/collection', authMiddleware, nftController.getNFTsByCollection);


// lấy thông tin theo id nft
router.get('/nfts/:nftId', itemController.fetchNFTFromGameShift);

module.exports = router;