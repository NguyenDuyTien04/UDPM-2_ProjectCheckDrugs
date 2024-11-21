const Collection = require("../models/Collection");
const gameShiftService = require("../services/gameShiftService");
const path = require("path");

exports.createCollection = async (req, res) => {
  try {
    let { name, description, image } = req.body; // Lấy dữ liệu từ body

    // Nếu không có image từ body, kiểm tra file upload
    if (!image && req.file) {
      const filePath = path.join("uploads", req.file.filename);
      image = `${req.protocol}://${req.get("host")}/${filePath}`; // URL ảnh từ file upload
    }

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !image) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ name, description, và image (URL hoặc file).",
      });
    }

    // Gọi API GameShift để tạo Collection
    const collectionData = await gameShiftService.createCollection({
      name,
      description,
      image,
    });

    // Kiểm tra nếu collectionId không hợp lệ
    if (!collectionData.collectionId) {
      return res.status(500).json({ message: "Lỗi từ GameShift: collectionId không hợp lệ." });
    }

    // Lưu Collection vào MongoDB
    const newCollection = new Collection({
      name: collectionData.name,
      description: collectionData.description,
      image: collectionData.image,
      ownerWallet: req.user.walletAddress,
      gameShiftCollectionId: collectionData.collectionId,
    });

    await newCollection.save(); // Lưu vào MongoDB

    res.status(201).json({
      message: "Collection được tạo thành công!",
      data: newCollection,
    });
  } catch (error) {
    console.error("Lỗi khi tạo Collection:", error.message);
    res.status(500).json({ message: "Lỗi khi tạo Collection.", error: error.message });
  }
};
