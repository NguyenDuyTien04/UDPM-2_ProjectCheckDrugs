import React, { useState, useEffect } from 'react';
import { createCertificateNFT, createMedicineNFT, fetchCollections } from '../services/api';
import { useUserContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './styles/CreateNFT.css';

const CreateNFT = () => {
  const [type, setType] = useState('certificate');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collectionId: '',
    price: '',
    imageUrl: '', // URL của ảnh online
  });
  const [selectedImage, setSelectedImage] = useState(null); // File ảnh từ máy
  const [imagePreview, setImagePreview] = useState(''); // Đường dẫn xem trước ảnh
  const [useUrl, setUseUrl] = useState(true); // Chọn giữa URL hoặc File
  const [collections, setCollections] = useState([]);
  const [nftsCreated, setNftsCreated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchUserCollections = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCollections(user.token);
        setCollections(response.data);
        setIsLoading(false);
        toast.success('Danh sách bộ sưu tập đã tải thành công!', {
          position: 'top-center',
        });
      } catch (error) {
        console.error('Lỗi khi tải bộ sưu tập:', error);
        setError('Không thể tải bộ sưu tập. Vui lòng thử lại.');
        setIsLoading(false);
        toast.error('Không thể tải bộ sưu tập. Vui lòng thử lại.', {
          position: 'top-center',
        });
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
      console.log('Ảnh tải thành công:', formData.imageUrl); // Ghi log khi ảnh hợp lệ
      toast.success('Ảnh hợp lệ!');
    };
  
    image.onerror = () => {
      setImagePreview('');
      console.error('Không thể tải ảnh từ URL:', formData.imageUrl); // Ghi log khi lỗi
      toast.error('URL ảnh không hợp lệ hoặc không thể tải ảnh.');
    };
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo đường dẫn xem trước
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('collectionId', formData.collectionId);
      formDataToSend.append('price', formData.price);

      if (useUrl) {
        // Nếu sử dụng URL ảnh
        formDataToSend.append('imageUrl', formData.imageUrl);
      } else if (selectedImage) {
        // Nếu chọn file từ máy tính
        formDataToSend.append('image', selectedImage);
      } else {
        toast.error('Vui lòng chọn ảnh hoặc nhập URL ảnh!');
        setIsLoading(false);
        return;
      }

      const createFunction =
        type === 'certificate' ? createCertificateNFT : createMedicineNFT;
      const response = await createFunction(formDataToSend, user.token);

      setNftsCreated((prev) => [...prev, response]);
      toast.success(`NFT ${type === 'certificate' ? 'giấy chứng nhận' : 'thuốc'} được tạo thành công!`, {
        position: 'top-center',
      });

      // Reset lại form
      setFormData({
        name: '',
        description: '',
        collectionId: '',
        price: '',
        imageUrl: '',
      });
      setSelectedImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Lỗi khi tạo NFT:', error);
      setError('Lỗi khi tạo NFT. Vui lòng thử lại.');
      toast.error('Lỗi khi tạo NFT. Vui lòng thử lại.', {
        position: 'top-center',
      });
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

        <label>Chọn cách tải ảnh:</label>
        <div>
          <label>
            <input
              type="radio"
              name="useUrl"
              checked={useUrl}
              onChange={() => setUseUrl(true)}
            />
            Sử dụng URL ảnh
          </label>
          <label>
            <input
              type="radio"
              name="useUrl"
              checked={!useUrl}
              onChange={() => setUseUrl(false)}
            />
            Tải ảnh từ máy
          </label>
        </div>

        {useUrl ? (
          <>
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
          </>
        ) : (
          <>
            <label>Chọn tệp hình ảnh:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Xem trước hình ảnh"
                className="image-preview"
              />
            )}
          </>
        )}

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
            <img src={nft.imageUrl || nft.image} alt={nft.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateNFT;
