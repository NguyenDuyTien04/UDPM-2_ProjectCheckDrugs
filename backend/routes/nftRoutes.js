const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const nftController = require('../controllers/nftController');

// **Routes liên quan đến NFT (chức năng cơ bản)**
// Tạo NFT mới
router.post('/create', authMiddleware, nftController.createNFT);
// Lấy tất cả NFT (chỉ trả về ID từ MongoDB)
router.get('/', authMiddleware, nftController.getAllNFTs);
// Lấy chi tiết NFT
router.get('/details/:id', authMiddleware, nftController.getNFTDetails);
// Rao bán NFT
router.post('/sell/:id', authMiddleware, nftController.sellNFT);
// Hủy NFT Listing
router.post('/cancel/:id', authMiddleware, nftController.cancelNFTListing);
// Mua NFT
router.post('/buy/:id', authMiddleware, nftController.buyNFT);

// **Routes liên quan đến GameShift**
// Lấy tất cả NFT từ GameShift và lưu ID vào MongoDB (nếu chưa tồn tại)
router.get('/gameshift/list', authMiddleware, nftController.getAllNFTsFromGameShift);
// Lấy danh sách NFT đang được rao bán
router.get('/for-sale', nftController.getNFTsForSale);

// **Routes liên quan đến người dùng**
// Lấy danh sách NFT của người dùng
router.get('/user-nfts', authMiddleware, nftController.getUserNFTs);

// **Routes liên quan đến bộ sưu tập**
// Lấy danh sách NFT trong một bộ sưu tập
router.get('/:collectionId', authMiddleware, nftController.getNFTsByCollection);


module.exports = router;
