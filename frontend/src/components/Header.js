// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faSignOutAlt, faUserPlus, faWallet, faCapsules, faUserShield } from '@fortawesome/free-solid-svg-icons';
import './css/Header.css';

function Header() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Kết nối với Phantom Wallet
  useEffect(() => {
    if (window.solana) {
      window.solana.on('connect', () => {
        console.log('Connected to Phantom Wallet');
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());
        console.log('Connected account:', resp.publicKey.toString());
        alert('Kết nối ví thành công!');
      } catch (err) {
        console.error('Lỗi khi kết nối ví Phantom:', err.message);
      }
    } else {
      alert('Bạn cần cài đặt ví Phantom để sử dụng chức năng này.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark custom-header">
      <div className="container-fluid">
        {/* Logo và nút kết nối ví */}
        <div className="d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faCapsules} className="me-2" />
            Ứng Dụng Quản Lý Thuốc
          </Link>
        </div>

        {/* Nút điều hướng (trên thiết bị nhỏ) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu điều hướng */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FontAwesomeIcon icon={faHome} className="me-1" />
                Trang Chủ
              </Link>
            </li>
            {token && userRole === 'Nhà sản xuất' && (
              <li className="nav-item">
                <Link className="nav-link" to="/add-medicine">
                  <FontAwesomeIcon icon={faCapsules} className="me-1" />
                  Thêm Thuốc
                </Link>
              </li>
            )}
            {token && userRole === 'Admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-panel">
                  <FontAwesomeIcon icon={faUserShield} className="me-1" />
                  Quản Trị
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav align-items-center">
            {!token ? (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-light" to="/login">
                    <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                    Đăng Nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/register">
                    <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                    Đăng Kí
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Đăng Xuất
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
