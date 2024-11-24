const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Xác minh và giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán payload vào req.user

    console.log('Token payload:', decoded);

    if (!req.user.walletAddress) {
      console.error('Lỗi: walletAddress không có trong token payload');
    }

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
