import React, { useState, useEffect } from 'react';
import { createNFT, fetchCollections } from '../services/api';
import { useUserContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/CreateNFT.css';
import { fetchNFTs } from '../services/api'; // Cập nhật đúng đường dẫn

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


  
  const fetchNFTCollections = async (token) => {
    console.log("Fetching collections with token:", token); // Logs the user token
    try {
        const collectionsData = await fetchCollections(token); // Calls fetchCollections API
        console.log("collectionsData",collectionsData);
        if (collectionsData && collectionsData.length > 0) {
            setCollections(collectionsData); // Updates state with fetched NFT collections
            toast.success('Danh sách bộ sưu tập NFT đã tải thành công!', {
                position: 'top-center',
            });
        } else {
            toast.warning('Không có bộ sưu tập NFT nào được tìm thấy.', {
                position: 'top-center',
            });
        }
    } catch (err) {
        console.error('Lỗi khi tải danh sách bộ sưu tập NFT:', err.message); // Logs error
        setError(err.message); // Sets error state
        toast.error('Không thể tải danh sách bộ sưu tập NFT.', {
            position: 'top-center',
        });
    }
};

useEffect(() => {
  if (user.token) {
      fetchNFTCollections(user.token); // Calls fetchNFTCollections when token is available or changes
  }
}, [user.token]); // Dependency on user.token (re-runs when token changes)

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

    if (!user?.token) {
      toast.error('Please log in to continue.', { position: 'top-center' });
      setIsLoading(false);
      return;
    }

    console.log('Submitting form data:', formData); // Log form data

    try {
      const newNFT = await createNFT(formData, user.token);
      setNftsCreated([...nftsCreated, newNFT]);
      toast.success('NFT created successfully!', { position: 'top-center' });
    } catch (error) {
      console.error('Error creating NFT:', error); // Log error details
      toast.error('Failed to create NFT. Please try again.', { position: 'top-center' });
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
            <option key={collection.id} value={collection.gameShiftCollectionId}>
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
{nftsCreated.length > 0 ? (
  <ul className="nft-list">
    {nftsCreated.map((nft, index) => (
      <li key={index} className="nft-item">
        <h4>{nft.name}</h4>
        <p>{nft.description || 'Không có mô tả'}</p>
        {nft.imageUrl ? (
          <img src={nft.imageUrl} alt={nft.name} className="nft-image" />
        ) : (
          <p>Không có hình ảnh</p>
        )}
      </li>
    ))}
  </ul>
) : (
  <p>Không có NFT nào được tạo.</p>
)}

    </div>
  );
};


export default CreateNFT;
