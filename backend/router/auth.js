//Đây là file router/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung'); // Model người dùng
const router = express.Router();
require('dotenv').config(); // Load biến môi trường từ file .env

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
    const { tenDangNhap, email, matKhau, vaiTro } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(matKhau, saltRounds);

        const nguoiDung = new NguoiDung({
            tenDangNhap,
            email,
            matKhau: hashedPassword,
            vaiTro,
            ngayTao: new Date(),
            ngayCapNhat: new Date(),
        });

        await nguoiDung.save();
        res.status(201).json({ message: "Đăng ký thành công", nguoiDung });
    } catch (err) {
        console.error('Đăng ký lỗi:', err.message);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký." });
    }
});

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
    const { email, matKhau } = req.body;

    try {
        const nguoiDung = await NguoiDung.findOne({ email });
        if (!nguoiDung) return res.status(400).json({ message: "Người dùng không tồn tại" });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(matKhau, nguoiDung.matKhau);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác" });

        // Tạo token JWT
        const token = jwt.sign(
            { id: nguoiDung._id, vaiTro: nguoiDung.vaiTro },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Trả về token, vai trò và ID người dùng
        res.json({ token, vaiTro: nguoiDung.vaiTro, id: nguoiDung._id });
    } catch (err) {
        console.error('Đăng nhập lỗi:', err.message);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập." });
    }
});

module.exports = router;
