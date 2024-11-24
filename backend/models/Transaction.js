const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  gameShiftTransactionId: {
    type: String,
    required: true,
    unique: true, // Đảm bảo mỗi giao dịch là duy nhất
  },
  nftId: {
    type: String, // ID của NFT liên quan
    required: true,
  },
  userId: {
    type: String, // ID của người thực hiện giao dịch
    required: true,
  },
  action: {
    type: String, // "buy" hoặc "sell"
    enum: ['buy', 'sell'],
    required: true,
  },
  price: {
    type: Number, // Giá giao dịch
    default: null,
  },
  currency: {
    type: String, // Loại tiền (SOL, USDC, v.v.)
    enum: ['SOL', 'USDC'],
    default: null,
  },
  status: {
    type: String, // Trạng thái giao dịch
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending', // Trạng thái mặc định là "Pending"
  },
  consentUrl: {
    type: String, // URL yêu cầu xác nhận giao dịch từ GameShift
    default: null,
  },
  createdAt: {
    type: Date, // Thời gian tạo giao dịch
    default: Date.now,
  },
  updatedAt: {
    type: Date, // Thời gian cập nhật giao dịch
    default: Date.now,
  },
});

// Middleware để cập nhật `updatedAt` khi tài liệu được thay đổi
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
