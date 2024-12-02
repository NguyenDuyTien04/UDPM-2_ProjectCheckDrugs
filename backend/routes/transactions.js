const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// API: Lấy số lượng giao dịch theo trạng thái
router.get("/statistics/status", async (req, res) => {
  try {
    // Lấy tất cả giao dịch từ MongoDB
    const transactions = await Transaction.find();

    // Tính số lượng giao dịch theo trạng thái
    const statusCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.status] = (acc[transaction.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      message: "Thống kê giao dịch theo trạng thái:",
      data: statusCounts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê giao dịch:", error.message);
    res.status(500).json({
      message: "Không thể lấy thống kê giao dịch.",
      error: error.message,
    });
  }
});

module.exports = router;
