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
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [sellCurrency, setSellCurrency] = useState("SOL");
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    description: "",
    image: "", // Đổi từ imageUrl thành image
  });

  // Lấy danh sách bộ sưu tập
  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);  // Đảm bảo set loading về true mỗi khi yêu cầu mới được gửi
      try {
        const data = await fetchCollections(user.token);
  
        // Kiểm tra dữ liệu trả về từ backend
        if (data && Array.isArray(data.data)) {
          setCollections(data.data); // Đúng trường 'data' từ backend
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", data);
          alert("Dữ liệu không hợp lệ từ server.");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bộ sưu tập:", error.message);
        // Thêm chi tiết lỗi nếu có
        alert(`Lỗi khi tải danh sách bộ sưu tập: ${error.response ? error.response.data : error.message}`);
      } finally {
        setLoading(false); // Đảm bảo set lại loading khi đã hoàn thành hoặc có lỗi
      }
    };
  
    loadCollections();
  }, [user.token]);
  

  // Lấy danh sách NFT của bộ sưu tập
  const fetchNFTs = async (collectionId) => {
    try {
      const data = await getNFTsByCollection(collectionId, user.token);
      
      // Kiểm tra dữ liệu trả về từ backend
      if (data && Array.isArray(data.nfts)) {
        setNFTs(data.nfts); // Đảm bảo dữ liệu là mảng và có trường 'nfts'
        setCurrentCollectionId(collectionId);
        setShowNFTPopup(true);
      } else {
        console.error("Dữ liệu trả về không hợp lệ cho NFT:", data);
        alert("Không có NFT nào trong bộ sưu tập này.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách NFT:", error.message);
      // Thêm thông báo lỗi chi tiết nếu có
      alert(`Không thể tải danh sách NFT: ${error.response ? error.response.data : error.message}`);
    }
  };
  

  // Tạo bộ sưu tập mới
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const createdCollection = await createCollection(newCollectionData, user.token);
      alert(`Tạo bộ sưu tập thành công với ID: ${createdCollection.collectionId}`);
      setShowCollectionPopup(false);
  
      // Tải lại danh sách bộ sưu tập
      const data = await fetchCollections(user.token);
      setCollections(data.collections);
    } catch (error) {
      console.error("Lỗi khi tạo bộ sưu tập:", error.message);
      if (error.response) {
        console.error("Lỗi từ API:", error.response.data);
        alert(`API Error: ${error.response.data.message || "Không thể tạo bộ sưu tập."}`);
      } else {
        alert("Lỗi mạng hoặc không thể kết nối với API. Vui lòng kiểm tra kết nối.");
      }
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
      console.error("Lỗi khi rao bán NFT:", error.message);
      alert("Không thể rao bán NFT. Vui lòng thử lại.");
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
          {collections && collections.length > 0 ? (
            collections.map((collection) => (
              <div key={collection._id} className="collection-card">
                <img src={collection.image} alt={collection.name} /> {/* Đảm bảo sử dụng đúng trường image */}
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <button onClick={() => fetchNFTs(collection._id)} className="btn-detail">
                  Xem chi tiết
                </button>
              </div>
            ))
          ) : (
            <p>Không có bộ sưu tập nào.</p>
          )}
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
                onChange={(e) => setNewCollectionData({ ...newCollectionData, description: e.target.value })}
                required
              ></textarea>
              <input
                type="text"
                placeholder="URL Hình Ảnh"
                value={newCollectionData.image} // Đổi từ imageUrl thành image
                onChange={(e) => setNewCollectionData({ ...newCollectionData, image: e.target.value })}
                required
              />
              <button type="submit">Tạo</button>
              <button type="button" onClick={() => setShowCollectionPopup(false)}>
                Hủy
              </button>
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
              {nfts && nfts.length > 0 ? (
                nfts.map((nft) => (
                  <div key={nft._id} className="nft-card">
                    <img src={nft.image} alt={nft.name} /> {/* Đảm bảo sử dụng đúng trường image */}
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
                ))
              ) : (
                <p>Không có NFT nào trong bộ sưu tập này.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận rao bán */}
      {showSellModal && selectedNFT && (
        <div className="modal">
          <div className="modal-content">
            <h3>Rao Bán NFT</h3>
            <img src={selectedNFT.image} alt={selectedNFT.name} /> {/* Đảm bảo sử dụng đúng trường image */}
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
 