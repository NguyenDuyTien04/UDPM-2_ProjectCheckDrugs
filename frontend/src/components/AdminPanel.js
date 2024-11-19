import React, { useState } from 'react';
import axios from 'axios';
import './css/AdminPanel.css';

function AdminPanel() {
  const [loading, setLoading] = useState(false);

  const handleApproveMedicine = async () => {
    // Logic duyệt thuốc - Kết nối với API duyệt thuốc của bạn.
    try {
      setLoading(true);
      // Gọi API duyệt thuốc ở backend
      const response = await axios.put('http://localhost:5000/api/thuoc/approve-all', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLoading(false);
      alert('Duyệt tất cả các thuốc thành công!');
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Lỗi khi duyệt thuốc:', error);
      alert('Lỗi khi duyệt thuốc.');
    }
  };

  const handleMintNFT = async () => {
    // Logic cấp NFT cho nhà sản xuất - Kết nối với API của bạn để tạo NFT.
    try {
      setLoading(true);
      // Gọi API cấp NFT cho nhà sản xuất
      const response = await axios.post('http://localhost:5000/api/nft/create', {
        tokenName: 'Chứng nhận Nhà Sản Xuất',
        description: 'NFT chứng nhận cho nhà sản xuất để đăng bán thuốc.',
        recipientAddress: 'Ví_Address_Nhà_Sản_Xuất' // Địa chỉ ví sẽ phải lấy từ database
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLoading(false);
      alert('Cấp NFT cho nhà sản xuất thành công!');
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Lỗi khi cấp NFT:', error);
      alert('Lỗi khi cấp NFT cho nhà sản xuất.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quản Trị Hệ Thống</h2>
      <div className="admin-options text-center">
        <button 
          className="btn btn-info me-3" 
          onClick={handleApproveMedicine} 
          disabled={loading}
        >
          {loading ? 'Đang duyệt thuốc...' : 'Duyệt Thuốc'}
        </button>
        <button 
          className="btn btn-warning" 
          onClick={handleMintNFT} 
          disabled={loading}
        >
          {loading ? 'Đang cấp NFT...' : 'Cấp NFT Cho Nhà Sản Xuất'}
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
