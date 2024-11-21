const User = require('../models/User');
const jwt = require('jsonwebtoken');
const gameShiftService = require('../services/gameShiftService');

exports.register = async (req, res) => {
  const { email, walletAddress, role } = req.body;

  try {
    // Kiểm tra role hợp lệ
    if (!['consumer', 'manufacturer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    // Kiểm tra ví đã được đăng ký chưa
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ message: 'Địa chỉ ví này đã được đăng ký.' });
    }

    // Chuẩn bị payload gửi đến GameShift
    const payload = {
      referenceId: walletAddress,
      email: email,
      externalWalletAddress: walletAddress,
    };

    console.log('Payload gửi đến GameShift:', payload);

    // Gọi API GameShift để đăng ký người dùng
    const gameShiftUser = await gameShiftService.createGameShiftUser(payload);

    if (!gameShiftUser || !gameShiftUser.referenceId) {
      return res.status(400).json({ message: 'Không nhận được referenceId hợp lệ từ GameShift.' });
    }

    console.log('Phản hồi từ GameShift:', gameShiftUser);

    // Lưu người dùng vào MongoDB
    const newUser = new User({
      email,
      walletAddress,
      referenceId: gameShiftUser.referenceId,
      role,
    });

    await newUser.save();
    console.log('Người dùng đã được lưu:', newUser);

    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    console.error('Lỗi khi đăng ký người dùng:', error.message);

    // Xử lý lỗi unique (MongoDB)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email hoặc Địa chỉ ví đã tồn tại trong hệ thống.',
      });
    }

    res.status(500).json({ message: 'Đăng ký thất bại.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { walletAddress, email } = req.body;

  try {
    console.log('Payload nhận từ client:', { walletAddress, email });

    // Tìm người dùng trong MongoDB
    let user = await User.findOne({ walletAddress, email });

    // Nếu không tìm thấy, thử lấy thông tin từ GameShift
    if (!user) {
      const gameShiftUser = await gameShiftService.fetchUserFromGameShift(walletAddress);

      if (!gameShiftUser || gameShiftUser.email !== email) {
        return res.status(404).json({ message: 'Người dùng không tồn tại trên GameShift.' });
      }

      console.log('Người dùng từ GameShift:', gameShiftUser);

      // Lưu người dùng mới vào MongoDB
      user = new User({
        email: gameShiftUser.email,
        walletAddress: gameShiftUser.referenceId,
        referenceId: gameShiftUser.referenceId,
        role: 'consumer', // Mặc định là consumer
      });

      await user.save();
      console.log('Người dùng được thêm vào MongoDB:', user);
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, walletAddress: user.walletAddress, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('JWT token:', token);

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: {
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);
    res.status(500).json({ message: 'Đăng nhập thất bại.', error: error.message });
  }
};
