const Collection = require("../models/Collection");
const NFT = require("../models/NFT");
const gameShiftService = require("../services/gameShiftService");
// Lấy tất cả
exports.getAllNFTs = async (req, res) => {
  try {
    // Lấy tất cả NFT từ MongoDB
    const nfts = await NFT.find().populate('collectionId'); // Populate để lấy thông tin Collection liên quan

    res.status(200).json({
      message: 'Danh sách tất cả NFT:',
      data: nfts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT.', error: error.message });
  }
};
// TẠO NFT Certificate
exports.createCertificateNFT = async (req, res) => {
  const { name, description, imageUrl, collectionId, price } = req.body;

  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền tạo NFT giấy chứng nhận.' });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !imageUrl || !collectionId || !price) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc. Vui lòng cung cấp đầy đủ thông tin NFT.' });
    }

    // Kiểm tra `collectionId` trong MongoDB
    const collection = await Collection.findOne({ gameShiftCollectionId: collectionId });
    if (!collection) {
      return res.status(404).json({ message: 'Collection không tồn tại.' });
    }

    // Tạo NFT trên GameShift
    const nftData = await gameShiftService.createNFT({
      details: {
        collectionId: collectionId,
        description: description,
        name: name,
        imageUrl: imageUrl,
      },
      destinationUserReferenceId: req.user.walletAddress,
    });

    console.log('Phản hồi đầy đủ từ GameShift API:', nftData);

    // Kiểm tra nếu phản hồi từ GameShift không hợp lệ
    if (!nftData || !nftData.id || !nftData.name || !nftData.description || !nftData.imageUrl) {
      return res.status(500).json({
        message: 'Phản hồi từ GameShift không hợp lệ. Dữ liệu không đầy đủ.',
        data: nftData,
      });
    }

    // Tạo đối tượng NFT mới
    const newNFT = new NFT({
      name: nftData.name,
      description: nftData.description,
      imageUrl: nftData.imageUrl,
      collectionId: collection._id, // ID từ MongoDB
      gameShiftAssetId: nftData.id, // ID từ GameShift
      price,
      ownerWallet: req.user.walletAddress,
      isActive: true,
      forSale: true,
      type: 'certificate', // Loại NFT
    });

    console.log('NFT trước khi lưu vào MongoDB:', newNFT);

    // Lưu NFT vào MongoDB
    await newNFT.save();

    res.status(201).json({
      message: 'NFT giấy chứng nhận được tạo thành công!',
      data: newNFT,
    });
  } catch (error) {
    console.error('Lỗi khi tạo NFT giấy chứng nhận:', error.message);
    res.status(500).json({ message: 'Lỗi khi tạo NFT giấy chứng nhận.', error: error.message });
  }
};


// Tạo NFT MEDICINE
exports.createMedicineNFT = async (req, res) => {
  const { name, description, imageUrl, collectionId, price } = req.body;

  try {
    // Kiểm tra nếu thiếu thông tin bắt buộc
    if (!name || !description || !imageUrl || !collectionId || !price) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc. Vui lòng cung cấp đầy đủ thông tin NFT.',
      });
    }

    // Kiểm tra nếu người dùng đã sở hữu NFT giấy chứng nhận
    const certificateNFT = await NFT.findOne({
      ownerWallet: req.user.walletAddress,
      type: 'certificate',
    });

    if (!certificateNFT) {
      return res.status(403).json({
        message: 'Bạn cần sở hữu NFT giấy chứng nhận để tạo sản phẩm thuốc.',
      });
    }

    // Tiến hành tạo NFT thuốc trên GameShift
    const nftData = await gameShiftService.createNFT({
      details: {
        collectionId: collectionId,
        description: description,
        name: name,
        imageUrl: imageUrl,
      },
      destinationUserReferenceId: req.user.walletAddress,
    });

    console.log('Phản hồi từ GameShift khi tạo NFT thuốc:', nftData);

    // Lưu thông tin NFT thuốc vào MongoDB
    const newNFT = new NFT({
      name: nftData.details.name,
      description: nftData.details.description,
      imageUrl: nftData.details.imageUrl,
      collectionId,
      gameShiftAssetId: nftData.id,
      price,
      ownerWallet: req.user.walletAddress,
      isActive: true,
      forSale: false,
      type: 'medicine', // Loại sản phẩm thuốc
    });

    await newNFT.save();

    res.status(201).json({
      message: 'NFT sản phẩm thuốc được tạo thành công!',
      data: newNFT,
    });
  } catch (error) {
    console.error('Lỗi khi tạo NFT sản phẩm thuốc:', error.message);
    res.status(500).json({ message: 'Lỗi khi tạo NFT sản phẩm thuốc.', error: error.message });
  }
};
// Lấy danh sách tất cả NFT
exports.getAllNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find().populate('collectionId');
    res.status(200).json({
      message: 'Danh sách tất cả NFT:',
      data: nfts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT.', error: error.message });
  }
};

