const User = require('../models/User');
const jwt = require('jsonwebtoken');
const gameShiftService = require('../services/gameShiftService');

exports.register = async (req, res) => {
  const { email, walletAddress, referenceId } = req.body;

  try {
    // Kiểm tra ví đã được đăng ký chưa
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ message: "Ví này đã được đăng ký." });
    }

    // Gọi API GameShift để kiểm tra/đăng ký user trên GameShift
    const gameShiftUser = await gameShiftService.createGameShiftUser({
      email,
      walletAddress,
      referenceId,
    });

    if (!gameShiftUser || !gameShiftUser.id) {
      return res
        .status(400)
        .json({ message: "Lỗi khi tạo tài khoản trên GameShift. Không nhận được ID hợp lệ." });
    }

    // Lưu thông tin người dùng vào MongoDB
    const newUser = new User({
      email,
      walletAddress,
      referenceId,
      gameShiftUserId: gameShiftUser.id,
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error.message);

    // Xử lý lỗi unique (lỗi MongoDB)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email hoặc Địa chỉ ví đã được sử dụng. Vui lòng thử lại." });
    }

    res.status(500).json({ message: "Lỗi khi đăng ký người dùng.", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { walletAddress, email } = req.body;

  try {
    console.log('Dữ liệu nhận từ client:', { walletAddress, email });

    // Kiểm tra người dùng trong MongoDB
    const user = await User.findOne({ walletAddress, email });
    if (!user) {
      console.log('Không tìm thấy người dùng trong MongoDB.');
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    console.log('Thông tin người dùng từ MongoDB:', user);

    // Lấy thông tin từ GameShift API
    const gameShiftUser = await gameShiftService.fetchGameShiftUser(user.referenceId);
    console.log('Thông tin từ GameShift:', gameShiftUser);

    // Kiểm tra thông tin từ GameShift
    if (
      !gameShiftUser ||
      gameShiftUser.referenceId !== user.referenceId ||
      gameShiftUser.email !== user.email
    ) {
      console.log('Dữ liệu từ GameShift không khớp hoặc không tồn tại.');
      return res
        .status(400)
        .json({ message: "Người dùng chưa được đăng ký trên GameShift." });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log('JWT token:', token);

    // Trả về kết quả
    return res.status(200).json({
      message: "Đăng nhập thành công!",
      user: {
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
      },
      token, // Trả token về client
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    return res.status(500).json({ message: "Lỗi khi đăng nhập.", error: error.message });
  }
};


