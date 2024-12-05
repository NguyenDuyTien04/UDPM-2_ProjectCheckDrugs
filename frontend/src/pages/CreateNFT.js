import React, { useState, useEffect } from "react";
import { createNFT, fetchCollections } from "../services/api";
import { useUserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/CreateNFT.css";

const CreateNFT = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collectionId: "",
    imageUrl: "",
    type: ""
  });

  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserContext();
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user?.token) {
      fetchNFTCollections(user.token);
    }
  }, [user?.token]);

  const fetchNFTCollections = async (token) => {
    try {
      const response = await fetchCollections(token);
      console.log("Dữ liệu collections:", response);
      if (response) {
        setCollections(response);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách bộ sưu tập:", err);
      toast.error("Không thể tải danh sách bộ sưu tập.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createNFT(formData, user.token);
      toast.success("NFT đã được tạo thành công!");
      if (closeModal) closeModal();
    } catch (error) {
      console.error("Lỗi khi tạo NFT:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo NFT");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlBlur = () => {
    setImagePreview(formData.imageUrl);
  };

  return (
    <div className="create-nft-container">
      <ToastContainer />
      <button onClick={closeModal} className="btn-dong">
        X
      </button>
      <h2>Tạo NFT</h2>
      <form onSubmit={handleSubmit}>
        <label>Loại NFT:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Chọn loại NFT
          </option>
          <option value="certificate">Giấy chứng nhận</option>
          <option value="medicine">Thuốc</option>
        </select>

        <label>Tên NFT:</label>
        <input
          type="text"
          name="name"
          placeholder="Tên NFT"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Mô tả:</label>
        <textarea
          name="description"
          placeholder="Mô tả"
          value={formData.description}
          onChange={handleChange}
        />

        <label>URL ảnh:</label>
        <input
          type="text"
          name="imageUrl"
          placeholder="Nhập URL hình ảnh"
          value={formData.imageUrl}
          onChange={handleChange}
          onBlur={handleImageUrlBlur}
        />
        {imagePreview && (
          <img
            width="100px"
            src={imagePreview}
            alt="Xem trước hình ảnh"
            className="image-preview"
          />
        )}

        <label>Bộ sưu tập:</label>
        <select
          name="collectionId"
          value={formData.collectionId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Chọn bộ sưu tập
          </option>
          {collections.map((collection) => (
            <option key={collection._id} value={collection.gameShiftCollectionId}>
              {collection.name || "Tên không xác định"}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang tạo..." : "Tạo NFT"}
        </button>
      </form>

      <button onClick={closeModal} className="btn-close-popup">
        Đóng Popup
      </button>
    </div>
  );
};

export default CreateNFT;
