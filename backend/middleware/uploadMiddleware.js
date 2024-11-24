// middleware/uploadMiddleware.js
const multer = require("multer");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Lưu file vào thư mục uploads/
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Tên file độc đáo
  },
});

// Tạo middleware upload
const upload = multer({ storage });

module.exports = upload;
