
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shipment = require('../models/Shipment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const shipments = [
      {
        id: 'SH001',
        recipientName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận X, Hà Nội',
        status: 'Đang vận chuyển',
        lastUpdated: '2024-11-25T10:30:00',
      },
      {
        id: 'SH002',
        recipientName: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận Y, Hồ Chí Minh',
        status: 'Đã giao hàng',
        lastUpdated: '2024-11-24T15:20:00',
      },
      {
        id: 'SH003',
        recipientName: 'Lê Văn C',
        phone: '0912345678',
        address: '789 Đường DEF, Quận Z, Đà Nẵng',
        status: 'Hủy bỏ',
        lastUpdated: '2024-11-23T09:45:00',
      },
    ];

    await Shipment.insertMany(shipments);
    console.log('Dữ liệu mẫu đã được thêm!');
    process.exit();
  } catch (error) {
    console.error('Lỗi khi nhập dữ liệu:', error);
    process.exit(1);
  }
};

seedData();
