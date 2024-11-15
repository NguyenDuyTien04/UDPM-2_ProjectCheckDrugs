import React, { useState, useEffect } from 'react';
import { getMedicineList } from '../utils/api';
import { Button } from 'react-bootstrap';
import './css/HomePage.css';

function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [visibleMedicines, setVisibleMedicines] = useState(12); // Số lượng thuốc hiển thị
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem có thuốc để hiển thị thêm không

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getMedicineList();
        setMedicines(response);
      } catch (err) {
        console.error('Lỗi:', err.message);
      }
    };
    fetchMedicines();
  }, []);

  const handleLoadMore = () => {
    if (visibleMedicines + 12 <= medicines.length) {
      setVisibleMedicines(visibleMedicines + 12);
    } else {
      setVisibleMedicines(medicines.length);
      setHasMore(false); // Không còn thuốc để hiển thị thêm
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Danh sách thuốc</h2>
      <div className="medicine-container">
        {medicines.slice(0, visibleMedicines).map((medicine) => (
          <div key={medicine._id} className="medicine-card">
            <div className="medicine-discount">Giảm 50%</div>
            <img
              src={medicine.duongDanAnh.startsWith('/uploads/')
                ? `http://localhost:5000${medicine.duongDanAnh}`
                : medicine.duongDanAnh}
              alt="Ảnh thuốc"
              className="medicine-image"
            />
            <div>
              <div className="medicine-title">{medicine.tenThuoc}</div>
              <div className="medicine-price">{medicine.gia} đ</div>
              <div className="medicine-description">Số lô: {medicine.soLo}</div>
        
              <Button className="btn">Mua</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
