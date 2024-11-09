// backend/models/NguoiDung.js
const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema({
    tenDangNhap: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matKhau: { type: String, required: true },
    vaiTro: { type: String, required: true }, // Ví dụ: "Admin", "Nhà sản xuất", "Người tiêu dùng"
    ngayTao: { type: Date, default: Date.now },
    ngayCapNhat: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NguoiDung', nguoiDungSchema);
