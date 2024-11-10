import React, { useState, useEffect } from 'react';
import { getMedicineList, deleteMedicine } from '../utils/api';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn cần đăng nhập để xem danh sách thuốc');
        return;
      }
      try {
        const response = await getMedicineList(token);
        setMedicines(response);
      } catch (err) {
        console.error('Lỗi:', err.message);
        alert('Lỗi khi tải danh sách thuốc');
      }
    };
    fetchMedicines();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để xóa thuốc');
      return;
    }
    try {
      await deleteMedicine(id, token);
      setMedicines(medicines.filter((medicine) => medicine._id !== id));
      alert('Xóa thuốc thành công');
    } catch (err) {
      console.error('Lỗi:', err.message);
      alert('Xóa thuốc thất bại');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Danh sách thuốc</h2>
      <Row>
        {medicines.map((medicine) => (
          <Col key={medicine._id} xs={12} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{medicine.tenThuoc}</Card.Title>
                <Card.Text>Số lô: {medicine.soLo}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(medicine._id)}>
                  Xóa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MedicineList;
