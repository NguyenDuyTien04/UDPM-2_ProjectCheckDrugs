const Collection = require("../models/Collection");
const gameShiftService = require("../services/gameShiftService");
const path = require("path");

exports.createCollection = async (req, res) => {
  const { name, description, image } = req.body;

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !image) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc. Vui lòng cung cấp tên, mô tả và hình ảnh của Collection.",
      });
    }

    // Gọi GameShift API để tạo Collection
    const collectionData = await gameShiftService.createCollection({
      name,
      description,
      imageUrl: image, // Truyền trường imageUrl thay vì image
    });

    console.log("Phản hồi từ GameShift API:", collectionData);

    // Kiểm tra nếu `id` không tồn tại trong phản hồi
    if (!collectionData.id) {
      return res.status(500).json({
        message: "Lỗi từ GameShift: Không nhận được id hợp lệ từ API.",
      });
    }

    // Lưu Collection vào MongoDB
    const newCollection = new Collection({
      name: collectionData.name,
      description: collectionData.description,
      image: collectionData.imageUrl,
      ownerWallet: req.user.walletAddress,
      gameShiftCollectionId: collectionData.id, // Lưu id thay vì collectionId
    });

    await newCollection.save();

    res.status(201).json({
      message: "Collection được tạo và lưu thành công!",
      data: newCollection,
    });
  } catch (error) {
    console.error("Lỗi khi tạo Collection:", error.message);
    res.status(500).json({ message: "Lỗi khi tạo Collection.", error: error.message });
  }
};

