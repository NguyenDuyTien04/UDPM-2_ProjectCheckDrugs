const NFT = require('../models/NFT');
const Transaction = require('../models/Transaction');
const gameShiftService = require('../services/gameshiftService');

exports.createNFT = async (req, res) => {
  const { collectionId, description, name, imageUrl, type } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!collectionId || !description || !name || !imageUrl || !type) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo NFT.' });
  }

  try {
    // Kiểm tra nếu `req.user.walletAddress` tồn tại
    if (!req.user || !req.user.walletAddress) {
      return res.status(400).json({
        message: 'Không tìm thấy địa chỉ ví người dùng (destinationUserReferenceId).',
      });
    }

    // Chuẩn bị payload gửi lên GameShift API
    const nftData = {
      details: {
        attributes: [
          {
            traitType: 'type',
            value: type, // Thêm type vào NFT
          },
        ],
        collectionId,
        description,
        name,
        imageUrl,
      },
      destinationUserReferenceId: req.user.walletAddress, // Địa chỉ ví của người dùng
    };

    console.log('--- Payload gửi lên GameShift ---');
    console.log(JSON.stringify(nftData, null, 2));

    // Gọi GameShift API để tạo NFT
    const gameShiftResponse = await gameShiftService.createNFT(nftData);

    if (!gameShiftResponse || !gameShiftResponse.id) {
      return res.status(500).json({ message: 'Không nhận được ID hợp lệ từ GameShift.' });
    }

    // Lưu ID NFT vào MongoDB
    const newNFT = new NFT({
      gameShiftNFTId: gameShiftResponse.id,
    });
    await newNFT.save();

    res.status(201).json({
      message: 'NFT được tạo thành công!',
      nftId: newNFT.gameShiftNFTId,
    });
  } catch (error) {
    console.error('--- Lỗi khi tạo NFT ---', error.message);
    res.status(500).json({ message: 'Lỗi khi tạo NFT.', error: error.message });
  }
};

exports.getAllNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find(); // Chỉ trả về danh sách ID
    res.status(200).json({ message: 'Danh sách NFT:', data: nfts });
  } catch (error) {
    console.error('Lỗi khi lấy NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy NFT.', error: error.message });
  }
};

// Hủy NFT
exports.cancelNFT = async (req, res) => {
  const { nftId } = req.params;

  try {
    // Gọi GameShift API để hủy NFT
    const cancelResponse = await gameShiftService.cancelNFT(nftId);

    // Xóa NFT khỏi MongoDB
    await NFT.deleteOne({ gameShiftNFTId: nftId });

    res.status(200).json({
      message: 'NFT đã được hủy thành công!',
      data: cancelResponse,
    });
  } catch (error) {
    console.error('Lỗi khi hủy NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi hủy NFT.', error: error.message });
  }
};