// Lấy danh sách NFT loại Certificate
exports.getCertificateNFTs = async (req, res) => {
  try {
    const certificateNFTs = await NFT.find({ type: 'certificate' }).populate('collectionId');
    res.status(200).json({
      message: 'Danh sách NFT loại Certificate:',
      data: certificateNFTs,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT loại Certificate:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT loại Certificate.', error: error.message });
  }
};

// Lấy danh sách NFT loại Medicine
exports.getMedicineNFTs = async (req, res) => {
  try {
    const medicineNFTs = await NFT.find({ type: 'medicine' }).populate('collectionId');
    res.status(200).json({
      message: 'Danh sách NFT loại Medicine:',
      data: medicineNFTs,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT loại Medicine:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT loại Medicine.', error: error.message });
  }
};

// Lấy thông tin chi tiết một NFT
exports.getNFTById = async (req, res) => {
  try {
    const { id } = req.params;
    const nft = await NFT.findById(id).populate('collectionId');
    if (!nft) {
      return res.status(404).json({ message: 'NFT không tồn tại.' });
    }
    res.status(200).json({
      message: 'Thông tin chi tiết NFT:',
      data: nft,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin NFT.', error: error.message });
  }
};
// API để rao bán NFT
exports.sellNFT = async (req, res) => {
  const { id } = req.params;
  const { price, currency } = req.body; // Lấy giá và loại tiền từ request body
  const walletAddress = req.user.walletAddress;

  try {
    if (!price || price <= 0) {
      return res.status(400).json({ message: "Giá bán phải lớn hơn 0." });
    }
    if (!currency || !["SOL", "USDC"].includes(currency)) {
      return res.status(400).json({ message: "Loại tiền không hợp lệ." });
    }

    const nft = await NFT.findById(id);
    if (!nft) {
      return res.status(404).json({ message: "NFT không tồn tại." });
    }
    if (nft.ownerWallet !== walletAddress) {
      return res.status(403).json({ message: "Bạn không phải chủ sở hữu NFT này." });
    }

    nft.forSale = true;
    nft.price = price;
    nft.currency = currency; // Lưu loại tiền
    await nft.save();

    res.status(200).json({ message: "NFT đã được rao bán thành công!", data: nft });
  } catch (error) {
    console.error("Lỗi khi rao bán NFT:", error.message);
    res.status(500).json({ message: "Lỗi khi rao bán NFT.", error: error.message });
  }
};


// API để lấy NFT trên Market
exports.getMarketNFTs = async (req, res) => {
  try {
    const { type } = req.query; // Lấy loại NFT từ query (certificate hoặc medicine)

    let filter = { forSale: true }; // Lọc các NFT đang được rao bán
    if (type) {
      filter.type = type; // Nếu có loại NFT, thêm vào bộ lọc
    }

    const nfts = await NFT.find(filter); // Tìm NFT theo bộ lọc

    if (!nfts || nfts.length === 0) {
      return res.status(404).json({ message: "Không có NFT nào trên chợ." });
    }

    res.status(200).json({
      message: `Danh sách NFT đang rao bán (${type || "tất cả"}):`,
      data: nfts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy NFT trên chợ:", error.message);
    res.status(500).json({ message: "Lỗi khi lấy NFT trên chợ.", error: error.message });
  }
};
// Lấy NFT trong bộ sưu tập
exports.getNFTsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params; // Lấy collectionId từ URL

    if (!collectionId) {
      return res.status(400).json({ message: "Thiếu ID bộ sưu tập." });
    }

    // Tìm tất cả các NFT thuộc về bộ sưu tập này
    const nfts = await NFT.find({ collectionId });

    if (!nfts || nfts.length === 0) {
      return res.status(404).json({ message: "Không có NFT nào trong bộ sưu tập này." });
    }

    res.status(200).json({
      message: `Danh sách NFT trong bộ sưu tập ${collectionId}:`,
      data: nfts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy NFT từ bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi khi lấy NFT từ bộ sưu tập.", error: error.message });
  }
};
exports.purchaseNFT = async (req, res) => {
  const { nftId } = req.params;
  const { buyerWallet, gameShiftTransactionId } = req.body;

  try {
    // Kiểm tra NFT tồn tại và đang được rao bán
    const nft = await NFT.findById(nftId);
    if (!nft) {
      return res.status(404).json({ message: "NFT không tồn tại." });
    }
    if (!nft.forSale) {
      return res.status(400).json({ message: "NFT này không khả dụng để mua." });
    }

    // Gọi GameShift API để xác minh giao dịch
    const isValidTransaction = await gameShiftService.verifyGameShiftTransaction(
      gameShiftTransactionId,
      nft.gameShiftAssetId,
      nft.price,
      nft.currency,
      buyerWallet
    );

    if (!isValidTransaction) {
      return res.status(400).json({ message: "Giao dịch không hợp lệ từ GameShift." });
    }

    // Cập nhật NFT: chuyển quyền sở hữu
    nft.ownerWallet = buyerWallet;
    nft.forSale = false;
    nft.transactionId = gameShiftTransactionId; // Lưu ID giao dịch từ GameShift
    await nft.save();

    res.status(200).json({ message: "Mua NFT thành công!", data: nft });
  } catch (error) {
    console.error("Lỗi khi xử lý mua NFT:", error.message);
    res.status(500).json({ message: "Lỗi khi xử lý mua NFT.", error: error.message });
  }
};