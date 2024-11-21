import React, { useEffect, useState } from "react";
import { getDrugs } from "../services/api"; // API backend
import "./styles/DrugsList.css";

function DrugsList() {
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await getDrugs();
        setDrugs(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thuốc:", err.message);
      }
    };

    fetchDrugs();
  }, []);

  return (
    <div className="drugs-list-container">
      <h2>Danh sách thuốc</h2>
      <div className="drugs-grid">
        {drugs.map((drug) => (
          <div key={drug.id} className="drug-card">
            <h3>{drug.name}</h3>
            <p>Giá: {drug.price} SOL</p>
            <p>Ngày hết hạn: {drug.expiryDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrugsList;
