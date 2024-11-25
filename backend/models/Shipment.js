const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Đang vận chuyển', 'Đã giao hàng', 'Hủy bỏ'], required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shipment', shipmentSchema);
