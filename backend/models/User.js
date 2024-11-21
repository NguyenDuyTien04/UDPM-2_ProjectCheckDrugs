const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc.'],
      unique: true,
      match: [/.+\@.+\..+/, 'Email không hợp lệ.'],
      set: (v) => v.toLowerCase(), // Lưu email dưới dạng chữ thường
    },
    walletAddress: {
      type: String,
      required: [true, 'Địa chỉ ví là bắt buộc.'],
      unique: true,
      set: (v) => v.toLowerCase(), // Lưu địa chỉ ví dưới dạng chữ thường
    },
    referenceId: {
      type: String,
      required: [true, 'Reference ID là bắt buộc.'],
      unique: true, // Đảm bảo referenceId là duy nhất
    },
    role: {
      type: String,
      enum: ['user', 'consumer', 'manufacturer', 'admin'], // Các vai trò hợp lệ
      default: 'user',
    },
  },
  {
    timestamps: true, // Thêm `createdAt` và `updatedAt` tự động
  }
);

// Trước khi lưu: Kiểm tra các trường bắt buộc hoặc định dạng không hợp lệ
userSchema.pre('save', function (next) {
  if (!this.email || !this.walletAddress || !this.referenceId) {
    return next(new Error('Thiếu thông tin bắt buộc (email, walletAddress, referenceId).'));
  }
  next();
});

// Tạo Model User từ schema
module.exports = mongoose.model('User', userSchema);
