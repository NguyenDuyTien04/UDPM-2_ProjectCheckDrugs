const Collection = require('../models/Collection');
const gameShiftService = require('../services/gameshiftService');

const retryRequest = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Tạo Collection
exports.createCollection = async (req, res) => {
  const { name, description, image } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !description || !image) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết (name, description, image).' });
  }

  try {
    // Đảm bảo URL là HTTPS
    const secureImageUrl = image.startsWith('http://') ? image.replace('http://', 'https://') : image;

    console.log("Payload gửi lên GameShift:", {
      name,
      description,
      imageUrl: secureImageUrl,
    });

    const collectionData = await gameShiftService.createCollection({
      name,
      description,
      imageUrl: secureImageUrl,
    });

    if (!collectionData.id) {
      throw new Error('Không nhận được ID từ GameShift API.');
    }

    // Lưu Collection vào MongoDB
    const newCollection = new Collection({
      gameShiftCollectionId: collectionData.id,
    });

    await newCollection.save();

    res.status(201).json({
      message: 'Collection được tạo thành công!',
      collectionId: newCollection.gameShiftCollectionId,
    });
  } catch (error) {
    console.error('Lỗi khi tạo Collection:', error.message);
    res.status(500).json({ message: 'Lỗi khi tạo Collection.', error: error.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find(); // Chỉ trả về danh sách ID
    res.status(200).json({ message: 'Danh sách bộ sưu tập:', data: collections });
  } catch (error) {
    console.error('Lỗi khi lấy bộ sưu tập:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy bộ sưu tập.', error: error.message });
  }
};
