import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { loginUser } from "../services/api";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify
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
          toast.success("Kết nối ví thành công!");
        } catch (err) {
          console.warn("Không thể tự động kết nối ví:", err.message);
          console.error("Lỗi kết nối ví:", err);
          toast.error("Vui lòng mở khóa ví Phantom để tiếp tục.");
        }
      } else {
        toast.warning("Vui lòng cài đặt ví Phantom để sử dụng.");
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
        setError(""); // Xóa lỗi nếu kết nối thành công
        toast.success("Kết nối ví thành công!");
      } catch (err) {
        console.error("Kết nối ví thất bại:", err.message);
        toast.error("Vui lòng thử lại và đảm bảo ví của bạn đã mở khóa.");
        toast.error("Vui lòng thử lại và mở khóa ví Phantom!");
      }
    } else {
      toast.warning("Vui lòng cài đặt ví Phantom để sử dụng.");
    }
  };

  // Hàm xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!walletAddress) {
      toast.error("Bạn cần kết nối ví trước khi đăng nhập.");
      toast.error("Bạn cần kết nối ví trước khi đăng nhập.");
      return;
    }
  
    try {
      // Gọi API để đăng nhập
      const { user, token } = await loginUser({ email, walletAddress });
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("walletAddress", walletAddress);
      setUser(user);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.message);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
    }
  };
  

  return (
    <div className="login-container">
      <ToastContainer /> {/* Container để hiển thị thông báo */}
      <h2>Đăng nhập</h2>
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