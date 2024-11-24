const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const collectionController = require('../controllers/collectionController');

/**
 * @route POST /collections/create
 * @desc Tạo Collection mới
 * @access Private
 */
router.post('/create', authMiddleware, collectionController.createCollection);

/**
 * @route GET /collections
 * @desc Lấy danh sách Collection (chỉ trả về ID)
 * @access Private
 */
router.get('/', authMiddleware, collectionController.getCollections);

module.exports = router;
