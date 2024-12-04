// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const transactionController = require('../controllers/transactionController');

// // Lấy tất cả giao dịch của người dùng từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
// router.get('/all', authMiddleware, async (req, res) => {
//     try {
//         const transactions = await transactionController.getAllTransactions(req, res);
//         res.status(200).json(transactions);
//     } catch (error) {
//         console.error('Lỗi khi lấy tất cả giao dịch:', error.message);
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách giao dịch.', error: error.message });
//     }
// });

// // Xác minh giao dịch
// router.post('/verify', authMiddleware, async (req, res) => {
//     const { transactionId } = req.body;
//     try {
//         const verificationResponse = await transactionController.verifyTransaction(transactionId, req, res);
//         res.status(200).json(verificationResponse);
//     } catch (error) {
//         console.error('Lỗi khi xác minh giao dịch:', error.message);
//         res.status(500).json({ message: 'Lỗi khi xác minh giao dịch.', error: error.message });
//     }
// });

// // Lấy thông tin chi tiết giao dịch từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
// router.get('/:transactionId', async (req, res) => {
//     const { transactionId } = req.params;
//     try {
//         const transactionDetails = await transactionController.getTransactionById(transactionId, req, res);
//         res.status(200).json(transactionDetails);
//     } catch (error) {
//         console.error('Lỗi khi lấy chi tiết giao dịch:', error.message);
//         res.status(500).json({ message: 'Lỗi khi lấy chi tiết giao dịch.', error: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

// Lấy tất cả giao dịch của người dùng từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
router.get('/transactions/all', authMiddleware, async (req, res) => {
    try {
        const transactions = await transactionController.getAllTransactions(req, res);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách giao dịch.', error: error.message });
    }
});

// Xác minh giao dịch
router.post('/verify', authMiddleware, async (req, res) => {
    const { transactionId } = req.body;
    try {
        const verificationResponse = await transactionController.verifyTransaction(transactionId, req, res);
        res.status(200).json(verificationResponse);
    } catch (error) {
        console.error('Lỗi khi xác minh giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi xác minh giao dịch.', error: error.message });
    }
});

// Lấy thông tin chi tiết giao dịch từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
router.get('/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    try {
        const transactionDetails = await transactionController.getTransactionById(transactionId, req, res);
        res.status(200).json(transactionDetails);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết giao dịch.', error: error.message });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const transactionController = require('../controllers/transactionController');

// // Endpoint để lấy lịch sử giao dịch
// router.get('/users/:userId/transaction-history', transactionController.getTransactionHistory);

// module.exports = router;

