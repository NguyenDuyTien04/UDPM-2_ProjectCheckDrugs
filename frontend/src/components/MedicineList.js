import React, { useState, useEffect } from 'react';
import { getMedicineList, deleteMedicine } from '../utils/api';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const userRole = localStorage.getItem('role'); // Lấy vai trò người dùng từ localStorage
  const userId = localStorage.getItem('userId'); // Lấy ID người dùng từ localStorage
  console.log(userId, userRole)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getMedicineList();
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

  const handleEdit = (id) => {
    // Xử lý logic sửa thuốc ở đây (có thể điều hướng đến trang chỉnh sửa)
    alert(`Sửa thuốc với ID: ${id}`);
  };

  const handleBuy = () => {
    alert("Chức năng mua thuốc đang phát triển");
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Danh sách thuốc</h2>
      <Row>
        {medicines.map((medicine) => (
          <Col key={medicine._id} xs={12} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={
                  medicine.duongDanAnh.startsWith('/uploads/')
                    ? `http://localhost:5000${medicine.duongDanAnh}`
                    : medicine.duongDanAnh
                }
                alt="Ảnh thuốc"
              />
              <Card.Body>
                <Card.Title>{medicine.tenThuoc}</Card.Title>
                <Card.Text>Số lô: {medicine.soLo}</Card.Text>

                {/* Điều kiện hiển thị các nút dựa trên vai trò */}
                {userRole === 'Khách hàng' ? (
                  <Button variant="primary" onClick={handleBuy}>
                    Mua
                  </Button>
                ) : userRole === 'Admin' ? (
                  <Button variant="danger" onClick={() => handleDelete(medicine._id)}>
                    Xóa
                  </Button>
                ) : userRole === 'Nhà sản xuất' && medicine.nhaSanXuatId._id === userId ? ( // Sử dụng ._id nếu cần
                  <>
                    <Button variant="warning" className="mr-2" onClick={() => handleEdit(medicine._id)}>
                      Sửa
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(medicine._id)}>
                      Xóa
                    </Button>
                  </>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MedicineList;
