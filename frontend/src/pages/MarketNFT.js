import React, { useState, useEffect } from "react";
import { fetchMarketNFTs, buyNFT } from "../services/api";
import "./styles/MarketNFT.css";

const MarketNFT = () => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Load NFT data from market
  useEffect(() => {
    const loadMarketNFTs = async () => {
      try {
        const response = await fetchMarketNFTs();
        const data = response;

        console.log("Danh sách NFT từ Market giao diện:", data);

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu từ API không hợp lệ.");
        }

        setNFTs(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách NFT:", error.message);
        alert("Không thể tải danh sách NFT từ Market.");
      } finally {
        setLoading(false);
      }
    };

    loadMarketNFTs();
  }, []);

  // Open modal for confirmation
  const openModal = (nft) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedNFT(null);
    setIsModalOpen(false);
  };

  // Handle buy NFT
  const handleBuyNFT = async () => {
    try {
      if (!selectedNFT) return;

      // Đảm bảo rằng bạn đang truyền đúng ID
      const nftId = selectedNFT.id;

      // Call API to buy NFT
      const response = await buyNFT(nftId);

    // Check if consentUrl exists and open it
    if (response.purchaseResponse?.consentUrl) {
      window.open(response.purchaseResponse.consentUrl, "_blank");
      alert(`NFT "${selectedNFT.name}" đã được chuyển tới trang ký giao dịch.`);
    } else {
      alert(`NFT "${selectedNFT.name}" đã được mua thành công.`);
    }

    // Close modal after purchase
    closeModal();
  } catch (error) {
    if (error.message.includes("User rejected the request")) {
      alert("Bạn đã từ chối giao dịch. Vui lòng thử lại nếu muốn tiếp tục.");
    } else {
      alert("Không thể thực hiện giao dịch. Vui lòng thử lại.");
    }
    console.error("Lỗi khi mua NFT:", error.message);
  }
};


  return (
    <div className="market-nft">
      <h2>Chợ NFT</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="market-list">
          {nfts.map((nft) => (
            <div key={nft.id} className="market-card">
              <img
                src={nft.imageUrl || "placeholder-image-url.jpg"}
                alt={nft.name || "Không có tên"}
                onError={(e) => (e.target.src = "placeholder-image-url.jpg")}
              />
              <h4>{nft.name || "Không có tên"}</h4>
              <p>{nft.description || "Không có mô tả"}</p>
              <p>
                Giá: {parseFloat(nft.price.naturalAmount).toFixed(2)}{" "}
                {nft.price.currencyId || "SOL"}
              </p>
              <button onClick={() => openModal(nft)} className="btn-buy">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for confirmation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận mua NFT</h3>
            <p>Bạn có chắc chắn muốn mua NFT: "{selectedNFT?.name}" không?</p>
            <button onClick={handleBuyNFT} className="btn-confirm">
              Xác nhận
            </button>
            <button onClick={closeModal} className="btn-cancel">
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketNFT;