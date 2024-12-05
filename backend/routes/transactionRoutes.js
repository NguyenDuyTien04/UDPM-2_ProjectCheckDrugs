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
const Transaction = require('../models/Transaction');

// Lấy tất cả giao dịch của người dùng từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
router.get('api/transactions/all', authMiddleware, async (req, res) => {
    try {
        const transactions = await transactionController.getAllTransactions(req, res);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách giao dịch.', error: error.message });
    }
});
// Lấy danh sách lịch sử giao dịch
router.get('/api/transactions/history', async (req, res) => {
    try {
      // Lấy tất cả giao dịch từ database
      const transactions = await Transaction.find({}, { _id: 0, id: 1, status: 1, amount: 1, date: 1 });
  
      // Nếu không có giao dịch, trả về danh sách rỗng
      if (!transactions || transactions.length === 0) {
        return res.json([]);
      }
  
      res.json(transactions); // Trả về danh sách giao dịch dưới dạng JSON
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử giao dịch:', error);
      res.status(500).json({ error: 'Không thể lấy lịch sử giao dịch.' });
    }
    res.json([]);
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
