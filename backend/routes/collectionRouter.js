// routes/collectionRouter.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware xác thực
const upload = require("../middleware/uploadMiddleware"); // Middleware upload file
const collectionController = require("../controllers/collectionController");

const router = express.Router();

// Route tạo Collection (hỗ trợ cả URL ảnh và file upload)
router.post(
  "/create",
  authMiddleware, // Middleware xác thực người dùng
  collectionController.createCollection // Xử lý logic trong controller
);

// Route: Lấy danh sách bộ sưu tập của user
router.get('/list', authMiddleware, collectionController.getCollections);

module.exports = router;
