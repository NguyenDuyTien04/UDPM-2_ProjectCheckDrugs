import React, { useEffect, useState } from "react";
import { fetchNFTs } from "../services/api"; // API để lấy danh sách NFT
import "./styles/MarketNFT.css";

const MarketNFT = () => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNFTs = async () => {
      try {
        const response = await fetchNFTs(); // Lấy dữ liệu NFT từ API
        setNFTs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi!");
        setLoading(false);
      }
    };

    getNFTs();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải danh sách NFT...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="market-nft">
      <h1>Market NFT</h1>
      <div className="nft-list">
        {nfts.map((nft) => (
          <div key={nft._id} className="nft-card">
            <div className="discount-badge">Giảm giá 20%</div>
            <img src={nft.imageUrl} alt={nft.name} className="nft-image" />
            <div className="nft-info">
              <h3 className="nft-name">{nft.name}</h3>
              <p className="nft-description">{nft.description}</p>
              <div className="nft-price">
                <span className="old-price">525.000 đ</span>
                <span className="current-price">{nft.price} SOL</span>
              </div>
              <button className="select-button">Chọn sản phẩm</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketNFT;
