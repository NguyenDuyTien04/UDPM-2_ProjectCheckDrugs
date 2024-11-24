const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Tên Collection là bắt buộc."], // Thông báo lỗi nếu không nhập tên
      trim: true // Tự động loại bỏ khoảng trắng thừa
    },
    description: { 
      type: String, 
      trim: true // Loại bỏ khoảng trắng thừa trong mô tả
    },
    image: { 
      type: String, // Đường dẫn ảnh hoặc URL hình ảnh đại diện cho Collection (không bắt buộc)
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v); // Kiểm tra URL hợp lệ (bắt đầu bằng http hoặc https)
        },
        message: props => `${props.value} không phải là một URL hợp lệ!`
      }
    },
    ownerWallet: { 
      type: String, 
      required: [true, "Địa chỉ ví của người tạo Collection là bắt buộc."], // Bắt buộc nhập địa chỉ ví
      index: true // Tạo chỉ mục để tăng tốc tìm kiếm
    },
    gameShiftCollectionId: { 
      type: String, 
      unique: true, // Đảm bảo giá trị là duy nhất trong hệ thống
      required: [true, "ID từ GameShift là bắt buộc."] // Thông báo lỗi nếu thiếu ID từ GameShift
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
