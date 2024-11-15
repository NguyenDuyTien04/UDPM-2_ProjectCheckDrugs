// backend/routes/thuoc.js
const express = require('express');
const Thuoc = require('../models/Thuoc');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Import cấu hình upload

// Thêm thuốc mới (chỉ cho phép Nhà sản xuất)
router.post('/add', authMiddleware, upload.single('imageFile'), async (req, res) => {
    const { tenThuoc, soLo, maQR, ngayHetHan, ngaySanXuat, duongDanAnh } = req.body;

    try {
        // Kiểm tra vai trò của người dùng
        if (req.user.vaiTro !== "Nhà sản xuất") {
            return res.status(403).json({ message: "Chỉ nhà sản xuất mới có quyền thêm thuốc." });
        }

        // Kiểm tra nếu thiếu trường
        if (!tenThuoc || !soLo || !maQR || !ngayHetHan || !ngaySanXuat || !duongDanAnh) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
        }

        // Kiểm tra nếu thuốc đã tồn tại
        const thuocTonTai = await Thuoc.findOne({ maQR });
        if (thuocTonTai) {
            return res.status(400).json({ message: "Thuốc đã tồn tại." });
        }


        const duongDanAnhLuu = req.file ? `/uploads/${req.file.filename}` : duongDanAnh;


        // Tạo mới thuốc
        const thuoc = new Thuoc({
            tenThuoc,
            nhaSanXuatId: req.user.id, // Sử dụng ID của người dùng từ token
            soLo,
            maQR,
            ngayHetHan,
            ngaySanXuat,
            duongDanAnh: duongDanAnhLuu,
        });

        const thuocMoi = await thuoc.save();
        res.status(201).json(thuocMoi);
    } catch (err) {
        console.error("Lỗi thêm thuốc:", err); // In lỗi ra console để debug
        res.status(500).json({ message: "Lỗi khi thêm thuốc." });
    }
});

// Lấy danh sách thuốc
router.get('/list', async (req, res) => {
    try {
        const danhSachThuoc = await Thuoc.find().populate('nhaSanXuatId', 'tenDangNhap email');
        res.json(danhSachThuoc);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách thuốc:", err.message);
        res.status(500).json({ message: err.message });
    }
});



// Tra cứu thuốc bằng mã QR hoặc số lô
router.get('/search', async (req, res) => {
    const { maQR, soLo } = req.query;

    try {
        let thuoc;
        if (maQR) {
            thuoc = await Thuoc.findOne({ maQR });
        } else if (soLo) {
            thuoc = await Thuoc.findOne({ soLo });
        }

        if (!thuoc) return res.status(404).json({ message: "Không tìm thấy thuốc." });

        res.json(thuoc);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa thuốc (chỉ cho phép Nhà sản xuất)
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        // Kiểm tra vai trò của người dùng
        if (req.user.vaiTro !== "Nhà sản xuất") {
            return res.status(403).json({ message: "Chỉ nhà sản xuất mới có quyền xóa thuốc." });
        }

        // Tìm thuốc bằng ID
        const thuoc = await Thuoc.findById(req.params.id);
        if (!thuoc) {
            return res.status(404).json({ message: "Không tìm thấy thuốc." });
        }

        // Kiểm tra xem thuốc có thuộc về nhà sản xuất này không
        if (thuoc.nhaSanXuatId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa thuốc này." });
        }

        // Xóa thuốc
        await thuoc.remove();
        res.json({ message: "Thuốc đã được xóa thành công." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Sửa thuốc (chỉ cho phép Nhà sản xuất)
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { tenThuoc, soLo, maQR, ngayHetHan, ngaySanXuat, duongDanAnh } = req.body;

    try {
        // Kiểm tra vai trò của người dùng
        if (req.user.vaiTro !== "Nhà sản xuất") {
            return res.status(403).json({ message: "Chỉ nhà sản xuất mới có quyền sửa thuốc." });
        }

        // Tìm và kiểm tra nếu thuốc tồn tại
        let thuoc = await Thuoc.findById(id);
        if (!thuoc) {
            return res.status(404).json({ message: "Không tìm thấy thuốc." });
        }

        // Kiểm tra xem thuốc có thuộc về nhà sản xuất này không
        if (thuoc.nhaSanXuatId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền sửa thuốc này." });
        }

        // Cập nhật thông tin thuốc
        thuoc.tenThuoc = tenThuoc || thuoc.tenThuoc;
        thuoc.soLo = soLo || thuoc.soLo;
        thuoc.maQR = maQR || thuoc.maQR;
        thuoc.ngayHetHan = ngayHetHan || thuoc.ngayHetHan;
        thuoc.ngaySanXuat = ngaySanXuat || thuoc.ngaySanXuat;
        thuoc.duongDanAnh = duongDanAnh || thuoc.duongDanAnh;

        const thuocCapNhat = await thuoc.save();
        res.status(200).json(thuocCapNhat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
