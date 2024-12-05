import React, { useState, useEffect } from "react";
// import './styles/TransactionHistory.css';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadTransactionHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions/api/transactions/history");

        if (!response.ok) {
          throw new Error("Không thể tải lịch sử giao dịch.");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi tải lịch sử giao dịch:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionHistory();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (transactions.length === 0) {
    return <p>Không có lịch sử giao dịch.</p>;
  }

  return (
    <div className="transaction-history-container">
      <h2>Lịch sử giao dịch</h2>
      <table className="transaction-history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Trạng thái</th>
            <th>Số tiền</th>
            <th>Ngày giao dịch</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.status}</td>
              <td>{transaction.amount.toLocaleString()} VND</td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
