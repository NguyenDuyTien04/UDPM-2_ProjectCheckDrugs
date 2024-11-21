// routes/drugRouter.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const drugController = require('../controllers/drugController');

const router = express.Router();

// Route thêm thuốc
router.post('/add', authMiddleware, drugController.addDrug);

// Route thanh toán thuốc
router.post('/purchase', authMiddleware, drugController.purchaseDrug);

// Route lấy danh sách thuốc
router.get('/list', drugController.listDrugs);

// Route tìm kiếm thuốc
router.get('/search', drugController.searchDrug);

module.exports = router;
