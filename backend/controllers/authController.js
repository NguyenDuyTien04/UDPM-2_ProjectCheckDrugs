const User = require('../models/User');
const jwt = require('jsonwebtoken');
const gameShiftService = require('../services/gameshiftService');

exports.register = async (req, res) => {
  const { email, walletAddress } = req.body;

  try {
    console.log('Đăng ký với email:', email, 'walletAddress:', walletAddress);

    const payload = {
      referenceId: walletAddress,
      email,
      externalWalletAddress: walletAddress,
    };

    console.log('Payload gửi đến GameShift:', payload);

    const gameShiftUser = await gameShiftService.createGameShiftUser(payload);

    if (!gameShiftUser || !gameShiftUser.referenceId) {
      console.error('GameShift trả về lỗi hoặc không có referenceId.');
      return res.status(400).json({ message: 'Không nhận được referenceId hợp lệ từ GameShift.' });
    }

    console.log('Phản hồi từ GameShift:', gameShiftUser);

    // Chỉ lưu ID từ GameShift
    const newUser = new User({
      gameShiftUserId: gameShiftUser.referenceId,
    });
    await newUser.save();

    console.log('Người dùng được lưu vào MongoDB:', newUser);

    res.status(201).json({ message: 'Đăng ký thành công!', userId: newUser.gameShiftUserId });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.message);
    res.status(500).json({ message: 'Đăng ký thất bại.', error: error.message });
  }
};


// Đăng nhập người dùng
exports.login = async (req, res) => {
  const { email, walletAddress } = req.body;

  try {
    console.log('Thông tin đăng nhập:', { email, walletAddress });

    // Gọi API GameShift để kiểm tra người dùng
    const gameShiftUser = await gameShiftService.fetchUserFromGameShift(walletAddress);

    // Nếu không tìm thấy người dùng trên GameShift
    if (!gameShiftUser || gameShiftUser.referenceId !== walletAddress || gameShiftUser.email !== email) {
      console.error('Người dùng không tồn tại hoặc thông tin không khớp.');
      return res.status(404).json({ message: 'Người dùng không tồn tại hoặc thông tin không chính xác.' });
    }

    console.log('Phản hồi từ GameShift:', gameShiftUser);

    // Tạo token JWT
    const token = jwt.sign(
      {
        id: gameShiftUser.referenceId,
        walletAddress: walletAddress,
        email: email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);

    // Kiểm tra lỗi từ GameShift API
    if (error.message.includes('User not found')) {
      return res.status(404).json({ message: 'Người dùng không tồn tại hoặc ví chưa đăng ký.' });
    }

    res.status(500).json({ message: 'Đăng nhập thất bại.', error: error.message });
  }
};
