const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  gameShiftCollectionId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Tên bộ sưu tập
  description: { type: String }, // Mô tả bộ sưu tập
  imageUrl: { type: String }, // URL hình ảnh đại diện của bộ sưu tập
});

module.exports = mongoose.model('Collection', collectionSchema);
