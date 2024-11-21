// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Lấy Header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Tách token từ header dạng 'Bearer <token>'

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gán thông tin người dùng đã giải mã vào req.user để sử dụng trong các route tiếp theo
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;