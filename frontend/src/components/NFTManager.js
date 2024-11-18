import React from 'react';

const NFTManager = () => {
  return (
    <div>
      <h2>Quản Lý NFT</h2>
      <form>
        <div>
          <label>Tên NFT:</label>
          <input type="text" name="tokenName" />
        </div>
        <div>
          <label>Mô Tả:</label>
          <textarea name="description"></textarea>
        </div>
        <div>
          <label>Địa Chỉ Người Nhận:</label>
          <input type="text" name="recipientAddress" />
        </div>
        <button type="submit">Tạo NFT</button>
      </form>
    </div>
  );
};

export default NFTManager;
