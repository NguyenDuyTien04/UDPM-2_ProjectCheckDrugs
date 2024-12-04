import React, { useState, useEffect } from "react";
import { register } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
  });
  const [error, setError] = useState("");

  // Kết nối ví Phantom
  useEffect(() => {
    const connectWallet = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect(); // Kết nối ví Phantom
          setFormData((prev) => ({
            ...prev,
            walletAddress: response.publicKey.toString(), // Lấy địa chỉ ví từ Phantom
          }));
          toast.success("Kết nối ví Phantom thành công!");
        } catch (err) {
    if (window.solana && window.solana.isPhantom) {
      window.solana
        .connect()
        .then((response) => {
          setFormData((prev) => ({
            ...prev,
            walletAddress: response.publicKey.toString(),
          }));
        })
        .catch((err) => {
          console.error("Kết nối ví thất bại:", err.message);
          toast.error("Vui lòng mở khóa ví Phantom!");
        });
    } else {
      toast.error("Vui lòng cài đặt ví Phantom để tiếp tục.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.walletAddress) {
      toast.error("Vui lòng kết nối ví trước khi đăng ký.");
      return;
    }

    try {
      await register(formData);
      toast.success("Đăng ký thành công!");
    } catch (err) {
      console.error("Đăng ký thất bại:", err.message);
      setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <ToastContainer />
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="walletAddress"
          placeholder="Địa chỉ ví"
          value={formData.walletAddress}
          readOnly
          style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
        />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );


export default Register;
