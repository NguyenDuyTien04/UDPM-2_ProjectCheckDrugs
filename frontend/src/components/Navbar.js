import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Sử dụng useUserContext để thay thế UserContext
import "./styles/Navbar.css";

function Navbar() {
  const { user, logout } = useUserContext(); // Lấy user và logout từ context

  return (
    <nav className="navbar">
      <h1>Drug Detection System</h1>
      <ul>
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/drugs-list">Danh sách thuốc</Link></li>
        <li><Link to="/add-drug">Thêm thuốc</Link></li>
        <li><Link to="/market-nft">Market NFT</Link></li>
        <li><Link to="/purchase-history">Lịch sử mua bán</Link></li>
        {user ? (
          <>
            <li>{user.walletAddress.slice(0, 5)}...</li>
            <li>
              <button onClick={logout}>Đăng xuất</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Đăng nhập</Link></li>
            <li><Link to="/register">Đăng ký</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
