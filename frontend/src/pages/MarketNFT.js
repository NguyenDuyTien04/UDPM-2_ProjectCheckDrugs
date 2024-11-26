import React, { useState, useEffect } from "react";
import { fetchMarketNFTs } from "../services/api";
import "./styles/MarketNFT.css";

const MarketNFT = () => {
  const [certificates, setCertificates] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketNFTs = async () => {
      try {
        const data = await fetchMarketNFTs(); // Gọi API và lấy danh sách NFT
        console.log("Danh sách NFT từ Market:", data);

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu từ API không hợp lệ.");
        }

        // Phân loại NFT theo thuộc tính `attributes`
        const certificateNFTs = data.filter((nft) =>
          nft.attributes?.some((attr) => attr.value === "certificate")
        );
        const medicineNFTs = data.filter((nft) =>
          nft.attributes?.some((attr) => attr.value === "medicine")
        );

        setCertificates(certificateNFTs);
        setMedicines(medicineNFTs);
      } catch (error) {
        console.error("Lỗi khi tải danh sách NFT:", error.message);
        alert("Không thể tải danh sách NFT từ Market.");
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
          <div className="market-section">
            <h3>Giấy chứng nhận</h3>
            {certificates.length > 0 ? (
              <div className="market-list">
                {certificates.map((nft) => (
                  <div key={nft.id} className="market-card">
                    <img
                      src={nft.imageUrl || "placeholder-image-url.jpg"}
                      alt={nft.name || "Không có tên"}
                      onError={(e) =>
                        (e.target.src = "placeholder-image-url.jpg")
                      }
                    />
                    <h4>{nft.name || "Không có tên"}</h4>
                    <p>{nft.description || "Không có mô tả"}</p>
                    <p>
                      Giá: {(nft.priceCents / 100).toFixed(2)}{" "}
                      {nft.currency || "SOL"}
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

          <div className="market-section">
            <h3>Thuốc</h3>
            {medicines.length > 0 ? (
              <div className="market-list">
                {medicines.map((nft) => (
                  <div key={nft.id} className="market-card">
                    <img
                      src={nft.imageUrl || "placeholder-image-url.jpg"}
                      alt={nft.name || "Không có tên"}
                      onError={(e) =>
                        (e.target.src = "placeholder-image-url.jpg")
                      }
                    />
                    <h4>{nft.name || "Không có tên"}</h4>
                    <p>{nft.description || "Không có mô tả"}</p>
                    <p>
                      Giá: {(nft.priceCents / 100).toFixed(2)}{" "}
                      {nft.currency || "SOL"}
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
