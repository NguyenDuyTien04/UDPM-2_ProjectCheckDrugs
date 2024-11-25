import React, { useState, useEffect } from 'react';
import "./styles/ShippingTracking.css";


const ShippingTracking = () => {
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shipments');
        const result = await response.json();
        if (result.success) {
          setShippingData(result.data);
        } else {
          alert('Không thể tải dữ liệu vận chuyển.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
  
    fetchShippingData();
  }, []);

  return (
    <div>
      <h2>Theo dõi vận chuyển</h2>
      {shippingData.length === 0 ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Mã vận chuyển</th>
              <th>Người nhận</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Cập nhật lần cuối</th>
            </tr>
          </thead>
          <tbody>
          {shippingData.map((shipment) => (
            <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>{shipment.recipientName}</td>
                <td>{shipment.phone}</td>
                <td>{shipment.address}</td>
                <td>{shipment.status}</td>
                <td>{shipment.lastUpdated}</td>
            </tr>
))}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShippingTracking;
