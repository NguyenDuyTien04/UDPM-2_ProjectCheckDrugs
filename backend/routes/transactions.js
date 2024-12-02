const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

app.get('/api/transactions/status-counts', async (req, res) => {
    try {
      const transactions = await Transaction.find();
  
      // Tính số lượng giao dịch theo trạng thái
      const statusCounts = transactions.reduce((acc, transaction) => {
        acc[transaction.status] = (acc[transaction.status] || 0) + 1;
        return acc;
      }, {});
  
      // Đảm bảo trả về 3 trạng thái, nếu không có giao dịch, mặc định trả về 0
      const result = {
        Pending: statusCounts.Pending || 0,
        Completed: statusCounts.Completed || 0,
        Failed: statusCounts.Failed || 0,
      };
  
      res.json(result);  // Trả về kết quả JSON
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái giao dịch:', error);
      res.status(500).json({ error: 'Không thể lấy trạng thái giao dịch' });
    }
  });

module.exports = router;
