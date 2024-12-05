import React, { useState, useEffect } from "react";
import { fetchMarketNFTs, buyNFT } from "../services/api";
import "./styles/MarketNFT.css";
import { useUserContext } from "../context/UserContext";

const MarketNFT = () => {
  const { user } = useUserContext();
  const [certificates, setCertificates] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Load NFT data from market
  useEffect(() => {
    const loadMarketNFTs = async () => {
      try {
        const data = await fetchMarketNFTs(); // Fetch NFT data
        console.log("Danh sách NFT từ Market:", data);

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu từ API không hợp lệ.");
        }

        // Log để kiểm tra dữ liệu từng phần tử
        data.forEach((nft, index) => {
          console.log(`NFT ${index + 1}:`, nft);
        });

        // Get the current user's wallet address
        const currentUserWalletAddress = user?.walletAddress;

        // Filter out NFTs that belong to the current user
        const filteredData = data.filter((nft) => nft.owner?.address !== currentUserWalletAddress);

        // Classify NFTs into categories
        const certificateNFTs = filteredData.filter((nft) =>
          nft.attributes?.some((attr) => attr.value === "certificate")
        );
        const medicineNFTs = filteredData.filter((nft) =>
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
  }, [user]);

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

      // Call API to buy NFT
      const response = await buyNFT(selectedNFT.id);

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
        <>
          {/* Certificate NFTs */}
          <div className="market-section">
            <h3>Giấy chứng nhận</h3>
            {certificates.length > 0 ? (
              <div className="market-list">
                {certificates.map((nft) => (
                  <div key={nft.id} className="market-card">
                    <img
                      src={nft.imageUrl || "placeholder-image-url.jpg"}
                      alt={nft.name || "Không có tên"}
                      onError={(e) => (e.target.src = "placeholder-image-url.jpg")}
                    />
                    <h4>{nft.name || "Không có tên"}</h4>
                    <p>{nft.description || "Không có mô tả"}</p>
                    <p>
                      Giá: {" "}
                      {nft.price && nft.price.naturalAmount
                        ? `${parseFloat(nft.price.naturalAmount).toFixed(2)} ${nft.price.currencyId || "SOL"}`
                        : "Không có giá"}
                    </p>
                    <button onClick={() => openModal(nft)} className="btn-buy">
                      Mua ngay
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có NFT nào thuộc loại "Giấy chứng nhận".</p>
            )}
          </div>

          <hr />

          {/* Medicine NFTs */}
          <div className="market-section">
            <h3>Thuốc</h3>
            {medicines.length > 0 ? (
              <div className="market-list">
                {medicines.map((nft) => (
                  <div key={nft.id} className="market-card">
                    <img
                      src={nft.imageUrl || "placeholder-image-url.jpg"}
                      alt={nft.name || "Không có tên"}
                      onError={(e) => (e.target.src = "placeholder-image-url.jpg")}
                    />
                    <h4>{nft.name || "Không có tên"}</h4>
                    <p>{nft.description || "Không có mô tả"}</p>
                    <p>
                      Giá: {" "}
                      {nft.price && nft.price.naturalAmount
                        ? `${parseFloat(nft.price.naturalAmount).toFixed(2)} ${nft.price.currencyId || "SOL"}`
                        : "Không có giá"}
                    </p>
                    <button onClick={() => openModal(nft)} className="btn-buy">
                      Mua ngay
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có NFT nào thuộc loại "Thuốc".</p>
            )}
          </div>

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
        </>
      )}
    </div>
  );
};
export default MarketNFT;
