import React from "react";
import { useNavigate } from "react-router-dom"; // Điều hướng React Router
import "./styles/Home.css";

function Home() {
  const navigate = useNavigate(); // Hook điều hướng

  const handleRegister = () => {
    navigate("/register"); // Điều hướng đến trang đăng ký
  };

  return (
    <div className="home-container">
      <div className="background-animation"></div>
      <div className="content">
        <h1>🚀 Chào mừng đến với Drug Detection System</h1>
        <p>Khám phá hệ thống mua bán thuốc NFT hiện đại, an toàn và minh bạch.</p>
        <button className="register-button" onClick={handleRegister}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

export default Home;
