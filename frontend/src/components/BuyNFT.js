// BuyNFT.js
import React from 'react';

function BuyNFT() {
  const handleBuyNFT = async (nftType) => {
    // Gọi tới ví Phantom để thanh toán NFT
    try {
      // Tích hợp với ví Phantom để thanh toán
      if (window.solana && window.solana.isConnected) {
        alert(`Mua NFT ${nftType} thành công và chứng nhận đã được cấp.`);
      } else {
        alert('Bạn cần kết nối ví Phantom trước khi mua NFT.');
      }
    } catch (error) {
      console.error('Mua NFT thất bại:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mua NFT Chứng Nhận</h2>
      <div className="text-center">
        <button className="btn btn-primary" onClick={() => handleBuyNFT('Nhà Sản Xuất')}>
          Mua NFT Nhà Sản Xuất
        </button>
        <button className="btn btn-secondary ms-3" onClick={() => handleBuyNFT('Người Mua')}>
          Mua NFT Người Mua
        </button>
      </div>
    </div>
  );
}

export default BuyNFT;
