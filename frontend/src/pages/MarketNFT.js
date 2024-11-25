import React, { useState, useEffect } from "react";
import { fetchMarketNFTs } from "../services/api"; // API lấy danh sách NFT trên Market
import "./styles/MarketNFT.css";

const MarketNFT = () => {
  const [certificates, setCertificates] = useState([]); // NFT loại Giấy chứng nhận
  const [medicines, setMedicines] = useState([]); // NFT loại Thuốc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketNFTs = async () => {
      try {
        const data = await fetchMarketNFTs(); // Lấy danh sách NFT từ API
        
        // Kiểm tra nếu `data` không phải là mảng
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu từ API không hợp lệ.");
        }

        // Phân loại NFT theo `type`
        const certificateNFTs = data.filter((nft) => nft.type === "certificate");
        const medicineNFTs = data.filter((nft) => nft.type === "medicine");

        setCertificates(certificateNFTs);
        setMedicines(medicineNFTs);
      } catch (error) {
        console.error("Lỗi khi tải danh sách NFT trên Market:", error.message);
        alert("Không thể tải danh sách NFT trên Market.");
      } finally {
        setLoading(false);
      }
    };

    loadMarketNFTs();
  }, []);

  return (
    <div className="market-nft">
      <h2>Chợ NFT</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {/* Hiển thị danh sách Giấy chứng nhận */}
          <div className="market-section">
            <h3>Giấy chứng nhận</h3>
            {certificates.length > 0 ? (
              <div className="market-list">
                {certificates.map((nft) => (
                  <div key={nft._id} className="market-card">
                    <img src={nft.imageUrl} alt={nft.name} />
                    <h4>{nft.name}</h4>
                    <p>{nft.description}</p>
                    <p>
                      Giá: {nft.price} {nft.currency || "SOL"}
                    </p>
                    <button className="btn-buy">Mua ngay</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có NFT nào thuộc loại "Giấy chứng nhận".</p>
            )}
          </div>

          <hr />

          {/* Hiển thị danh sách Thuốc */}
          <div className="market-section">
            <h3>Thuốc</h3>
            {medicines.length > 0 ? (
              <div className="market-list">
                {medicines.map((nft) => (
                  <div key={nft._id} className="market-card">
                    <img src={nft.imageUrl} alt={nft.name} />
                    <h4>{nft.name}</h4>
                    <p>{nft.description}</p>
                    <p>
                      Giá: {nft.price} {nft.currency || "SOL"}
                    </p>
                    <button className="btn-buy">Mua ngay</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có NFT nào thuộc loại "Thuốc".</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketNFT;
