// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const drugRoutes = require('./routes/drugRoutes');
const nftRoutes = require('./routes/nftRoutes');

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB đã kết nối!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/nft', nftRoutes);

// Kiểm tra sức khỏe của server
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API đang hoạt động bình thường!' });
});

// Middleware xử lý lỗi 404
app.use((req, res) => {
  console.error(`Route không tồn tại: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route không tồn tại.' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});