// Lấy tất cả NFT từ GameShift và lưu ID vào MongoDB nếu chưa tồn tại
exports.getAllNFTsFromGameShift = async (req, res) => {
  try {
    const nfts = await gameShiftService.fetchAllNFTs();

    // Lưu các NFT mới vào MongoDB (chỉ lưu ID)
    for (const nft of nfts) {
      const existingNFT = await NFT.findOne({ gameShiftNFTId: nft.id });
      if (!existingNFT) {
        const newNFT = new NFT({
          gameShiftNFTId: nft.id,
        });
        await newNFT.save();
      }
    }

    res.status(200).json({
      message: 'Danh sách tất cả NFT từ GameShift:',
      data: nfts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT từ GameShift:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT.', error: error.message });
  }
};

// Lấy danh sách NFT đang được rao bán
exports.getNFTsForSale = async (req, res) => {
  const { page = 1, perPage = 50 } = req.query; // Lấy thông tin phân trang từ query parameters

  try {
    const nftsForSale = await gameShiftService.fetchNFTsForSale(page, perPage);

    res.status(200).json({
      message: 'Danh sách NFT đang được rao bán:',
      data: nftsForSale,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT đang được rao bán:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT đang được rao bán.', error: error.message });
  }
};
// Controller để thu hồi NFT
exports.cancelNFTListing = async (req, res) => {
  const { id } = req.params; // NFT ID từ URL

  try {
    console.log("NFT ID nhận được:", id);

    // Kiểm tra NFT trong cơ sở dữ liệu (chỉ kiểm tra sự tồn tại của ID)
    const nft = await NFT.findOne({ gameShiftNFTId: id });

    if (!nft) {
      return res.status(404).json({ message: "NFT không tồn tại trong hệ thống." });
    }

    // Gọi API GameShift để thu hồi NFT
    const cancelResponse = await gameShiftService.cancelNFTListing(id);
    console.log("Phản hồi từ GameShift khi thu hồi:", cancelResponse);

    res.status(200).json({
      message: "NFT đã được thu hồi khỏi chợ thành công!",
      nft: { gameShiftNFTId: id },
      cancelResponse,
    });
  } catch (error) {
    console.error("Lỗi khi thu hồi NFT:", error.message);
    res.status(500).json({ message: "Lỗi khi thu hồi NFT.", error: error.message });
  }
};

// Controller để lấy thông tin chi tiết của NFT
exports.getNFTDetails = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: 'NFT ID không được cung cấp.' });
    }

    // Gọi hàm từ service để lấy chi tiết NFT
    const nftDetails = await gameShiftService.getNFTDetails(id);

    // Phản hồi kết quả
    return res.status(200).json({
      message: 'Lấy thông tin chi tiết NFT thành công!',
      data: nftDetails,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin chi tiết NFT:', error.message);
    return res.status(500).json({ message: 'Không thể lấy thông tin chi tiết NFT.', error: error.message });
  }
};

// Mua NFT
exports.buyNFT = async (req, res) => {
  const { id } = req.params; // ID của NFT từ URL
  const { walletAddress } = req.user; // Lấy địa chỉ ví của người mua từ token

  try {
      // Gọi service để thực hiện giao dịch mua NFT
      const purchaseResponse = await gameShiftService.buyNFT({
          assetId: id,
          buyerId: walletAddress,
      });

      // Lưu thông tin giao dịch vào MongoDB
      const newTransaction = new Transaction({
          gameShiftTransactionId: purchaseResponse.transactionId, // ID giao dịch từ GameShift
          nftId: id, // ID của NFT
          userId: walletAddress, // Người mua
          action: 'buy', // Loại giao dịch
          price: purchaseResponse.price?.naturalAmount || null, // Giá giao dịch
          currency: purchaseResponse.price?.currencyId || null, // Loại tiền
          status: 'Pending', // Trạng thái giao dịch ban đầu
          consentUrl: purchaseResponse.consentUrl, // URL để người dùng ký giao dịch
      });

      await newTransaction.save(); // Lưu giao dịch vào MongoDB

      // Cập nhật trạng thái của NFT trong MongoDB (nếu cần)
      const updatedNFT = await NFT.findOneAndUpdate(
          { gameShiftNFTId: id },
          { new: true } // Trả về tài liệu đã cập nhật
      );

      res.status(200).json({
          message: 'NFT đã được mua thành công!',
          nft: updatedNFT,
          transaction: newTransaction, // Trả về thông tin giao dịch
          purchaseResponse, // Phản hồi từ GameShift API
      });
  } catch (error) {
      console.error('Lỗi khi mua NFT:', error.message);
      res.status(500).json({ message: 'Lỗi khi mua NFT.', error: error.message });
  }
};
// Rao bán NFT
exports.sellNFT = async (req, res) => {
  const { id } = req.params; // NFT ID từ URL
  const { naturalAmount, currencyId } = req.body; // Dữ liệu từ body
  const { walletAddress } = req.user; // Địa chỉ ví của người dùng từ token

  try {
      // Chuyển đổi naturalAmount thành chuỗi (nếu cần)
      const price = {
          naturalAmount: String(naturalAmount).trim(), // Chuyển đổi thành chuỗi
          currencyId: currencyId,
      };

      // Kiểm tra dữ liệu đầu vào
      if (!price.naturalAmount || isNaN(Number(price.naturalAmount)) || Number(price.naturalAmount) <= 0) {
          return res.status(400).json({ message: 'Giá bán (naturalAmount) phải là chuỗi ký tự hợp lệ.' });
      }
      if (!price.currencyId || !["SOL", "USDC"].includes(price.currencyId)) {
          return res.status(400).json({ message: 'Loại tiền không hợp lệ.' });
      }

      // Gọi GameShift API để rao bán NFT
      const sellResponse = await gameShiftService.sellNFT({
          assetId: id,
          price: price,
      });

      // Lưu thông tin giao dịch vào MongoDB
      const newTransaction = new Transaction({
          gameShiftTransactionId: sellResponse.transactionId, // Lấy transactionId từ API trả về
          nftId: id, // NFT ID liên quan
          userId: walletAddress, // Người thực hiện giao dịch
          action: 'sell', // Loại hành động là "rao bán"
          price: price.naturalAmount, // Giá bán
          currency: price.currencyId, // Loại tiền
          status: 'Pending', // Trạng thái giao dịch ban đầu là "Pending"
          consentUrl: sellResponse.consentUrl, // URL xác nhận giao dịch
      });

      await newTransaction.save();

      // Cập nhật MongoDB nếu thành công
      const updatedNFT = await NFT.findOneAndUpdate(
          { gameShiftNFTId: id },
          { new: true } // Trả về tài liệu đã cập nhật
      );

      res.status(200).json({
          message: 'NFT đã được rao bán thành công!',
          nft: updatedNFT,
          transaction: newTransaction, // Trả về thông tin giao dịch đã lưu
          sellResponse, // Phản hồi từ GameShift
      });
  } catch (error) {
      console.error('Lỗi khi rao bán NFT:', error.message);
      res.status(500).json({ message: 'Lỗi khi rao bán NFT.', error: error.message });
  }
};

// Lấy danh sách NFT trong một bộ sưu tập
exports.getNFTsByCollection = async (req, res) => {
  const { collectionId } = req.query; // Lấy collectionId từ query parameters

  if (!collectionId) {
    return res.status(400).json({ message: 'Thiếu collectionId trong yêu cầu.' });
  }

  try {
    // Gọi service để lấy danh sách NFT từ GameShift
    const nfts = await gameShiftService.getNFTsByCollection(collectionId);

    res.status(200).json({
      message: `Danh sách NFT trong bộ sưu tập ${collectionId} đã được lấy thành công.`,
      data: nfts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách NFT:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách NFT.', error: error.message });
  }
};
// Lấy danh sách NFT của người dùng
exports.getUserNFTs = async (req, res) => {
  const { walletAddress } = req.user; // Lấy walletAddress từ token đã giải mã bởi authMiddleware

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address không hợp lệ." });
  }

  try {
    const nfts = await gameShiftService.fetchUserNFTs(walletAddress); // Gọi GameShift API
    res.status(200).json({
      message: "Danh sách NFT của người dùng:",
      data: nfts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách NFT của người dùng:", error.message);
    res.status(500).json({
      message: "Không thể lấy danh sách NFT của người dùng.",
      error: error.message,
    });
  }
};
// Lấy nft trong bộ sưu tập
exports.getNFTsByCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    if (!collectionId) {
      return res.status(400).json({ message: "Thiếu collectionId" });
    }

    const nfts = await gameShiftService.getNFTsByCollection(collectionId);

    res.status(200).json({
      message: "Danh sách NFT trong bộ sưu tập",
      data: nfts,
    });
  } catch (error) {
    console.error("Lỗi trong NFT Controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
// Controller để lấy danh sách NFT của người dùng
const getUserNFTs = async (req, res) => {
  try {
    // Lấy `walletAddress` từ token (authMiddleware gán vào req.user)
    const walletAddress = req.user.walletAddress;
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address không tồn tại." });
    }

    // Gọi service để lấy danh sách NFT
    const items = await gameShiftService.getUserItems(walletAddress);

    return res.status(200).json({
      message: "Lấy danh sách NFT thành công!",
      data: items,
    });
  } catch (error) {
    console.error("Lỗi trong getUserNFTs:", error.message);
    return res.status(500).json({ message: error.message });
  }
};