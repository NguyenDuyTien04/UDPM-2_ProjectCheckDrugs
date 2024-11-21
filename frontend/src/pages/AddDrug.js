import React, { useState } from "react";
import { addDrug } from "../services/api"; // API backend
import "./styles/AddDrug.css";

function AddDrug() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDrug({ name, price, expiryDate });
      setSuccessMessage("Thêm thuốc thành công!");
      setName("");
      setPrice("");
      setExpiryDate("");
    } catch (err) {
      console.error("Lỗi khi thêm thuốc:", err.message);
      setSuccessMessage("Lỗi khi thêm thuốc. Vui lòng thử lại!");
    }
  };

  return (
    <div className="add-drug-container">
      <h2>Thêm thuốc mới</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên thuốc"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Giá (SOL)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Ngày hết hạn"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <button type="submit">Thêm thuốc</button>
      </form>
    </div>
  );
}

export default AddDrug;
