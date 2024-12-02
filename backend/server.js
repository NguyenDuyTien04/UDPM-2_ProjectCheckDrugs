require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const collectionRoutes = require('./routes/collectionRoutes'); // Đảm bảo tên file routes đúng
const nftRoutes = require('./routes/nftRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const Transaction = require("./models/Transaction");



// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB đã kết nối!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Routes
// API để lấy trạng thái giao dịch
app.get("/api/transactions/status-counts", async (req, res) => {
  try {
    // Đếm số lượng giao dịch theo trạng thái
    const statusCounts = await Transaction.aggregate([
      {
        $group: {
          _id: "$status", // Nhóm theo trạng thái giao dịch
          count: { $sum: 1 } // Đếm số lượng giao dịch theo mỗi trạng thái
        }
      }
    ]);

    // Chuyển đổi kết quả nhóm thành đối tượng để dễ sử dụng trong frontend
    const result = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(result); // Trả về kết quả dưới dạng JSON
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái giao dịch:", error);
    res.status(500).send("Lỗi server khi lấy trạng thái giao dịch");
  }
});


// Cung cấp tệp tĩnh cho thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes); // Import đúng đường dẫn
app.use('/api/nft', nftRoutes);
app.use('/api/transactions', transactionRoutes);

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
