import React, { useState } from 'react';
import axios from 'axios';

function CreateNFT() {
  const [tokenName, setTokenName] = useState('');
  const [description, setDescription] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleCreateNFT = async () => {
    try {
      // Gọi API để tạo NFT, dùng ví dụ từ Gameshift hoặc Solana SDK
      const response = await axios.post('https://api.gameshift.dev/nx/mint', {
        tokenName,
        description,
        recipientAddress,
      }, {
        headers: {
          'x-api-key': 'YOUR_GAMESHIFT_API_KEY',
          'Content-Type': 'application/json',
        }
      });
      
      console.log('NFT đã tạo thành công:', response.data);
      alert('NFT đã tạo thành công');
    } catch (error) {
      console.error('Lỗi khi tạo NFT:', error);
      alert('Lỗi khi tạo NFT');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tạo NFT</h2>
      <div className="mb-3">
        <label>Tên NFT</label>
        <input
          type="text"
          className="form-control"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Mô tả NFT</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Địa chỉ ví người nhận</label>
        <input
          type="text"
          className="form-control"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleCreateNFT}>Tạo NFT</button>
    </div>
  );
}

export default CreateNFT;
