import React, { useState, useEffect } from 'react';
import { getMedicineList } from '../utils/api';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import QrScanner from 'react-qr-scanner';
import './css/HomePage.css';

function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [qrData, setQrData] = useState(null); // Thêm trạng thái cho dữ liệu quét QR
  const [showScanner, setShowScanner] = useState(false); // Trạng thái hiển thị quét QR

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

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  const handleScan = (result) => {
    if (result) {
      console.log('Dữ liệu từ QR:', result.text); // In kết quả quét QR ra console
      setQrData(result.text); // Lưu dữ liệu quét được từ mã QR
      setShowScanner(false);  // Đóng màn hình quét sau khi quét xong
    }
  };

  const handleError = (error) => {
    console.error('Lỗi QR:', error);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh sách thuốc</h2>
      <Button variant="primary" onClick={() => setShowScanner(true)} className="mb-4">
        Quét mã QR
      </Button>

      {/* Hiển thị Modal chứa trình quét QR */}
      <Modal show={showScanner} onHide={() => setShowScanner(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Quét mã QR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </Modal.Body>
      </Modal>

      <Row>
        {medicines.map((medicine) => (
          <Col key={medicine._id} xs={12} md={4} className="mb-4">
            <Card className="medicine-card">
              <Card.Img variant="top" src={medicine.duongDanAnh} className="medicine-image" />
              <Card.Body>
                <Card.Title>{medicine.tenThuoc}</Card.Title>
                <Card.Text>Số lô: {medicine.soLo}</Card.Text>
                {userRole === 'Admin' ? (
                  <Button variant="danger">Xóa</Button>
                ) : userRole === 'Nhà sản xuất' && medicine.nhaSanXuatId === userId ? (
                  <>
                    <Button variant="warning" className="mr-2">Sửa</Button>{' '}
                    <Button variant="danger">Xóa</Button>
                  </>
                ) : (
                  <Button variant="primary">Mua</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {qrData && (
        <div className="qr-data">
          <h5>Dữ liệu từ QR:</h5>
          <p>{qrData}</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
