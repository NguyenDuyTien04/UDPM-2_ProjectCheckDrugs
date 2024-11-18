import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Hàm kiểm tra và kết nối ví Phantom
  const checkAndConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // Kiểm tra xem ví đã kết nối trước đó chưa
        const connection = await window.solana.connect({ onlyIfTrusted: true });
        setWalletAddress(connection.publicKey.toString());
        console.log("Ví Phantom đã được kết nối:", connection.publicKey.toString());
      } catch (err) {
        console.error("Lỗi khi kiểm tra hoặc kết nối ví:", err.message);
        setWalletAddress("");
      }
    } else {
      setError("Vui lòng cài đặt ví Phantom để sử dụng chức năng này.");
    }
  };

  // Gọi hàm kiểm tra ví khi component được render
  useEffect(() => {
    checkAndConnectWallet();
  }, []);

  // Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, walletAddress, role }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại!");
      }

      setSuccess("Đăng ký thành công!");
      console.log("Phản hồi từ server:", data);

      setTimeout(() => navigate("/login"), 2000); // Chuyển hướng về trang đăng nhập
    } catch (err) {
      console.error("Lỗi đăng ký:", err.message);
      setError(err.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng Ký</h2>
      <form onSubmit={handleRegister}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ ví Phantom:</label>
          <input
            type="text"
            value={walletAddress || "Đang kiểm tra..."}
            readOnly
            style={{ color: walletAddress ? "#000" : "red" }}
          />
        </div>

        <div className="form-group">
          <label>Vai trò:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">Người dùng</option>
            <option value="consumer">Người tiêu dùng</option>
            <option value="manufacturer">Nhà sản xuất</option>
          </select>
        </div>

        <button type="submit" disabled={!walletAddress}>
          Đăng Ký
        </button>
      </form>
    </div>
  );
}

export default Register;
