const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true // Tên NFT (bắt buộc)
    },
    description: { 
      type: String // Mô tả về NFT
    },
    image: { 
      type: String, 
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v); // Kiểm tra URL hợp lệ
        },
        message: (props) => `${props.value} không phải là một URL hợp lệ!`,
      },
    },
    ownerWallet: { 
      type: String, 
      required: true, // Ví của người sở hữu NFT
      index: true 
    },
    collectionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Collection", // Tham chiếu tới Collection
      required: true 
    },
    gameShiftAssetId: { 
      type: String, 
      unique: true, 
      required: true // ID NFT từ GameShift
    },
    isActive: { 
      type: Boolean, 
      default: true // Trạng thái hoạt động
    }
  },
  { 
    timestamps: true // Tự động thêm ngày tạo và cập nhật
  }
);

module.exports = mongoose.model("NFT", nftSchema);
