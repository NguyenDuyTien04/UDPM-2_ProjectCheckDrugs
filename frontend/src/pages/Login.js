import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { loginUser } from "../services/api";
import "./styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  // Kết nối ví Phantom
  useEffect(() => {
    const connectWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        } catch (err) {
          console.error("Lỗi kết nối ví:", err);
          setError("Vui lòng mở khóa ví Phantom để tiếp tục.");
        }
      } else {
        setError("Vui lòng cài đặt ví Phantom để sử dụng.");
      }
    };
    connectWallet();
  }, []);

  const handleConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setError(""); // Xóa lỗi nếu kết nối thành công
      } catch (err) {
        console.error("Kết nối ví thất bại:", err.message);
        setError("Vui lòng thử lại và mở khóa ví Phantom!");
      }
    } else {
      setError("Vui lòng cài đặt ví Phantom để sử dụng.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletAddress) {
      setError("Bạn cần kết nối ví trước khi đăng nhập.");
      return;
    }

    try {
      const { user, token } = await loginUser({ email, walletAddress });
      localStorage.setItem("token", token);
      localStorage.setItem("walletAddress", walletAddress);
      setUser(user);
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.message);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      {error && <p className="error">{error}</p>}
      {!walletAddress && (
        <button className="connect-wallet-btn" onClick={handleConnectWallet}>
          Kết nối ví Phantom
        </button>
      )}
      {walletAddress && (
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
          <button type="submit">Đăng nhập</button>
        </form>
      )}
    </div>
  );
}

export default Login;
