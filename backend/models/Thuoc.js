// models/Thuoc.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thuocSchema = new Schema({
  tenThuoc: { type: String, required: true },
  nhaSanXuatId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  soLo: { type: String, required: true },
  maQR: { type: String, required: true, unique: true },
  ngayHetHan: { type: Date, required: true },
  ngaySanXuat: { type: Date, required: true },
  gia: { type: Number, required: true }, // Giá thuốc (SOL)
  duongDanAnh: { type: String, required: true },
});

module.exports = mongoose.model('Thuoc', thuocSchema);
