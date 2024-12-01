import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { loginUser } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  // Tự động kết nối ví Phantom khi trang được tải
  useEffect(() => {
    const autoConnectWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
          toast.success("Ví Phantom đã được kết nối!");
        } catch (err) {
          console.warn("Không thể tự động kết nối ví:", err.message);
        }
      } else {
        toast.warning("Vui lòng cài đặt ví Phantom để sử dụng chức năng này.");
      }
    };
    autoConnectWallet();
  }, []);

  // Hàm kết nối ví khi người dùng nhấn nút
  const handleConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        toast.success("Kết nối ví thành công!");
      } catch (err) {
        console.error("Kết nối ví thất bại:", err.message);
        toast.error("Vui lòng thử lại và đảm bảo ví của bạn đã mở khóa.");
      }
    } else {
      toast.warning("Vui lòng cài đặt ví Phantom để sử dụng chức năng này.");
    }
  };

  // Hàm xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!walletAddress) {
      toast.error("Bạn cần kết nối ví trước khi đăng nhập.");
      return;
    }
  
    try {
      // Gọi API để đăng nhập
      const { user, token } = await loginUser({ email, walletAddress });
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("walletAddress", walletAddress);
      setUser({ walletAddress, token }); // Cập nhật context
      toast.success("Đăng nhập thành công!");
      navigate("/"); // Điều hướng về trang chủ
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.message);
      toast.error(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };
  

  return (
    <div className="login-container">
      <ToastContainer />
      <h2>Đăng nhập</h2>
      {!walletAddress && (
        <button className="connect-wallet-btn" onClick={handleConnectWallet}>
          Kết nối ví Phantom
        </button>
      )}
      {walletAddress && (
        <form onSubmit={handleSubmit}>
    
          <input
            id="email"
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        
          <input
            id="walletAddress"
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
