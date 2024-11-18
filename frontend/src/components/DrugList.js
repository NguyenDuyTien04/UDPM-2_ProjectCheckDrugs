import React, { useEffect, useState } from 'react';
import axios from '../api/drugApi'; // Đảm bảo API này tồn tại

const DrugList = () => {
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get('/list');
        setDrugs(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thuốc:', error);
      }
    };
    fetchDrugs();
  }, []);

  return (
    <div>
      <h2>Danh Sách Thuốc</h2>
      <ul>
        {drugs.map((drug) => (
          <li key={drug._id}>
            {drug.tenThuoc} - Giá: {drug.gia} SOL
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrugList;
