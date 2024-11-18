const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc.'],
      unique: true,
      match: [/.+\@.+\..+/, 'Email không hợp lệ.'], // Regex kiểm tra định dạng email
    },
    walletAddress: {
      type: String,
      required: [true, 'Địa chỉ ví là bắt buộc.'],
      unique: true, // Đảm bảo không có địa chỉ ví trùng lặp
    },
    referenceId: {
      type: String,
      required: [true, 'Reference ID là bắt buộc.'], // Reference ID trùng với địa chỉ ví
    },
    gameShiftUserId: {
      type: Number,
      unique: true, // Đảm bảo mỗi tài khoản có một ID duy nhất
    },
    role: {
      type: String,
      enum: ['user', 'consumer', 'manufacturer'], // Các vai trò hợp lệ
      default: 'user', // Giá trị mặc định là "user"
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

// Plugin tự động tăng `gameShiftUserId` bắt đầu từ 1
userSchema.plugin(AutoIncrement, {
  inc_field: 'gameShiftUserId', // Tên trường tự động tăng
  start_seq: 1, // Bắt đầu từ 1
});

// Xuất model
module.exports = mongoose.model('User', userSchema);
