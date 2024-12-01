import React, { useState, useEffect } from "react";
import { fetchPurchaseHistory } from "../services/api"; // API để lấy lịch sử mua bán
import "./styles/PurchaseHistory.css";

function PurchaseHistory() {
  const [transactions, setTransactions] = useState([]); // Lưu trữ lịch sử giao dịch
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchaseHistory = async () => {
      try {
        const data = await fetchPurchaseHistory(); // Lấy lịch sử giao dịch từ API
        setTransactions(data.transactions); // Gán dữ liệu giao dịch vào state
      } catch (error) {
        console.error("Lỗi khi tải lịch sử mua bán:", error);
        alert("Không thể tải lịch sử mua bán.");
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseHistory();
  }, []);

  return (
    <div className="purchase-history-container">
      <h2>Lịch sử mua bán</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : transactions.length > 0 ? (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID Giao dịch</th>
              <th>Tên NFT</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.nftName}</td>
                <td>{transaction.type}</td>
                <td>
                  {transaction.price} {transaction.currency}
                </td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có giao dịch nào được tìm thấy.</p>
      )}
    </div>
  );
}

export default PurchaseHistory;
