const Transaction = require('../models/Transaction');
const gameShiftService = require('../services/gameshiftService');

// Lấy tất cả giao dịch của người dùng và lưu ID vào MongoDB nếu chưa tồn tại
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await gameShiftService.fetchUserTransactions(req.user.walletAddress);

        // Lưu các giao dịch mới vào MongoDB (chỉ lưu ID)
        for (const tx of transactions) {
            const existingTransaction = await Transaction.findOne({ gameShiftTransactionId: tx.id });
            if (!existingTransaction) {
                const newTransaction = new Transaction({
                    gameShiftTransactionId: tx.id,
                });
                await newTransaction.save();
            }
        }

        res.status(200).json({
            message: 'Danh sách tất cả giao dịch:',
            data: transactions,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy giao dịch.', error: error.message });
    }
};

// Xác minh giao dịch
exports.verifyTransaction = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const verifyResult = await gameShiftService.verifyTransaction(transactionId, req.user.walletAddress);

        if (!verifyResult.success) {
            return res.status(400).json({ message: 'Xác minh giao dịch thất bại.', error: verifyResult });
        }

        res.status(200).json({
            message: 'Giao dịch đã được xác minh thành công!',
            data: verifyResult,
        });
    } catch (error) {
        console.error('Lỗi khi xác minh giao dịch:', error.message);
        res.status(500).json({ message: 'Lỗi khi xác minh giao dịch.', error: error.message });
    }
};
// Lấy thông tin chi tiết giao dịch từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
exports.getTransactionById = async (req, res) => {
    const { transactionId } = req.params;

    try {
        // Gọi service để lấy chi tiết giao dịch
        const transactionData = await gameShiftService.fetchTransactionById(transactionId);

        // Lưu ID vào MongoDB nếu chưa tồn tại
        const existingTransaction = await Transaction.findOne({ gameShiftTransactionId: transactionId });
        if (!existingTransaction) {
            const newTransaction = new Transaction({
                gameShiftTransactionId: transactionId,
            });
            await newTransaction.save();
        }

        res.status(200).json({
            message: 'Chi tiết giao dịch từ GameShift:',
            data: transactionData,
        });
    } catch (error) {
        console.error('Lỗi khi lấy giao dịch từ GameShift:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy giao dịch.', error: error.message });
    }
};



