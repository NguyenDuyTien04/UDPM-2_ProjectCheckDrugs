import React, { useState, useEffect } from 'react';
import { getMedicineList } from '../utils/api';
import { Button } from 'react-bootstrap';
import QrScanner from 'react-qr-scanner'; // Import đúng thư viện
import './css/HomePage.css';

function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [visibleMedicines, setVisibleMedicines] = useState(12); // Số lượng thuốc hiển thị
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem có thuốc để hiển thị thêm không
  const [showScanner, setShowScanner] = useState(false); // Điều khiển hiển thị giao diện quét QR
  const [scannedMedicine, setScannedMedicine] = useState(null); // Lưu thuốc được quét

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

  const handleScan = (data) => {
    if (data) {
      const foundMedicine = medicines.find(
        (medicine) => medicine.maQR === data.text
      );
      setScannedMedicine(foundMedicine || 'Không tìm thấy thuốc');
      setShowScanner(false); // Tắt giao diện quét
    }
  };

  const handleError = (err) => {
    console.error('Lỗi khi quét QR:', err);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Danh sách thuốc</h2>

      {/* Giao diện quét QR */}
      {showScanner && (
        <div className="qr-scanner">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          <Button onClick={() => setShowScanner(false)} className="btn btn-danger mt-3">
            Đóng
          </Button>
        </div>
      )}

      {/* Hiển thị kết quả quét */}
      {scannedMedicine && (
        <div className="alert alert-success mt-3">
          <h5>Kết quả quét:</h5>
          {scannedMedicine === 'Không tìm thấy thuốc' ? (
            <p>{scannedMedicine}</p>
          ) : (
            <div>
              <p>Tên thuốc: {scannedMedicine.tenThuoc}</p>
              <p>Giá: {scannedMedicine.gia} đ</p>
              <p>Số lô: {scannedMedicine.soLo}</p>
            </div>
          )}
        </div>
      )}

      {/* Danh sách thuốc */}
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

      {hasMore && (
        <div className="text-center mt-4">
          <Button onClick={handleLoadMore} className="btn btn-primary">
            Xem thêm
          </Button>
        </div>
      )}

      {/* Nút kích hoạt giao diện quét mã QR */}
      <div className="text-center mt-4">
        <Button onClick={() => setShowScanner(true)} className="btn btn-secondary">
          Quét mã QR
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
