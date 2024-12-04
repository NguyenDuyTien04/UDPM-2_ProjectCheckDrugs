import React, { useState, useEffect } from "react";
import { createNFT, fetchCollections } from "../services/api";
import { useUserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/CreateNFT.css";

const CreateNFT = ({ closeModal, onNFTCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collectionId: "",
    type: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  const fetchNFTCollections = async (token) => {
    try {
      const collectionsData = await fetchCollections(token);
      if (collectionsData && collectionsData.length > 0) {
        setCollections(collectionsData);
        toast.success("Danh sách bộ sưu tập NFT đã tải thành công!", {
          position: "top-center",
        });
      } else {
        toast.warning("Không có bộ sưu tập NFT nào được tìm thấy.", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách bộ sưu tập NFT:", err.message);
      setError(err.message);
      toast.error("Không thể tải danh sách bộ sưu tập NFT.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchNFTCollections(user.token);
    }
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUrlBlur = () => {
    if (formData.imageUrl.trim() === "") return;

    const image = new Image();
    image.src = formData.imageUrl;

    image.onload = () => {
      setImagePreview(formData.imageUrl);
      toast.success("URL ảnh hợp lệ!", { position: "top-center" });
    };

    image.onerror = () => {
      setImagePreview("");
      toast.error("URL ảnh không hợp lệ hoặc không thể tải ảnh.", {
        position: "top-center",
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user?.token) {
      toast.error("Vui lòng đăng nhập để tiếp tục.", { position: "top-center" });
      setIsLoading(false);
      return;
    }

    console.log("Dữ liệu gửi để tạo NFT:", formData); // Log dữ liệu để kiểm tra

    try {
      await createNFT(formData, user.token);
      toast.success("NFT được tạo thành công!", { position: "top-center" });

      // Notify to update NFT list
      onNFTCreated();

      setFormData({ name: "", description: "", collectionId: "", type: "", imageUrl: "" });
      closeModal();
    } catch (error) {
      console.error("Lỗi khi tạo NFT:", error);
    } finally {
      setIsLoading(false);
    }
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
            width={"100px"}
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
            <option key={collection.gameShiftCollectionId} value={collection.gameShiftCollectionId}>
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
