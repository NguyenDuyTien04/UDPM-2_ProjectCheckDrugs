const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  gameShiftCollectionId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Collection', collectionSchema);
