import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api"; // API gọi backend
import "./styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("consumer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Kết nối ví Phantom và lấy địa chỉ ví
  useEffect(() => {
    const connectWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect();
          setWalletAddress(response.publicKey.toString());
        } catch (err) {
          console.error("Kết nối ví thất bại:", err.message);
          setError("Vui lòng mở khóa ví Phantom để sử dụng hệ thống.");
        }
      } else {
        setError("Vui lòng cài đặt ví Phantom!");
      }
    };

    connectWallet();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, walletAddress, role });
      alert("Đăng ký thành công!");
      navigate("/login"); // Điều hướng đến trang đăng nhập
    } catch (err) {
      setError("Đăng ký không thành công. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Địa chỉ ví (tự động)"
          value={walletAddress}
          readOnly
          style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="admin">admin</option>
          <option value="consumer">Người tiêu dùng</option>
          <option value="manufacturer">Nhà sản xuất</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
