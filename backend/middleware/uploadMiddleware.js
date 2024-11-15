const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ file và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu vào thư mục 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Tên file độc đáo
    },
});

const upload = multer({ storage });

module.exports = upload;
