const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const drugController = require("../controllers/drugController");
const authController = require("../controllers/authController");

// Route: Lấy thông tin từ GameShift nếu không tồn tại trong MongoDB
router.get("/gameshift-user/:referenceId", async (req, res) => {
  try {
    const { referenceId } = req.params;

    const user = await User.findOne({ referenceId });
    if (!user) {
      const response = await axios.get(
        `https://api.gameshift.dev/nx/users/${referenceId}`,
        {
          headers: { "x-api-key": process.env.GAMESHIFT_API_KEY },
        }
      );

      const data = response.data;
      const newUser = new User({
        email: data.email,
        referenceId,
        walletAddress: referenceId,
        gameShiftUserId: data.id || "unknown",
      });
      await newUser.save();

      console.log("Người dùng mới được thêm từ GameShift:", newUser);
      return res.status(200).json(newUser);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user from GameShift:", err.message);
    if (err.response) {
      return res
        .status(err.response.status)
        .json({ message: err.response.data.message || "Lỗi từ GameShift API." });
    }

    res.status(500).json({ message: "Có lỗi xảy ra khi xử lý yêu cầu." });
  }
});

// Route: Đăng nhập
router.post("/login", (req, res, next) => {
  console.log("Đã nhận được yêu cầu POST /api/auth/login");
  next();
}, authController.login);

// Route: Đăng ký
router.post("/register", (req, res, next) => {
  console.log("Đã nhận được yêu cầu POST /api/auth/register");
  next();
}, authController.register);

// Route thêm thuốc
router.post("/drugs/add", authMiddleware, drugController.addDrug);

// Route thanh toán thuốc
router.post("/drugs/purchase", authMiddleware, drugController.purchaseDrug);

// Route lấy danh sách thuốc
router.get("/drugs/list", drugController.listDrugs);

// Route tìm kiếm thuốc
router.get("/drugs/search", drugController.searchDrug);

module.exports = router;
