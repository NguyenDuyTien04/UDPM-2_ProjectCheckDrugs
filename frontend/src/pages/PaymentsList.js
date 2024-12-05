import React, { useEffect, useState } from "react";
import "./styles/PaymentsList.css";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const url = "http://localhost:5000/api/payments";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách thanh toán.");
        }
        const data = await response.json();
        setPayments(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách thanh toán...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="payments-list">
      <h2>Danh sách Thanh Toán</h2>
      {payments.length === 0 ? (
        <p>Không có thanh toán nào.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} className="payment-item">
              <p><strong>ID:</strong> {payment.id}</p>
              <p><strong>Trạng thái:</strong> {payment.status}</p>
              <p><strong>Tên Sản Phẩm:</strong> {payment.sku.item.name}</p>
              <p><strong>Số tiền:</strong> {payment.price.naturalAmount} {payment.price.currencyId}</p>
              <p><strong>Email Người Mua:</strong> {payment.purchaser.email}</p>
              <p><strong>Đang Rao Bán:</strong> {payment.sku.item.forSale ? "Có" : "Không"}</p>
              <p><strong>Người Bán:</strong> {payment.sku.item.owner.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentsList;
