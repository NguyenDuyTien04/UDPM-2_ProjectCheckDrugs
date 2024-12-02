
import React, { useState, useEffect } from 'react';
import "./styles/PurchaseHistory.css";
const TransactionHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  // Fetch dữ liệu lịch sử giao dịch từ API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/transaction-history`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử giao dịch:', error);
      }
    };
    fetchTransactions();
  }, [userId]);

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
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.action}</td>
              <td>{transaction.price}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.status}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;

