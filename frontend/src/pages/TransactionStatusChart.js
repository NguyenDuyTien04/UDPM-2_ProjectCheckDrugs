import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các component của chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function TransactionStatusChart() {
  const [statusCounts, setStatusCounts] = useState(null); // Lưu trữ số lượng trạng thái giao dịch
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi (nếu có)

  useEffect(() => {
    // Hàm để lấy dữ liệu từ API
    const loadTransactionStatus = async () => {
      try {
        // Gọi API backend để lấy trạng thái giao dịch
        const response = await fetch("http://localhost:5000/api/transactions/status-counts");

        if (!response.ok) {
          throw new Error("Không thể tải trạng thái giao dịch.");
        }

        const data = await response.json(); // Dữ liệu trả về từ API
        setStatusCounts(data); // Lưu dữ liệu vào state
      } catch (error) {
        setError(error.message); // Xử lý lỗi nếu có
        console.error("Lỗi khi tải trạng thái giao dịch:", error);
      } finally {
        setLoading(false); // Đảm bảo trạng thái loading luôn được cập nhật
      }
    };

    loadTransactionStatus(); // Gọi hàm load dữ liệu
  }, []); // Hàm này chỉ chạy một lần khi component mount

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị khi đang tải
  }

  if (error) {
    return <div>{error}</div>; // Hiển thị khi có lỗi
  }

  if (!statusCounts || Object.keys(statusCounts).length === 0) {
    return <p>Không có dữ liệu để thống kê.</p>; // Nếu không có dữ liệu
  }

  // Dữ liệu biểu đồ
  const chartData = {
    labels: Object.keys(statusCounts), // Các trạng thái giao dịch
    datasets: [
      {
        label: "Số lượng giao dịch",
        data: Object.values(statusCounts), // Số lượng giao dịch theo trạng thái
        backgroundColor: [
          "#FF6384", // Màu cho mỗi trạng thái
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="transaction-status-chart-container">
      <h2>Thống kê trạng thái giao dịch</h2>
      <div style={{ width: "60%", margin: "auto" }}>
        <Pie data={chartData} /> {/* Hiển thị biểu đồ */}
      </div>
    </div>
  );
}

export default TransactionStatusChart;
