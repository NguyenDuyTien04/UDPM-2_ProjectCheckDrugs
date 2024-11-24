import React from "react";
import { useParams } from "react-router-dom";

const CreateMedicine = () => {
  const { collectionId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý tạo thuốc
    alert(`Tạo thuốc cho Collection: ${collectionId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tạo Thuốc</h2>
      <input type="text" placeholder="Tên thuốc" required />
      <textarea placeholder="Mô tả" required></textarea>
      <button type="submit">Tạo</button>
    </form>
  );
};

export default CreateMedicine;
