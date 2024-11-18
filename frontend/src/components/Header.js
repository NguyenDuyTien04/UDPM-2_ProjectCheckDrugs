import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ walletAddress, setWalletAddress, isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Hàm kết nối ví Phantom
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        console.log("Kết nối ví thành công:", response.publicKey.toString());
      } catch (err) {
        console.error("Lỗi kết nối ví:", err.message);
      }
    } else {
      alert("Vui lòng cài đặt ví Phantom để sử dụng!");
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setWalletAddress(null);
    console.log("Đã đăng xuất.");
    navigate("/login");
  };

  return (
    <header>
      <h1>Drug Management</h1>
      <nav>
        <Link to="/">Trang chủ</Link>
        {isLoggedIn && (
          <>
            <Link to="/drugs/add">Thêm Thuốc</Link>
            <Link to="/drugs/list">Danh Sách Thuốc</Link>
            <Link to="/nft/create">Tạo NFT</Link>
          </>
        )}
        {!isLoggedIn ? (
          <>
            <Link to="/register">Đăng ký</Link>
            <Link to="/login">Đăng nhập</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-button">
            Đăng Xuất
          </button>
        )}
        {!walletAddress ? (
          <button onClick={connectWallet} className="connect-wallet-button">
            Kết nối ví
          </button>
        ) : (
          <span className="wallet-display">
            Ví: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        )}
      </nav>
    </header>
  );
};

export default Header;
