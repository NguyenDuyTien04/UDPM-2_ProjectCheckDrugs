import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./styles/ShippingTracking.css";

const ShippingTracking = () => {
  const [shippingData, setShippingData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/shipments");
        const result = await response.json();
        if (result.success) {
          setShippingData(result.data);
          calculateStatusCounts(result.data);
        } else {
          alert("Không thể tải dữ liệu vận chuyển.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchShippingData();
  }, []);

  // Xử lý dữ liệu để đếm số lượng trạng thái
  const calculateStatusCounts = (data) => {
    const counts = data.reduce((acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1;
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  // Dữ liệu biểu đồ
  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Số lượng trạng thái",
        data: Object.values(statusCounts),
        backgroundColor: [
          "#4CAF50", // Màu xanh cho trạng thái hoàn thành
          "#FFC107", // Màu vàng cho trạng thái đang xử lý
          "#F44336", // Màu đỏ cho trạng thái thất bại
        ],
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Theo dõi vận chuyển</h2>

      {shippingData.length === 0 ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Biểu đồ trạng thái */}
          <div className="chart-container" style={{ marginBottom: "20px" }}>
            <h3>Thống kê trạng thái</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Thống kê trạng thái vận chuyển",
                  },
                },
              }}
            />
          </div>

          {/* Bảng dữ liệu vận chuyển */}
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
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
        </>
      )}
    </div>
  );
};

export default ShippingTracking;
