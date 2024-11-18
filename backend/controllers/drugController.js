// Đây là drugController
const Thuoc = require('../models/Thuoc'); // Import model Thuoc
const jwt = require('jsonwebtoken');
const gameShiftService = require('../services/gameShiftService');

// Thêm thuốc mới
exports.addDrug = async (req, res) => {
  const { tenThuoc, soLo, maQR, ngaySanXuat, ngayHetHan, duongDanAnh, gia } = req.body;

  // Kiểm tra vai trò của người dùng
  if (req.user.vaiTro !== 'Nhà sản xuất') {
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
      gia, // Thêm thuộc tính giá (tính bằng SOL)
      nhaSanXuatId: req.user.id, // ID của nhà sản xuất lấy từ token
    });

    const savedDrug = await thuoc.save();
    res.status(201).json({ message: 'Thêm thuốc thành công.', data: savedDrug });
  } catch (error) {
    console.error('Lỗi thêm thuốc:', error.message);
    res.status(500).json({ message: 'Lỗi khi thêm thuốc.', error: error.message });
  }
};

// Thanh toán thuốc qua ví Phantom
exports.purchaseDrug = async (req, res) => {
  const { maQR, buyerWalletAddress } = req.body;

  try {
    const drug = await Thuoc.findOne({ maQR });
    if (!drug) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc với mã QR này.' });
    }

    // Thực hiện thanh toán qua GameShift API
    const paymentResult = await gameShiftService.processPayment(
      buyerWalletAddress,
      drug.nhaSanXuatId, // Địa chỉ ví nhà sản xuất
      drug.gia // Giá thuốc (SOL)
    );

    if (!paymentResult.success) {
      return res.status(400).json({ message: 'Thanh toán thất bại.', error: paymentResult.error });
    }

    res.status(200).json({ message: 'Thanh toán thành công!', paymentDetails: paymentResult.details });
  } catch (error) {
    console.error('Lỗi thanh toán:', error.message);
    res.status(500).json({ message: 'Lỗi khi thanh toán thuốc.', error: error.message });
  }
};

// Lấy danh sách thuốc
exports.listDrugs = async (req, res) => {
  try {
    const drugs = await Thuoc.find().populate('nhaSanXuatId', 'tenDangNhap email');
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
