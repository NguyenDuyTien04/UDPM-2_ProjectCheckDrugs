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
// Bán NFT
exports.sellNFT = async (req, res) => {
  const { id } = req.params; // Lấy ID NFT từ URL
  const { price } = req.body; // Lấy giá bán từ request body
  const walletAddress = req.user.walletAddress; // Lấy địa chỉ ví của người dùng từ authMiddleware

  try {
    // Kiểm tra nếu thiếu thông tin giá bán
    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Giá bán phải lớn hơn 0.' });
    }

    // Tìm NFT trong MongoDB
    const nft = await NFT.findById(id);

    // Kiểm tra nếu không tìm thấy NFT
    if (!nft) {
      return res.status(404).json({ message: 'NFT không tồn tại.' });
    }

    // Kiểm tra nếu người dùng không phải chủ sở hữu NFT
    if (nft.ownerWallet !== walletAddress) {
      return res.status(403).json({ message: 'Bạn không phải chủ sở hữu của NFT này.' });
    }

    // Gọi API GameShift để rao bán NFT
    const gameShiftResponse = await gameShiftService.sellNFT({
      assetId: nft.gameShiftAssetId, // ID của NFT trên GameShift
      price,
    });

    console.log('Phản hồi từ GameShift khi rao bán NFT:', gameShiftResponse);

    // Cập nhật trạng thái rao bán của NFT trong MongoDB
    nft.isActive = true;
    nft.price = price;
    nft.forSale = true;

    // Lưu NFT vào MongoDB
    await nft.save();

    res.status(200).json({
      message: 'NFT đã được rao bán thành công!',
      data: nft,
    });
  } catch (error) {
    console.error('Lỗi khi rao bán NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi rao bán NFT.', error: error.message });
  }
};