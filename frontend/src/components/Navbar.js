import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "./styles/Navbar.css";

function Navbar() {
  const { user, logout } = useUserContext();

  return (
    <nav className="navbar">
      <h1>Drug Detection System</h1>
      <ul>
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/collections">Bộ sưu tập</Link>
        </li>
        <li>
          <Link to="/create-nft">Tạo NFT</Link>
        </li>
        <li>
          <Link to="/nft-list">Danh sách NFT</Link>
        </li>
        <li>
          <Link to="/market">Chợ NFT</Link>
        </li>
        <li>
          <Link to="/purchase-history">Lịch sử giao dịch</Link>
        </li>
        <li>
          <Link to="/shippingtracking">Vận chuyển</Link>
        </li>
        {user ? (
          <>
            <li className="wallet-info">Ví: {user.walletAddress.slice(0, 5)}...</li>
            <li>
              <button className="logout-btn" onClick={logout}>
                Đăng xuất
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link to="/register">Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
