const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Đã kết nối MongoDB'))
.catch((err) => console.error('Lỗi kết nối MongoDB:', err));

try {
    // Sử dụng các route
    app.use('/api/auth', require('./router/auth'));
    app.use('/api/thuoc', require('./router/thuoc'));

} catch (err) {
    console.error('Lỗi khi yêu cầu các route:', err);
}

// Thiết lập cổng và khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
