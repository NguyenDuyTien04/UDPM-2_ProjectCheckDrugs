// HomePage.js
import React, { useState, useEffect } from 'react';
import { getMedicineList } from '../utils/api';
import { Card, Button, Row, Col } from 'react-bootstrap';
import './css/HomePage.css';

function HomePage() {
  const [medicines, setMedicines] = useState([]);

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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh sách thuốc</h2>
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
    </div>
  );
}

export default HomePage;
