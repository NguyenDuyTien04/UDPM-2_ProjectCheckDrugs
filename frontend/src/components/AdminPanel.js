import React from 'react';
import './css/AdminPanel.css';

function AdminPanel() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quản Trị Hệ Thống</h2>
      <div className="admin-options">
        <button className="btn btn-info">Duyệt Thuốc</button>
        <button className="btn btn-warning">Cấp NFT Cho Nhà Sản Xuất</button>
      </div>
    </div>
  );
}

export default AdminPanel;
