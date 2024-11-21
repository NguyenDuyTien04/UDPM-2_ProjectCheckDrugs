const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true // Tên của Collection (bắt buộc)
    },
    description: { 
      type: String // Mô tả về Collection (không bắt buộc)
    },
    image: { 
      type: String, // Đường dẫn ảnh hoặc URL hình ảnh đại diện cho Collection (không bắt buộc)
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v); // Kiểm tra URL hợp lệ
        },
        message: props => `${props.value} không phải là một URL hợp lệ!`
      }
    },
    ownerWallet: { 
      type: String, 
      required: true, // Địa chỉ ví của người tạo Collection (bắt buộc)
      index: true // Tạo chỉ mục để tăng tốc tìm kiếm
    },
    gameShiftCollectionId: { 
      type: String, 
      unique: true, 
      required: true // ID của Collection từ GameShift (bắt buộc và phải duy nhất)
    },
    isActive: { 
      type: Boolean, 
      default: true // Trạng thái hoạt động, mặc định là true
    }
  },
  { 
    timestamps: true // Tự động thêm 2 thuộc tính: createdAt (ngày tạo) và updatedAt (ngày cập nhật)
  }
);

module.exports = mongoose.model("Collection", collectionSchema);
