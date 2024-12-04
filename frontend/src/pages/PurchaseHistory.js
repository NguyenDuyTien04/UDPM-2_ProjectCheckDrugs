import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionHistory = ({ token }) => {
  const [transactions, setTransactions] = useState([]);  // Lưu danh sách giao dịch
  const [loading, setLoading] = useState(true);  // Kiểm tra trạng thái loading
  const [error, setError] = useState(null);  // Lưu lỗi nếu có

  useEffect(() => {
    // Định nghĩa hàm fetchTransactions
    const fetchTransactions = async () => {
      try {
        setLoading(true);  // Bắt đầu tải dữ liệu
        // Gọi API lấy dữ liệu từ backend
        const response = await axios.get('http://localhost:5000/api/transactions/all', {
          headers: {
            'Authorization': `Bearer ${token}`  // Gửi token nếu cần
          }
        });

        console.log("Dữ liệu giao dịch nhận được:", response.data);  // Kiểm tra dữ liệu trả về
        setTransactions(response.data.data);  // Lưu vào state transactions
      } catch (error) {
        console.error("Lỗi khi tải lịch sử giao dịch:", error);
        setError(error.message);  // Lưu lỗi nếu có
      } finally {
        setLoading(false);  // Kết thúc tải dữ liệu
      }
    };

    // Gọi hàm fetchTransactions khi component mount hoặc token thay đổi
    fetchTransactions();
  }, [token]);  // Chạy lại khi token thay đổi

  // Hiển thị trạng thái loading hoặc lỗi
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="transaction-history">
      <h2>Lịch sử Giao dịch</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hành động</th>
            <th>Giá</th>
            <th>Tiền tệ</th>
            <th>Trạng thái</th>
            <th>Ngày giao dịch</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.gameShiftTransactionId}>
                <td>{transaction.gameShiftTransactionId}</td>
                <td>{transaction.action}</td>
                <td>{transaction.price}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.status}</td>
                <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : "Ngày không hợp lệ"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Không có giao dịch nào</td>
            </tr>
          )}
         
         
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
