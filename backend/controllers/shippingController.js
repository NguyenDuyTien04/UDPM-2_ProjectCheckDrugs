const Shipment = require('../models/Shipment');

// Controller để lấy danh sách vận chuyển
const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json({ success: true, data: shipments });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu vận chuyển:', error);
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu vận chuyển.' });
  }
};

module.exports = { getAllShipments };
