import React, { useState, useEffect } from 'react';
import { createNFT, fetchCollections } from '../services/api';
import { useUserContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/CreateNFT.css';

const CreateNFT = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collectionId: '',
    type: '', // Không đặt mặc định, bắt buộc người dùng chọn
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [collections, setCollections] = useState([]);
  const [nftsCreated, setNftsCreated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  // Lấy danh sách bộ sưu tập
  useEffect(() => {
    const fetchUserCollections = async () => {
      setIsLoading(true);
      try {
        if (!user?.token) throw new Error('Không có token. Vui lòng đăng nhập lại.');
        console.log('Token:', user.token); // Kiểm tra token
        const response = await fetchCollections(user.token);
        setCollections(response.data || []);
        toast.success('Danh sách bộ sưu tập đã tải thành công!', {
          position: 'top-center',
        });
      } catch (error) {
        console.error('Lỗi khi tải bộ sưu tập:', error);
        setError('Không thể tải bộ sưu tập. Vui lòng thử lại.');
        toast.error('Không thể tải bộ sưu tập. Vui lòng thử lại.', {
          position: 'top-center',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCollections();
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUrlBlur = () => {
    if (formData.imageUrl.trim() === '') return;

    const image = new Image();
    image.src = formData.imageUrl;

    image.onload = () => {
      setImagePreview(formData.imageUrl);
      toast.success('URL ảnh hợp lệ!', { position: 'top-center' });
    };

    image.onerror = () => {
      setImagePreview('');
      toast.error('URL ảnh không hợp lệ hoặc không thể tải ảnh.', {
        position: 'top-center',
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Kiểm tra token
    if (!user?.token) {
      toast.error('Vui lòng đăng nhập lại để tiếp tục.', { position: 'top-center' });
      setIsLoading(false);
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.collectionId.trim() ||
      !formData.type.trim() ||
      !formData.imageUrl.trim()
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin!', { position: 'top-center' });
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API tạo NFT
      const response = await createNFT(formData, user.token);
      setNftsCreated((prev) => [...prev, response]); // Cập nhật danh sách NFT đã tạo
      toast.success(`NFT "${formData.name}" được tạo thành công!`, { position: 'top-center' });

      // Reset form
      setFormData({
        name: '',
        description: '',
        collectionId: '',
        type: '',
        imageUrl: '',
      });
      setImagePreview('');
    } catch (error) {
      console.error('Lỗi khi tạo NFT:', error);
      toast.error('Lỗi khi tạo NFT. Vui lòng thử lại.', { position: 'top-center' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-nft-container">
      <ToastContainer />
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
          onBlur={handleImageUrlBlur} // Kiểm tra URL khi rời khỏi trường nhập
        />
        {imagePreview && (
          <img
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
            <option key={collection.id} value={collection.id}>
              {collection.name || 'Tên không xác định'}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tạo...' : 'Tạo NFT'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <h3>Danh sách NFT đã tạo</h3>
      <ul className="nft-list">
        {nftsCreated.map((nft, index) => (
          <li key={index}>
            <h4>{nft.name}</h4>
            <p>{nft.description}</p>
            <img src={nft.imageUrl} alt={nft.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateNFT;
