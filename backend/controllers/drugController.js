// controllers/drugController.js

const Thuoc = require('../models/Thuoc');
const gameShiftService = require('../services/gameshiftService');

// Thêm thuốc mới
exports.addDrug = async (req, res) => {
  const { tenThuoc, soLo, maQR, ngaySanXuat, ngayHetHan, duongDanAnh, gia } = req.body;

  // Kiểm tra vai trò của người dùng
  if (req.user.role !== 'manufacturer') {
    return res.status(403).json({ message: 'Bạn không có quyền thêm thuốc.' });
  }

  try {
    // Kiểm tra nếu thiếu trường
    if (!tenThuoc || !soLo || !maQR || !ngaySanXuat || !ngayHetHan || !gia) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Kiểm tra nếu thuốc đã tồn tại
    const drugExists = await Thuoc.findOne({ maQR });
    if (drugExists) {
      return res.status(400).json({ message: 'Thuốc với mã QR này đã tồn tại.' });
    }

    // Thêm thuốc mới
    const thuoc = new Thuoc({
      tenThuoc,
      soLo,
      maQR,
      ngaySanXuat,
      ngayHetHan,
      duongDanAnh,
      gia,
      nhaSanXuatId: req.user.id, // Đảm bảo rằng 'req.user.id' là ObjectId của User
    });

    const savedDrug = await thuoc.save();
    console.log('Thuốc đã được lưu vào MongoDB:', savedDrug);
    res.status(201).json({ message: 'Thêm thuốc thành công.', data: savedDrug });
  } catch (error) {
    console.error('Lỗi thêm thuốc:', error.message);
    res.status(500).json({ message: 'Lỗi khi thêm thuốc.', error: error.message });
  }
};

// Thanh toán thuốc qua ví Phantom
exports.purchaseDrug = async (req, res) => {
  const { maQR } = req.body;
  const buyerWalletAddress = req.user.walletAddress;

  try {
    const drug = await Thuoc.findOne({ maQR }).populate('nhaSanXuatId');
    if (!drug) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc với mã QR này.' });
    }

    // Kiểm tra quyền sở hữu NFT
    const nftId = 'NFT_CERTIFICATE_ID'; // Thay 'NFT_CERTIFICATE_ID' bằng ID thực tế của NFT
    const nftOwnership = await gameShiftService.checkNFTOwnership(buyerWalletAddress, nftId);
    if (!nftOwnership) {
      return res.status(403).json({ message: 'Bạn cần sở hữu NFT để mua thuốc.' });
    }

    // Thực hiện thanh toán qua GameShift API
    const paymentResult = await gameShiftService.processPayment(
      buyerWalletAddress,
      drug.nhaSanXuatId.walletAddress, // Địa chỉ ví nhà sản xuất
      drug.gia // Giá thuốc (SOL)
    );

    console.log('Thanh toán thành công:', paymentResult);
    res.status(200).json({ message: 'Thanh toán thành công!', paymentDetails: paymentResult });
  } catch (error) {
    console.error('Lỗi thanh toán:', error.message);
    res.status(500).json({ message: 'Lỗi khi thanh toán thuốc.', error: error.message });
  }
};

// Lấy danh sách thuốc
exports.listDrugs = async (req, res) => {
  try {
    const drugs = await Thuoc.find().populate('nhaSanXuatId', 'email walletAddress');
    res.status(200).json(drugs);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thuốc:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thuốc.', error: error.message });
  }
};

// Tra cứu thuốc bằng mã QR hoặc số lô
exports.searchDrug = async (req, res) => {
  const { maQR, soLo } = req.query;

  try {
    let drug;
    if (maQR) {
      drug = await Thuoc.findOne({ maQR });
    } else if (soLo) {
      drug = await Thuoc.findOne({ soLo });
    }

    if (!drug) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc.' });
    }

    res.json(drug);
  } catch (error) {
    console.error('Lỗi khi tra cứu thuốc:', error.message);
    res.status(500).json({ message: 'Lỗi khi tra cứu thuốc.', error: error.message });
  }
};
