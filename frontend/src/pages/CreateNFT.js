import React, { useState, useEffect } from 'react';
import { createCertificateNFT, createMedicineNFT, fetchCollections } from '../services/api';
import { useUserContext } from '../context/UserContext';

const CreateNFT = () => {
  const [type, setType] = useState('certificate'); // certificate hoặc medicine
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    collectionId: '',
    price: '',
  });
  const [collections, setCollections] = useState([]); // Danh sách bộ sưu tập
  const { user } = useUserContext();

  // Lấy danh sách bộ sưu tập khi component được render
  useEffect(() => {
    const fetchUserCollections = async () => {
      try {
        const response = await fetchCollections(user.token); // Gọi API lấy bộ sưu tập
        setCollections(response.data); // Lưu bộ sưu tập vào state
      } catch (error) {
        console.error('Lỗi khi tải bộ sưu tập:', error);
        alert('Không thể tải bộ sưu tập. Vui lòng thử lại.');
      }
    };

    fetchUserCollections();
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createFunction =
        type === 'certificate' ? createCertificateNFT : createMedicineNFT;
      const response = await createFunction(formData, user.token);
      alert(`NFT ${type === 'certificate' ? 'giấy chứng nhận' : 'thuốc'} được tạo thành công!`);
      console.log(response);
    } catch (error) {
      console.error('Lỗi khi tạo NFT:', error);
      alert('Lỗi khi tạo NFT. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <h2>Tạo NFT</h2>
      <form onSubmit={handleSubmit}>
        <label>Loại NFT:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
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

        <label>URL hình ảnh:</label>
        <input
          type="text"
          name="imageUrl"
          placeholder="URL hình ảnh"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <label>Bộ sưu tập:</label>
        <select
          name="collectionId"
          value={formData.collectionId}
          onChange={handleChange}
        >
          <option value="">Chọn bộ sưu tập</option>
          {collections.map((collection) => (
            <option key={collection._id} value={collection._id}>
              {collection.name}
            </option>
          ))}
        </select>

        <label>Giá (SOL):</label>
        <input
          type="number"
          name="price"
          placeholder="Giá (SOL)"
          value={formData.price}
          onChange={handleChange}
        />

        <button type="submit">Tạo NFT</button>
      </form>
    </div>
  );
};

export default CreateNFT;
