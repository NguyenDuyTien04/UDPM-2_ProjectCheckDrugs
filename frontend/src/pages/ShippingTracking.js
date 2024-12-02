import React, { useState, useEffect } from "react";
import { fetchPurchaseHistory } from "../services/api"; // API để lấy lịch sử mua bán
import { Pie } from "react-chartjs-2";
import "./styles/TransactionStatusChart.css";

function TransactionStatusChart() {
  const [statusCounts, setStatusCounts] = useState(null); // Lưu trữ số lượng trạng thái giao dịch
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactionStatus = async () => {
      try {
        const data = await fetchPurchaseHistory(); // Lấy dữ liệu giao dịch từ API

        // Xử lý dữ liệu: Tính số lượng giao dịch theo trạng thái
        const counts = data.transactions.reduce((acc, transaction) => {
          acc[transaction.status] = (acc[transaction.status] || 0) + 1;
          return acc;
        }, {});

        setStatusCounts(counts); // Gán dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi tải trạng thái giao dịch:", error);
        alert("Không thể tải trạng thái giao dịch.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactionStatus();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!statusCounts) {
    return <p>Không có dữ liệu để thống kê.</p>;
  }

  // Dữ liệu biểu đồ
  const chartData = {
    labels: Object.keys(statusCounts), // Các trạng thái
    datasets: [
      {
        label: "Số lượng giao dịch",
        data: Object.values(statusCounts), // Số lượng giao dịch theo trạng thái
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ], // Màu sắc
      },
    ],
  };

  return (
    <div className="transaction-status-chart-container">
      <h2>Thống kê trạng thái giao dịch</h2>
      <div style={{ width: "60%", margin: "auto" }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default TransactionStatusChart;
