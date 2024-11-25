const express = require('express');
const router = express.Router();
const { getAllShipments } = require('../controllers/shippingController');

// Route để lấy tất cả thông tin vận chuyển
router.get('/api/shipments', getAllShipments);

module.exports = router;
