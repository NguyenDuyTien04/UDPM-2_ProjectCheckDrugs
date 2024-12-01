import React, { useState, useEffect } from "react";
import {
  fetchCollections,
  createCollection,
  fetchNFTsByCollection,
} from "../services/api";
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
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const loadCollections = async () => {
        setLoading(true);
        try {
            if (!user?.token) throw new Error("Token không tồn tại.");
            
            // Gọi API để lấy danh sách bộ sưu tập
            const collectionsData = await fetchCollections(user.token);
            
            console.log("Danh sách bộ sưu tập nhận được:", collectionsData);

            // Gán danh sách bộ sưu tập vào state
            setCollections(collectionsData);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bộ sưu tập:", error.message);
            alert("Không thể tải danh sách bộ sưu tập.");
        } finally {
            setLoading(false);
        }
    };

    loadCollections();
}, [user?.token]);

  // Lấy danh sách NFT của bộ sưu tập
  const fetchNFTs = async (collectionId) => {
    try {
      console.log("Đang lấy danh sách NFT cho Collection ID:", collectionId); // Thêm log để kiểm tra ID
      if (!user?.token) throw new Error("Token không tồn tại.");
      const response = await fetchNFTsByCollection(collectionId, user.token);
      console.log("Danh sách NFT nhận được:", response);
      setNFTs(response.data?.data || []);
      setCurrentCollectionId(collectionId);
      setShowNFTPopup(true);
    } catch (error) {
      console.error("Lỗi khi tải danh sách NFT:", error.message);
      alert("Không thể tải danh sách NFT.");
    }
  };

  // Tạo bộ sưu tập mới
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      if (!user?.token) throw new Error("Token không tồn tại.");
      if (
        !newCollectionData.name.trim() ||
        !newCollectionData.description.trim() ||
        !newCollectionData.image.trim()
      ) {
        alert("Vui lòng nhập đầy đủ tên, mô tả và URL hình ảnh.");
        return;
      }

      console.log("Dữ liệu gửi tạo bộ sưu tập:", newCollectionData);
      const response = await createCollection(newCollectionData, user.token);
      alert(`Tạo bộ sưu tập "${response.name}" thành công!`);
      setShowCollectionPopup(false);

      // Tải lại danh sách bộ sưu tập
      const collectionsResponse = await fetchCollections(user.token);
      setCollections(collectionsResponse.data || []);
    } catch (error) {
      console.error("Lỗi khi tạo bộ sưu tập:", error.message);
      alert("Không thể tạo bộ sưu tập. Vui lòng thử lại.");
    } finally {
      setNewCollectionData({ name: "", description: "", imageUrl: "" });
    }
  };

  return (
    <div className="collections">
      <h2>Danh sách Bộ Sưu Tập</h2>
      <button onClick={() => setShowCollectionPopup(true)} className="btn-create">
        Tạo Bộ Sưu Tập
      </button>
      {loading ? (
        <p>Đang tải danh sách bộ sưu tập...</p>
      ) : collections.length === 0 ? (
        <p>Hiện không có bộ sưu tập nào. Hãy tạo một bộ sưu tập mới!</p>
      ) : (
        <div className="collection-list">
          {collections.map((collection) => (
            <div key={collection._id} className="collection-card">
              <img
                src={collection.imageUrl || "placeholder-image-url.jpg"}
                alt={collection.name || "Không có tên"}
                className="collection-image"
                onError={(e) => (e.target.src = "placeholder-image-url.jpg")}
              />
              <h3>{collection.name || "Không có tên"}</h3>
              <p>{collection.description || "Không có mô tả"}</p>
              <button
                onClick={() => fetchNFTs(collection.gameShiftCollectionId)}
                className="btn-detail"
              >
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
                  setNewCollectionData({ ...newCollectionData, image: e.target.value })
                }
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
              {nfts.length > 0 ? (
                nfts.map((nft) => (
                  <div key={nft.item.id} className="nft-card">
                    <img
                      src={nft.item.imageUrl || "placeholder-image.jpg"}
                      alt={nft.item.name || "NFT"}
                      className="nft-image"
                    />
                    <h4>{nft.item.name || "Không có tên"}</h4>
                    <p>{nft.item.description || "Không có mô tả"}</p>
                    <p>Chủ sở hữu: {nft.item.owner?.address || "Không xác định"}</p>
                  </div>
                ))
              ) : (
                <p>Không có NFT nào trong bộ sưu tập này.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
