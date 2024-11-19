//Đây là file router/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const NguoiDung = require('../models/NguoiDung'); // Model người dùng
const router = express.Router();
require('dotenv').config(); // Load biến môi trường từ file .env

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
    const { tenDangNhap, email, matKhau, vaiTro, walletAddress } = req.body;

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

        // Mint NFT cho nhà sản xuất hoặc người mua
        if (vaiTro === 'Nhà sản xuất' || vaiTro === 'Người mua') {
            try {
                const response = await axios.post('https://api.gameshift.dev/nx/nft/create', {
                    referenceId: nguoiDung._id.toString(),
                    type: vaiTro === 'Nhà sản xuất' ? 'manufacturer' : 'buyer',
                    walletAddress
                }, {
                    headers: {
                        accept: 'application/json',
                        'x-api-key': process.env.GAMESHIFT_API_KEY
                    }
                });

                console.log('Mint NFT thành công:', response.data);
            } catch (error) {
                console.error('Mint NFT thất bại:', error.response ? error.response.data : error.message);
            }
        }

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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await NguoiDung.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại." });
      }
  
      // Giả lập gửi email với OTP
      const otp = '123456'; // Fake OTP
      console.log(`Gửi OTP: ${otp} đến email: ${email}`);
      res.status(200).json({ message: 'OTP đã được gửi qua email' });
  
    } catch (err) {
      res.status(500).json({ message: "Có lỗi xảy ra." });
    }
  });
  

module.exports = router;
