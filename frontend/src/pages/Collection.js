import React, { useState, useEffect } from "react";
import { fetchCollections, createCollection, getNFTsByCollection, sellNFT } from "../services/api";
import { useUserContext } from "../context/UserContext";
import "./styles/Collection.css";

const Collections = () => {
  const { user } = useUserContext();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollectionPopup, setShowCollectionPopup] = useState(false);
  const [showNFTPopup, setShowNFTPopup] = useState(false);
  const [currentCollectionId, setCurrentCollectionId] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null); // Lưu NFT đang chọn để rao bán
  const [showSellModal, setShowSellModal] = useState(false); // Modal xác nhận rao bán
  const [sellPrice, setSellPrice] = useState(""); // Giá bán
  const [sellCurrency, setSellCurrency] = useState("SOL"); // Loại tiền tệ
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  // Fetch collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log("Token đang được gửi:", user.token);
        const data = await fetchCollections(user.token); // Gọi API
        setCollections(data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bộ sưu tập:", error.response || error.message);
        alert("Lỗi khi tải danh sách bộ sưu tập.");
      } finally {
        setLoading(false);
      }
    };
  
    loadCollections();
  }, [user.token]);

  // Fetch NFTs in a collection
  const fetchNFTs = async (collectionId) => {
    try {
      const data = await getNFTsByCollection(collectionId, user.token);
      setNFTs(data.data);
      setCurrentCollectionId(collectionId);
      setShowNFTPopup(true);
    } catch (error) {
      alert("Lỗi khi tải danh sách NFT.");
    }
  };

  // Create a new collection
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      await createCollection(newCollectionData, user.token);
      alert("Tạo bộ sưu tập thành công!");
      setShowCollectionPopup(false);
      const data = await fetchCollections(user.token); // Refresh collections
      setCollections(data.data);
    } catch (error) {
      alert("Lỗi khi tạo bộ sưu tập. Vui lòng thử lại.");
    }
  };

  // Rao bán NFT
  const handleSellNFT = async () => {
    try {
      if (!selectedNFT || !sellPrice || parseFloat(sellPrice) <= 0) {
        alert("Vui lòng nhập giá bán hợp lệ.");
        return;
      }
      await sellNFT(selectedNFT._id, sellPrice, sellCurrency, user.token);
      alert(`NFT "${selectedNFT.name}" đã được rao bán thành công!`);
      setShowSellModal(false);
      setSellPrice("");
      setSellCurrency("SOL");
    } catch (error) {
      console.error("Lỗi khi rao bán NFT:", error);
      alert("Lỗi khi rao bán NFT. Vui lòng thử lại.");
    }
  };

  return (
    <div className="collections">
      <h2>Danh sách Bộ Sưu Tập</h2>
      <button onClick={() => setShowCollectionPopup(true)} className="btn-create">
        Tạo Bộ Sưu Tập
      </button>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="collection-list">
          {collections.map((collection) => (
            <div key={collection._id} className="collection-card">
              <img src={collection.imageUrl} alt={collection.name} />
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
              <button onClick={() => fetchNFTs(collection._id)} className="btn-detail">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup để tạo bộ sưu tập */}
      {showCollectionPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Tạo Bộ Sưu Tập Mới</h3>
            <form onSubmit={handleCreateCollection}>
              <input
                type="text"
                placeholder="Tên bộ sưu tập"
                value={newCollectionData.name}
                onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Mô tả"
                value={newCollectionData.description}
                onChange={(e) =>
                  setNewCollectionData({ ...newCollectionData, description: e.target.value })
                }
                required
              ></textarea>
              <input
                type="text"
                placeholder="URL Hình Ảnh"
                value={newCollectionData.imageUrl}
                onChange={(e) =>
                  setNewCollectionData({ ...newCollectionData, imageUrl: e.target.value })
                }
                required
              />
              <button type="submit">Tạo</button>
              <button onClick={() => setShowCollectionPopup(false)}>Hủy</button>
            </form>
          </div>
        </div>
      )}

      {/* Popup hiển thị danh sách NFT */}
      {showNFTPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Danh sách NFT trong Bộ Sưu Tập</h3>
            <button onClick={() => setShowNFTPopup(false)}>Đóng</button>
            <div className="nft-list">
              {nfts.map((nft) => (
                <div key={nft._id} className="nft-card">
                  <img src={nft.imageUrl} alt={nft.name} />
                  <h4>{nft.name}</h4>
                  <p>{nft.description}</p>
                  <button
                    onClick={() => {
                      setSelectedNFT(nft);
                      setShowSellModal(true);
                    }}
                    className="btn-sell"
                  >
                    Rao Bán
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận rao bán */}
      {showSellModal && selectedNFT && (
        <div className="modal">
          <div className="modal-content">
            <h3>Rao Bán NFT</h3>
            <img src={selectedNFT.imageUrl} alt={selectedNFT.name} />
            <p>Tên: {selectedNFT.name}</p>
            <p>Mô tả: {selectedNFT.description}</p>
            <input
              type="number"
              placeholder="Nhập giá bán"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              required
            />
            <select
              value={sellCurrency}
              onChange={(e) => setSellCurrency(e.target.value)}
              className="currency-selector"
            >
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
            </select>
            <button onClick={handleSellNFT} className="btn-confirm">
              Đồng ý
            </button>
            <button onClick={() => setShowSellModal(false)} className="btn-cancel">
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
