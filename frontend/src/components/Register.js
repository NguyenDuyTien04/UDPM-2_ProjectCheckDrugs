// Register.js (Registration Form)
import React, { useState } from 'react';
import { registerUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [userData, setUserData] = useState({ tenDangNhap: '', email: '', matKhau: '', vaiTro: 'Người tiêu dùng' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      alert('Đăng kí thành công!');
      navigate('/login');
    } catch (err) {
      alert('Đăng kí thất bại!');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Đăng Kí</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Đăng Nhập</label>
          <input type="text" name="tenDangNhap" className="form-control" value={userData.tenDangNhap} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={userData.email} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Mật Khẩu</label>
          <input type="password" name="matKhau" className="form-control" value={userData.matKhau} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Vai Trò</label>
          <select name="vaiTro" className="form-control" value={userData.vaiTro} onChange={handleChange}>
            <option value="Khách hàng">Người tiêu dùng</option>
            <option value="Nhà sản xuất">Nhà sản xuất</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4">Đăng Kí</button>
      </form>
    </div>
  );
}

export default Register;