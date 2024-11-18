const User = require('../models/User');

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    const { email, walletAddress } = req.body;
    const userId = req.user.id; // Lấy ID từ middleware xác thực

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Cập nhật thông tin
        user.email = email || user.email;
        user.walletAddress = walletAddress || user.walletAddress;

        const updatedUser = await user.save();
        res.status(200).json({ message: 'Cập nhật thành công!', data: updatedUser });
    } catch (err) {
        console.error('Lỗi khi cập nhật người dùng:', err.message);
        res.status(500).json({ message: 'Lỗi khi cập nhật người dùng.' });
    }
};
// Lấy thông tin người dùng
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Loại trừ mật khẩu
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err.message);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng.' });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Xóa tài khoản thành công.' });
    } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err.message);
        res.status(500).json({ message: 'Lỗi khi xóa tài khoản.' });
    }
};
// Lấy danh sách người dùng (chỉ admin)
exports.listUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Loại trừ mật khẩu
      res.status(200).json(users);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err.message);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
    }
  };
  