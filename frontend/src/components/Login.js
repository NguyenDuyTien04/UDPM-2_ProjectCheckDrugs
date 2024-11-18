import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import "../styles/Login.css"; // Import file CSS

function Login() {
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái xử lý
  const navigate = useNavigate();

  // Hàm kết nối ví Phantom
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect(); // Kết nối ví Phantom
        setWalletAddress(response.publicKey.toString());
        console.log("Đã kết nối ví Phantom:", response.publicKey.toString());
      } catch (err) {
        console.error("Lỗi kết nối ví:", err.message);
        setError("Không thể kết nối với ví Phantom. Vui lòng thử lại.");
      }
    } else {
      setError("Vui lòng cài đặt ví Phantom để sử dụng.");
    }
  };

  // Gọi kết nối ví Phantom khi component mount
  useEffect(() => {
    connectWallet();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Đăng nhập nếu thông tin hợp lệ
      const response = await login({ walletAddress, email });
      setSuccess("Đăng nhập thành công!");
      console.log("Thông tin người dùng:", response);

      setTimeout(() => {
        navigate("/drugs/list"); // Chuyển hướng sang trang Danh sách thuốc
      }, 1500);
    } catch (err) {
      setError("Lỗi đăng nhập: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin} className="login-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="walletAddress">Địa chỉ ví Phantom:</label>
          <input
            type="text"
            id="walletAddress"
            placeholder="Đang kết nối ví..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
            readOnly // Chỉ cho phép đọc khi đã tự động điền
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading || !walletAddress}>
          {loading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>
      </form>
    </div>
  );
}

export default Login;
