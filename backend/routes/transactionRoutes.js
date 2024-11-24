const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

// Lấy tất cả giao dịch của người dùng từ GameShift và lưu ID vào MongoDB nếu cần
router.get('/all', authMiddleware, transactionController.getAllTransactions);

// Xác minh giao dịch
router.post('/verify', authMiddleware, transactionController.verifyTransaction);

// Lấy thông tin chi tiết giao dịch từ GameShift
router.get('/:transactionId', transactionController.getTransactionById);

module.exports = router;
