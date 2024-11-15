// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import AddMedicine from './components/AddMedicine';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PhantomConnectButton from './components/PhantomConnectButton';
import BuyNFT from './components/BuyNFT';
import ForgotPassword from './components/ForgotPassword'; // Import trang quên mật khẩu

function App() {
  return (
    <Router>
      <Header />
      <main className="container mt-4">
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-medicine" element={<AddMedicine />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/buy-nft" element={<BuyNFT />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Đường dẫn cho quên mật khẩu */}
        </Routes>
      </main>
      <Footer />
      <PhantomConnectButton />
    </Router>
  );
}

export default App;
