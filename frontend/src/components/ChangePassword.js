import React, { useState } from 'react';
import { changePassword } from '../utils/api';
import './css/ChangePassword.css'; // Link đến file CSS

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => setNewPassword(e.target.value);
  const handleConfirmChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu không khớp. Vui lòng thử lại.');
      return;
    }
    try {
      await changePassword(newPassword); // Gọi API thay đổi mật khẩu
      setMessage('Mật khẩu đã được thay đổi thành công!');
    } catch (err) {
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-success">Thay Đổi Mật Khẩu</h2>
      <div className="card shadow-lg p-4 rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="form-group mt-3">
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={handleConfirmChange}
              required
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Thay Đổi Mật Khẩu
          </button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
}

export default ChangePassword;
