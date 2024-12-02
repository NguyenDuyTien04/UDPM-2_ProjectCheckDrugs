import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './styles/TransactionStatusChart.css';

// Đăng ký các component của chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function TransactionStatusChart() {
  const [statusCounts, setStatusCounts] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadTransactionStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions/status-counts");

        if (!response.ok) {
          throw new Error("Không thể tải trạng thái giao dịch.");
        }

        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi tải trạng thái giao dịch:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionStatus();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!statusCounts || Object.keys(statusCounts).length === 0) {
    return <p>Không có dữ liệu để thống kê.</p>;
  }

  const chartData = {
    labels: ["Pending", "Completed", "Failed"], // Các trạng thái
    datasets: [
      {
        label: "Số lượng giao dịch",
        data: [
          statusCounts.Pending,
          statusCounts.Completed,
          statusCounts.Failed,
        ], // Dữ liệu trạng thái
        backgroundColor: [
          "#FF6384", // Màu cho Pending
          "#36A2EB", // Màu cho Completed
          "#FFCE56", // Màu cho Failed
        ],
      },
    ],
  };

  return (
    <div className="transaction-status-chart-container">
      <h2>Thống kê trạng thái giao dịch</h2>
      <div className="chart-container">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default TransactionStatusChart;
