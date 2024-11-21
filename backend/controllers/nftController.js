const NFT = require("../models/NFT");
const gameShiftService = require("../services/gameShiftService");

exports.createNFT = async (req, res) => {
  const { name, description, image, collectionId } = req.body;

  try {
    // Kiểm tra đầu vào
    if (!name || !description || !image || !collectionId) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc. Vui lòng cung cấp name, description, image và collectionId.",
      });
    }

    // Gọi API GameShift để tạo NFT
    const nftData = await gameShiftService.createNFT({
      name,
      description,
      imageUrl: image, // Truyền hình ảnh cho GameShift
      collectionId: collectionId, // ID Collection trên GameShift
    });

    console.log("Phản hồi từ GameShift API:", nftData);

    // Kiểm tra nếu API không trả về assetId
    if (!nftData.id) {
      return res.status(500).json({ message: "Lỗi từ GameShift: Không nhận được assetId hợp lệ." });
    }

    // Lưu NFT vào MongoDB
    const newNFT = new NFT({
      name,
      description,
      image,
      ownerWallet: req.user.walletAddress, // Ví của người sở hữu
      collectionId,
      gameShiftAssetId: nftData.id, // ID từ GameShift
    });

    await newNFT.save();

    res.status(201).json({
      message: "NFT được tạo và lưu thành công!",
      data: newNFT,
    });
  } catch (error) {
    console.error("Lỗi khi tạo NFT:", error.message);
    res.status(500).json({ message: "Lỗi khi tạo NFT.", error: error.message });
  }
};
