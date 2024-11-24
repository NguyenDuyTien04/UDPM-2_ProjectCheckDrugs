const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  gameShiftNFTId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('NFT', nftSchema);
