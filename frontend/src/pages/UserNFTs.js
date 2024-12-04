import React, { useEffect, useState } from "react";
import {
  fetchUserNFTs,
  sellNFT,
  cancelNFTListing,
  fetchNFTDetails,
} from "../services/api";
import { useUserContext } from "../context/UserContext"; // Lấy context
import CreateNFT from "./CreateNFT"; // Import CreateNFT component
import "./styles/UserNFTs.css";

const UserNFTs = () => {
  const { user } = useUserContext(); // Lấy thông tin user từ context
  const [currencies, setCurrencies] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAddNFTModalOpen, setIsAddNFTModalOpen] = useState(false); // State để mở/đóng popup Thêm NFT
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [nftDetails, setNFTDetails] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      console.error("Token không tồn tại. Vui lòng đăng nhập.");
      return;
    }

    const loadUserNFTs = async () => {
      try {
        const assets = await fetchUserNFTs(user.token);
        const currencyAssets = assets.filter((item) => item.type === "Currency");
        const nftAssets = assets.filter((item) => item.type === "UniqueAsset");

        setCurrencies(currencyAssets);

        const updatedNFTs = await Promise.all(
          nftAssets.map(async (nft) => {
            const details = await fetchNFTDetails(nft.item.id, user.token);
            return {
              ...nft,
              item: {
                ...nft.item,
                forSale: details.data?.item?.forSale || false,
              },
            };
          })
        );

        setNFTs(updatedNFTs);
      } catch (error) {
        console.error("Lỗi khi tải NFT:", error.message);
        alert("Không thể tải tài sản của người dùng.");
      } finally {
        setLoading(false);
      }
    };

    loadUserNFTs();
  }, [user?.token]);

  const openSellModal = (nft) => {
    setSelectedNFT(nft);
    setPrice("");
    setCurrency("USDC");
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => {
    setSelectedNFT(null);
    setIsSellModalOpen(false);
  };

  const openWithdrawModal = (nft) => {
    setSelectedNFT(nft);
    setIsWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setSelectedNFT(null);
    setIsWithdrawModalOpen(false);
  };

  const openAddNFTModal = () => {
    setIsAddNFTModalOpen(true); // Mở popup "Thêm NFT"
  };

  const closeAddNFTModal = () => {
    setIsAddNFTModalOpen(false); // Đóng popup "Thêm NFT"
  };

  const handleViewDetails = async (nftId) => {
    setDetailsLoading(true);
    setIsDetailsModalOpen(true);
    try {
      const response = await fetchNFTDetails(nftId, user.token);
      const details = response.data?.item;
      if (details) {
        setNFTDetails({
          id: details.id,
          name: details.name,
          description: details.description,
          imageUrl: details.imageUrl,
          forSale: details.forSale,
          price: details.price?.naturalAmount
            ? `${details.price.naturalAmount} ${details.price.currencyId}`
            : "N/A",
          owner: details.owner?.address || "N/A",
          collection: details.collection?.name || "N/A",
        });
      } else {
        setNFTDetails(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết NFT:", error.message);
      alert("Không thể tải thông tin chi tiết NFT.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSellNFT = async () => {
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      alert("Vui lòng nhập giá hợp lệ!");
      return;
    }

    try {
      const response = await sellNFT(
        {
          assetId: selectedNFT?.item?.id,
          naturalAmount: price,
          currencyId: currency,
        },
        user.token
      );
      alert("NFT đã được rao bán thành công!");
      if (response.sellResponse?.consentUrl) {
        window.open(response.sellResponse.consentUrl, "_blank");
      }

      setNFTs((prevNFTs) =>
        prevNFTs.map((nft) =>
          nft.item.id === selectedNFT.item.id
            ? { ...nft, item: { ...nft.item, forSale: true } }
            : nft
        )
      );

      closeSellModal();
    } catch (error) {
      console.error("Lỗi khi rao bán NFT:", error.message);
      alert("Không thể rao bán NFT.");
    }
  };

  const handleWithdrawNFT = async () => {
    if (!selectedNFT) return;

    try {
      const response = await cancelNFTListing(selectedNFT.item.id, user.token);
      alert("NFT đã được thu hồi thành công!");

      if (response.cancelResponse?.consentUrl) {
        window.open(response.cancelResponse.consentUrl, "_blank");
      }

      setNFTs((prevNFTs) =>
        prevNFTs.map((nft) =>
          nft.item.id === selectedNFT.item.id
            ? { ...nft, item: { ...nft.item, forSale: false } }
            : nft
        )
      );

      closeWithdrawModal();
    } catch (error) {
      console.error("Lỗi khi thu hồi NFT:", error.message);
      alert("Không thể thu hồi NFT. Vui lòng thử lại.");
    }
  };

  if (!user?.token) {
    return <p>Vui lòng đăng nhập để xem tài sản của bạn.</p>;
  }

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="user-nfts-container">
      <h2>Tài sản của bạn</h2>

      {/* Nút mở popup Thêm NFT */}
      <button onClick={openAddNFTModal} className="btn-create">
        Thêm NFT
      </button>

      <div className="currency-section">
        <h3>Số dư</h3>
        <div className="currency-list">
          {currencies.map((currency) => (
            <div key={currency.item.id} className="currency-card">
              <h4>
                {currency.item.name} ({currency.item.symbol})
              </h4>
              <p>Số lượng: {currency.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="nft-section">
        <h3>Danh sách NFT</h3>
        <div className="nft-list">
          {nfts.map((nft) => (
            <div key={nft.item.id} className="nft-card">
              <img 
                src={nft.item.imageUrl || "placeholder-image.jpg"}
                alt={nft.item.name || "NFT"}
              />
              <h4>{nft.item.name || "Không có tên"}</h4>
              <p>{nft.item.description || "Không có mô tả"}</p>
              <div className="nft-card-buttons">
                <button onClick={() => handleViewDetails(nft.item.id)}>
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() =>
                    nft.item.forSale
                      ? openWithdrawModal(nft) // Mở modal thu hồi nếu `forSale` là true
                      : openSellModal(nft) // Mở modal rao bán nếu `forSale` là false
                  }
                >
                  {nft.item.forSale ? "Thu Hồi" : "Rao Bán"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Thêm NFT */}
      {isAddNFTModalOpen && (
        <div className="modal-overlay">
          <CreateNFT closeModal={closeAddNFTModal} />
        </div>
      )}

      {/* Modal chi tiết NFT */}
      {isDetailsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {detailsLoading ? (
              <p>Đang tải chi tiết...</p>
            ) : nftDetails ? (
              <>
                <h3>{nftDetails.name}</h3>
                <img src={nftDetails.imageUrl} alt={nftDetails.name} />
                <p>{nftDetails.description}</p>
                <p>Giá: {nftDetails.price}</p>
                <p>Chủ sở hữu: {nftDetails.owner}</p>
                <p>Bộ sưu tập: {nftDetails.collection}</p>
                <button onClick={() => setIsDetailsModalOpen(false)}>Đóng</button>
              </>
            ) : (
              <p>Không thể hiển thị chi tiết NFT.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal rao bán NFT */}
      {isSellModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rao bán NFT</h3>
            <p>Bạn đang rao bán NFT: "{selectedNFT?.item.name}"</p>
            <label>
              Giá:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá..."
              />
            </label>
            <label>
              Loại tiền:
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USDC">USDC</option>
                <option value="SOL">SOL</option>
              </select>
            </label>
            <button className="btn-confirm" onClick={handleSellNFT}>
              Xác nhận
            </button>
            <button className="btn-cancel" onClick={closeSellModal}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Modal thu hồi NFT */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận thu hồi NFT</h3>
            <p>Bạn có chắc chắn muốn thu hồi NFT: "{selectedNFT?.item.name}"?</p>
            <button className="btn-confirm" onClick={handleWithdrawNFT}>
              Xác nhận
            </button>
            <button className="btn-cancel" onClick={closeWithdrawModal}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNFTs;
