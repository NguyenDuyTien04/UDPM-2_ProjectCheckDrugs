// routes/authRouter.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: Đăng ký
router.post('/register', authController.register);

// Route: Đăng nhập
router.post('/login', authController.login);

module.exports = router;