// controllers/nftController.js

const gameShiftService = require('../services/gameShiftService');

// Mua NFT
exports.purchaseNFT = async (req, res) => {
  const { nftId } = req.body;
  const buyerWallet = req.user.walletAddress;

  try {
    // Gọi hàm mua NFT từ GameShift Service
    const purchaseResult = await gameShiftService.purchaseNFT(buyerWallet, nftId);

    console.log('Kết quả mua NFT:', purchaseResult);
    res.status(200).json({ message: 'Mua NFT thành công!', data: purchaseResult });
  } catch (err) {
    console.error('Lỗi khi mua NFT:', err.message);
    res.status(500).json({ message: 'Lỗi khi mua NFT.', error: err.message });
  }
};

// Tạo NFT (Chỉ dành cho admin)
exports.createNFT = async (req, res) => {
  const { tokenName, description, recipientAddress } = req.body;

  // Kiểm tra vai trò của người dùng
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền tạo NFT.' });
  }

  try {
    const nftData = await gameShiftService.createNFT({
      tokenName,
      description,
      recipientAddress,
    });

    console.log('NFT được tạo thành công:', nftData);
    res.status(201).json({ message: 'NFT được tạo thành công!', data: nftData });
  } catch (error) {
    console.error('Lỗi tạo NFT:', error.message);
    res.status(500).json({ message: 'Lỗi tạo NFT.', error: error.message });
  }
};
