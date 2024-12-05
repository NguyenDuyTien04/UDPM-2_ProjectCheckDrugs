// routes/paymentsRoutes.js
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Route để lấy danh sách thanh toán
router.get('/', paymentsController.getPayments);

module.exports = router;
