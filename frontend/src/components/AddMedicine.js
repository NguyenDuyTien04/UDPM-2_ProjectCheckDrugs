import React, { useState } from 'react';
import { addMedicine } from '../utils/api';
import './css/AddMedicine.css';

function AddMedicine() {
  const [formData, setFormData] = useState({
    tenThuoc: '',
    soLo: '',
    maQR: '',
    ngayHetHan: '',
    ngaySanXuat: '',
    duongDanAnh: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setFormData({ ...formData, duongDanAnh: '' }); // Xóa URL khi chọn file
  };

  const handleUrlChange = (e) => {
    setFormData({ ...formData, duongDanAnh: e.target.value });
    setImageFile(null); // Xóa file khi nhập URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (imageFile) {
      data.append('imageFile', imageFile); // Thêm file ảnh nếu có
    }

    try {
      const token = localStorage.getItem('token');
      await addMedicine(data, token);
      alert('Thêm thuốc thành công');
    } catch (error) {
      console.error('Lỗi thêm thuốc:', error.message);
      alert('Thêm thuốc thất bại');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Thêm Thuốc</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Thuốc:</label>
          <input
            type="text"
            className="form-control"
            name="tenThuoc"
            value={formData.tenThuoc}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số Lô:</label>
          <input
            type="text"
            className="form-control"
            name="soLo"
            value={formData.soLo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mã QR:</label>
          <input
            type="text"
            className="form-control"
            name="maQR"
            value={formData.maQR}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày Hết Hạn:</label>
          <input
            type="date"
            className="form-control"
            name="ngayHetHan"
            value={formData.ngayHetHan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày Sản Xuất:</label>
          <input
            type="date"
            className="form-control"
            name="ngaySanXuat"
            value={formData.ngaySanXuat}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ảnh từ file máy tính:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Hoặc URL ảnh:</label>
          <input
            type="text"
            className="form-control"
            name="duongDanAnh"
            value={formData.duongDanAnh}
            onChange={handleUrlChange}
            placeholder="Nhập URL ảnh"
          />
        </div>
        <button type="submit" className="btn btn-primary">Thêm Thuốc</button>
      </form>
    </div>
  );
}

export default AddMedicine;
