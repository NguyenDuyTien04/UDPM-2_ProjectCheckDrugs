import React from "react";
import { useParams } from "react-router-dom";

const CreateCertificate = () => {
  const { collectionId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý tạo giấy chứng nhận
    alert(`Tạo giấy chứng nhận cho Collection: ${collectionId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tạo Giấy Chứng Nhận</h2>
      <input type="text" placeholder="Tên giấy chứng nhận" required />
      <textarea placeholder="Mô tả" required></textarea>
      <button type="submit">Tạo</button>
    </form>
  );
};

export default CreateCertificate;
